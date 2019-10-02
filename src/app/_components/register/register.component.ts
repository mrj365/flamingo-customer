import { ShoppingCartService } from './../../_services/shopping-cart.service';
import { environment } from './../../../environments/environment';
import { CreateUserStep2ViewDTO } from './create-user-step2-view-dto';
import { CreateUserStep1ViewDTO } from './create-user-step1-view-dto';
import { UserService } from './../../_services/user.service';
import { NgForm } from '@angular/forms';
import { GoogleUserService } from './../../_services/google-user.service';
import { CreateUserDTO } from './../../_models/dto/create-user-dto';
import { Component, OnInit, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from './../../_services/authentication.service';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ng2-facebook-sdk';
import { RegistrationTypeEnum } from '../../_models/_enums/registration-type-enum.enum';
import { FacebookUserService } from '../../_services/facebook-user.service';
import * as Raven from 'raven-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
        './register.component.css'
    ]
})
export class RegisterComponent implements OnInit {

    public platformName = environment.platformName;

    model: CreateUserStep1ViewDTO = new CreateUserStep1ViewDTO();
    createUserStep1Form: NgForm;
    @ViewChild('creatUserStep1Form') currentForm: NgForm;
    
    userDetails: CreateUserStep2ViewDTO = new CreateUserStep2ViewDTO();
    createUserStep2Form: NgForm;
    @ViewChild('creatUserStep2Form') currentForm2: NgForm;

    showUserDetailsForm = false;
    
    fbAppId: string = environment.fbAppId;
    
    
    
    loading = false;
    returnUrl: string;

    private clientId: string = environment.googleClientId;
    emailRegistration: boolean = false;
    registrationType: RegistrationTypeEnum = RegistrationTypeEnum.EMAIL;
    private createUserDTO: CreateUserDTO = new CreateUserDTO();
    userImg = '';

    showUserExistsError = false;

    private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly',
    'https://www.googleapis.com/auth/userinfo.profile' // Get user info
  ].join(' ');

  public gAuth: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private fb: FacebookService,
        private element: ElementRef,
        private facebookUserService: FacebookUserService,
        private googleUserService: GoogleUserService,
        private userService: UserService,
        private shoppingCartService: ShoppingCartService) {

        let initParams: InitParams = {
            appId: this.fbAppId,
            xfbml: true,
            version: 'v2.8'
        };

        fb.init(initParams);
    }

    ngOnInit() {

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.populateUserFromLogin(); //Get user details from registration form if present
    }

    /**
     * If the user tried to login using fb or google, but they did not aleady have an account,
     * their information will be passed to the authentication servcies so it can be retrieved 
     * and used in this component to register the user
     */
    populateUserFromLogin() {
      let userToCreate: CreateUserDTO = this.authenticationService.userToCreate;

      if(userToCreate && userToCreate.credential){
        this.createUserDTO = userToCreate;
        this.registrationType = this.createUserDTO.registrationType;
        this.model.email = this.createUserDTO.email;
        
        this.userDetails.email = this.createUserDTO.email;
        this.userDetails.firstName = this.createUserDTO.firstName;
        this.userDetails.lastName = this.createUserDTO.lastName;
        this.toggleUserDetailsForm();
      }
    }

    register() {
        this.loading = true;

        if(this.registrationType === RegistrationTypeEnum.EMAIL) {
           this.createUserDTO.registrationId = this.model.email;
           this.createUserDTO.credential = this.model.email;
        }

        // If the user email could not be obtained from faceboo, use the manual entry
        if(this.registrationType === RegistrationTypeEnum.FACEBOOK && !this.model.email) {
          this.createUserDTO.email = this.userDetails.email;
        } else {
           this.createUserDTO.email = this.model.email;
        }

        
        this.createUserDTO.credential = this.createUserDTO.credential;
        this.createUserDTO.registrationId = this.createUserDTO.registrationId;
        this.createUserDTO.registrationType = this.registrationType;
        this.createUserDTO.firstName = this.userDetails.firstName;
        this.createUserDTO.lastName = this.userDetails.lastName;
        this.createUserDTO.phone = this.userDetails.phone;

        this.authenticationService.register(this.createUserDTO)
            .subscribe(
                data => {
                    this.loading = false;

                    //Set the local user after
                    this.userService.setLocalUser();

                    this.router.navigateByUrl(this.returnUrl);
                },
                error => {
                    this.loading = false;
                });
    }

    loginFacebook(): void {

      let options = { "scopr": "email",
        "auth_type": "https" };

        this.fb.login(options)
        .then((response: LoginResponse) => {

          let uuid = response.authResponse.userID;
          let credentials = response.authResponse.accessToken;

          this.facebookUserService.getUserInfo(uuid, credentials).subscribe(
              facebookUserResult => {
                this.userDetails.firstName = facebookUserResult.firstName;
                this.userDetails.lastName = facebookUserResult.lastName;
                this.model.email = facebookUserResult.email;
                this.registrationType = RegistrationTypeEnum.FACEBOOK;
                this.createUserDTO.registrationId = uuid;
                this.createUserDTO.credential = credentials;

                let userImgUrl = 'https://graph.facebook.com/' + facebookUserResult.id + '/picture?width=300&height=300';
                //this.userImg = 'https://graph.facebook.com/' + facebookUserResult.id + '/picture?width=300&height=300';

                // let base64ImgUrl = this.getBase64Image(document.getElementById('imageid'));
                // this.createUserDTO.profileImageBase64 = base64ImgUrl;
                 let base64ImgUrl = this.getBase64Image(userImgUrl, this.createUserDTO);
                this.loginUserIfExists(uuid, credentials, RegistrationTypeEnum.FACEBOOK);
              });
          })
        .catch((error: any) => console.error(error));

    }

  public googleInit() {

    gapi.load('auth2', () => {
      this.gAuth = gapi.auth2.init({
        client_id: this.clientId,
        scope: this.scope
      });
      this.attachSignin(this.element.nativeElement.querySelector('#googleBtn'));
    });
  }

  public attachSignin(element) {
    this.gAuth.attachClickHandler(element, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();

        let uuid = profile.getId();
        let credentials = googleUser.getAuthResponse().id_token;
        
        this.googleUserService.getUserInfo(googleUser.Zi.access_token).subscribe(
          googleUserInfoResult => {
            this.userDetails.firstName = googleUserInfoResult.firstName;
            this.userDetails.lastName = googleUserInfoResult.lastName;
            this.model.email = googleUserInfoResult.email;
            this.registrationType = RegistrationTypeEnum.GOOGLE;
            this.createUserDTO.registrationId = uuid;
            this.createUserDTO.credential = credentials;

            this.getBase64Image(googleUserInfoResult.imgUrl, this.createUserDTO);

            this.loginUserIfExists(uuid, credentials, RegistrationTypeEnum.GOOGLE);

          });

      }, function (error) {

      });
  }

  public loginUserIfExists(registrationId: string, credential: string, registrationType: RegistrationTypeEnum) {
        this.userService.checkUserExistsWithRegistationId(registrationId, registrationType).subscribe(userExistsWithRegistrationId =>
      {
        if (userExistsWithRegistrationId) {
          this.authenticationService.login(registrationId, credential, registrationType).subscribe(
                data => {
                    this.loading = false;
                    
                    // Sync shopping cart
                    this.shoppingCartService.setShoppingCart();

                    this.router.navigateByUrl(this.returnUrl);
                },
                error => {
                    this.loading = false;
                });
        } else {
          this.toggleUserDetailsForm();
        }
      });
  }

  ngAfterViewInit() {
    this.googleInit();
    window.scrollTo(0, 0);
  }

  public showEmailRegistration() {
    this.emailRegistration = true;
  }

  public toggleUserDetailsForm() {
    this.showUserDetailsForm = true;
  }

  onSubmit(valid, event: Event){

    this.userService.checkUserExistsWithRegistationId(this.model.email, RegistrationTypeEnum.EMAIL).subscribe(userExistsWithEmail =>
      {
        if (userExistsWithEmail) {
          this.showUserExistsError = true;
          //show error
          if(userExistsWithEmail){
            this.validateForm();
          }
        } else {
          this.showUserExistsError = false;
          // don't show error
          if (valid) {
            this.toggleUserDetailsForm();
          } else {
            this.validateForm();
          }
        }
      });
    
    //event.preventDefault();
      // if (valid) {
      //   this.toggleUserDetailsForm();
      // } else {
      //   this.validateForm();
      // }
    }

  validateForm() {
    this.createUserStep1Form = this.currentForm;

    const form = this.createUserStep1Form.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && !control.valid) {
        const messages = this.validationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'email': '',
    'password': ''
  };

