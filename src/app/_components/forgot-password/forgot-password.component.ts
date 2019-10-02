import { ForgotPasswordFormDTO } from './forgot-password-form-dto';
import { NgForm } from '@angular/forms';
import { EditUserFormDTO } from './../user-settings/edit-user-form-dto';
import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  public forgotPasswordFormDTO: ForgotPasswordFormDTO = new ForgotPasswordFormDTO();
  forgotPasswordNgForm: NgForm;
  @ViewChild('forgotPasswordNgForm') currentForgotPasswordForm: NgForm;

  emailSent: boolean = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
  }

    onSubmit(valid, event: Event){    
      if (valid) {
        this.emailSent = true;
        this.userService.requestPasswordReset(this.forgotPasswordFormDTO.email).subscribe();
        //Get rid of error messages
        this.validateForm();
      } else {
        this.validateForm();
      }
    }

  validateForm() {
    this.forgotPasswordNgForm = this.currentForgotPasswordForm;

    const form = this.forgotPasswordNgForm.form;

    for (const field in this.formErrors) {
      // clear previous error message (if any)
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
      'email': ''
    };

    formErrorsvalidationMessages = {
    'email': {
      'required':      'Email is required.',
      'email': 'Please enter a valid email'
    }
  };

}