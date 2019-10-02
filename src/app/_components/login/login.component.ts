import { GoogleUserService } from './../../_services/google-user.service';
import { FacebookUserService } from './../../_services/facebook-user.service';
import { CreateUserDTO } from './../../_models/dto/create-user-dto';
import { environment } from './../../../environments/environment';
import { UserLoginViewDTO } from './user-login-view-dto';
import { ShoppingCartService } from './../../_services/shopping-cart.service';
import { UserService } from './../../_services/user.service';
import { NgForm } from '@angular/forms';
import { Component, OnInit, ElementRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from './../../_services/authentication.service';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ng2-facebook-sdk';
import { RegistrationTypeEnum } from '../../_models/_enums/registration-type-enum.enum';
import * as Raven from 'raven-js';

@Component({
    moduleId: module.id,
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css'
    ],
    encapsulation: ViewEncapsulation.None
})

export class LoginComponent implements OnInit {

    public platformName = environment.platformName;

    model: UserLoginViewDTO = new UserLoginViewDTO();
    userLoginForm: NgForm;
    @ViewChild('userLoginForm') currentForm: NgForm;

    loading = false;
    returnUrl: string;
    private clientId: string = environment.googleClientId;
    showFName: boolean = false;

    fbAppId: string = environment.fbAppId;
    showFailedLoginMessage: boolean = false;

    private scope = [
    'profile',
    'email',
    'https://www.googleapis.com/auth/plus.me',
    'https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/admin.directory.user.readonly'
  ].join(' ');

  public auth2: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private fb: FacebookService,
        private element: ElementRef,
        private userService: UserService,
        private shoppingCartService: ShoppingCartService,
        private facebookUserService: FacebookUserService,
        private googleUserService: GoogleUserService,) {

        this.fbInit();
    }

    fbInit() {
      let initParams: InitParams = {
            appId: this.fbAppId,
            xfbml: true,
            version: 'v2.8'
        };

        this.fb.init(initParams);
    }

    ngOnInit() {
        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    login() {
        this.loading = true;
        
        this.authenticationService.login(this.model.email, this.model.password, RegistrationTypeEnum.EMAIL)
            .subscribe(
                loginResult => {
                    this.loading = false;

                    if(loginResult.success) {
                      // Sync shopping cart
                      this.shoppingCartService.setShoppingCart();

                      Raven.setUserContext({
                          id: loginResult.uniqueId
                      });
                      
                      this.router.navigateByUrl(this.returnUrl);
                    } else {
                      this.validateForm();
                      this.showFailedLoginMessage = true;
                    }
                    
                },
                error => {
                    this.loading = false;
                });
    }

    loginFacebook(): void {

      this.facebookLogin(true);
        

    }

    facebookLogin(reauth?: boolean) {
      // let options = { "scope": "email"};

      // if(reauth) {
       let options = { "scope": "email",
        "auth_type": "https" };
      // }

      this.fb.login(options)
        .then((response: LoginResponse) => {

          let uuid = response.authResponse.userID;
          let credentials = response.authResponse.accessToken;

          this.authenticationService.login(uuid, credentials, RegistrationTypeEnum.FACEBOOK)
            .subscribe(
                userLoginResult => {
                    this.loading = false;
                  if(userLoginResult.success) {
                      Raven.setUserContext({
                        id: userLoginResult.uniqueId
                      });
                      
                      // Sync shopping cart
                      this.shoppingCartService.setShoppingCart();
                      
                      this.router.navigateByUrl(this.returnUrl);
                  } else {
                    // Create account
                    this.facebookUserService.getUserInfo(uuid, credentials).subscribe(
                      facebookUserResult => {
                        let createUserDTO: CreateUserDTO = new CreateUserDTO();
                        createUserDTO.firstName = facebookUserResult.firstName;
                        createUserDTO.lastName = facebookUserResult.lastName;
                        createUserDTO.email = facebookUserResult.email;
                        createUserDTO.registrationType = RegistrationTypeEnum.FACEBOOK;
                        createUserDTO.registrationId = uuid;
                        createUserDTO.credential = credentials;

                        let userImgUrl = 'https://graph.facebook.com/' + facebookUserResult.id + '/picture?width=300&height=300';
                        let base64ImgUrl = this.getBase64Image(userImgUrl, createUserDTO);
                        
                        //Set user info for create user and navigate to registration
                        this.authenticationService.userToCreate = createUserDTO;
                        this.navToRegister();
                      });
                  }
                },
                error => {
                    this.loading = false;
                });
          })
        .catch((error: any) => console.error(error));
    }


  public googleInit() {
    this.testLogging('Loading google init');
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.clientId,
        scope: this.scope
      });
      this.attachSignin(this.element.nativeElement.querySelector('#googleLoginBtn'));
    });
  }

  public attachSignin(element) {
    
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        this.testLogging('Attaching signin handler');
        let profile = googleUser.getBasicProfile();

        let uuid = profile.getId();
        let credentials = googleUser.getAuthResponse().id_token;

        this.authenticationService.login(uuid, credentials, RegistrationTypeEnum.GOOGLE)
          .subscribe(
              userLoginResult => {
                if(userLoginResult.success) {
                  this.testLogging('Call auth service');
                  this.loading = false;

                  //Set the local user after
                  //this.userService.setLocalUser(); //The user is returned with the response to login now

                  // Sync shopping cart
                  this.shoppingCartService.setShoppingCart();

                  Raven.setUserContext({
                      id: userLoginResult.uniqueId
                  });

                  
                  this.router.navigateByUrl(this.returnUrl);
                } else {
                  // Create account
                  this.googleUserService.getUserInfo(googleUser.Zi.access_token).subscribe(
                    googleUserInfoResult => {
                      let createUserDTO: CreateUserDTO = new CreateUserDTO();
                      createUserDTO.firstName = googleUserInfoResult.firstName;
                      createUserDTO.lastName = googleUserInfoResult.lastName;
                      createUserDTO.email = googleUserInfoResult.email;
                      createUserDTO.registrationType = RegistrationTypeEnum.GOOGLE;
                      createUserDTO.registrationId = uuid;
                      createUserDTO.credential = credentials;
                      this.getBase64Image(googleUserInfoResult.imgUrl, createUserDTO);
                      
                      //Set user info for create user and navigate to registration
                      this.authenticationService.userToCreate = createUserDTO;
                      this.navToRegister();
                    });
                }
              },
              error => {
                  this.loading = false;
              });

      }, function (error) {
        
      });
  }

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
  

  ngAfterViewInit() {
    this.googleInit();
    window.scrollTo(0, 0);
  }

  public showFNamee(){
    this.showFName = true;
  }

  onSubmit(valid, event: Event){
    //event.preventDefault();
      if (valid) {
        this.login();
      } else {
        this.validateForm();
      }
    }

  validateForm() {
    this.showFailedLoginMessage = false;
    this.userLoginForm = this.currentForm;

    const form = this.userLoginForm.form;

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
    'required':      'Email is required.',
    'email':      'Invalid email.',
  },
  'password': {
    'required': 'Password is required.'
  }
};

  navToRegister() {
    this.router.navigate(['/register'], { queryParams: { returnUrl: this.returnUrl }})
  }

  testLogging(logStr: string) {
    if(window.console) {
      console.log(logStr);
    }
  }
}

