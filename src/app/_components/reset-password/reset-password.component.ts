import { ActivatedRoute } from '@angular/router';
import { ResetPasswordFormDTO } from './reset-password-form-dto';
import { UserService } from './../../_services/user.service';
import { NgForm } from '@angular/forms';
import { ForgotPasswordFormDTO } from './../forgot-password/forgot-password-form-dto';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordFormDTO: ResetPasswordFormDTO = new ResetPasswordFormDTO();
  resetPasswordNgForm: NgForm;
  @ViewChild('resetPasswordNgForm') currentForgotPasswordForm: NgForm;

  passwordReset: boolean = false;
  token: string = '';

  constructor(private userService: UserService, 
    private route: ActivatedRoute,) { }

  ngAfterViewInit() {
    // Windows navigated to by sibling resourse do
    // not automtically scroll to top. Thiw sill scroll to top
      window.scrollTo(0, 0);
   }

  ngOnInit() {

    // Get the storefrontId from the url
    this.route.queryParams.subscribe(queryParams => {
       this.token = queryParams['token'];
    });

  }

    onSubmit(valid, event: Event){    
      if (valid) {
        this.passwordReset = true;
        this.userService.resetPassword(this.token, this.resetPasswordFormDTO.password).subscribe();
        //Get rid of error messages
        this.validateForm();
      } else {
        this.validateForm();
      }
    }

  validateForm() {
    this.resetPasswordNgForm = this.currentForgotPasswordForm;

    const form = this.resetPasswordNgForm.form;

    for (const field in this.formErrors) {
      // clear previous error message (if asny)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && !control.valid) {
        const messages = this.formErrorsvalidationMessages[field];

        for (const key in control.errors) {
          this.formErrors[field] += messages[key];
        }
      }
    }
  }

    formErrors = {
      'password': '',
      'confirmPassword': '',
    };

    formErrorsvalidationMessages = {
    'password': {
      'required':      'Password is required.',
      'validateEqual': 'Passwords to not match!',
      'minlength': 'Password must be at lest 6 characters long.'
    },
    'confirmPassword': {
      'required':      'Please confirm you password',
      'validateEqual': 'Passwords to not match!',
      'minlength': 'Password must be at lest 6 characters long.'
    },
  };


}