validationMessages = {
  'email': {
    'required': 'Email is required.',
    'email': 'Email invalid.'
  },
  'password': {
    'required': 'Password is required.',
    'notblank': 'Password cannot be blank space.',
    'minlength': 'Password must be at least 6 characters long',
  }
};

onSubmit2(valid, event: Event){
    //event.preventDefault();
      if (valid) {
        this.register();
      } else {
        this.validateForm2();
      }
    }

  validateForm2() {
    this.createUserStep2Form = this.currentForm2;

    const form = this.createUserStep2Form.form;

    for (const field in this.formErrors2) {
      // clear previous error message (if any)
      this.formErrors2[field] = '';
      const control = form.get(field);

      if (control && !control.valid) {
        const messages = this.validationMessages2[field];

        for (const key in control.errors) {
          this.formErrors2[field] += messages[key];
        }
      }
    }
  }

  formErrors2 = {
    'firstName': '',
    'lastName': '',
    'email': '', // If email is not populated by fb, it will need to be filled in on the second form
    'phone': ''
  };

  validationMessages2 = {
    'firstName': {
      'required':      'First name is required.',
      'notblank':      'First name is required.',
    },
    'lastName': {
      'required':      'Last name is required.',
      'notblank':      'Last name is required.'
    },
    'email': {
      'required':      'Email is required.',
      'email':      'Invalid email.'
    },
    'phone': {
      'required':      'Phone number is required.',
      'minlength':      'Please enter the 3 digit area code followed by the 7 digit phone number.',
      'maxlength':      'Please enter the 3 digit area code followed by the 7 digit phone number.',
      'phone': 'Invalid phone number.'
    }
  };

  getBase64Image(imgUrl: string, createUserDTO: CreateUserDTO) {
    this.toDataURL(imgUrl, 'image/png', function(dataUrl) {
      createUserDTO.profileImageBase64 = dataUrl;
    });
  }

  toDataURL(src, outputFormat, callback) {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let dataURL;
        canvas.height = img.naturalHeight;
        canvas.width = img.naturalWidth;
        ctx.drawImage(img, 0, 0);
        dataURL = canvas.toDataURL(outputFormat);
      callback(dataURL);
    };

    img.src = src;
    if (img.complete || img.complete === undefined) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
      img.src = src;
    }
  }

  setUserImgUrl(stringImgUrl: string) {
    this.createUserDTO.profileImageBase64 = stringImgUrl;
  }  

  navToLogin() {
    this.router.navigate(['/login'], { queryParams: { returnUrl: this.returnUrl }});
  }
}
