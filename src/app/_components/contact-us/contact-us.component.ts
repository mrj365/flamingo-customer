import { environment } from './../../../environments/environment';
import { ContactUsService } from './../../_services/contact-us.service';
import { ContactUsForm } from './contact-us-form';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css'
  ]
})
export class ContactUsComponent implements OnInit {
  
  showMobileMenu = true;
  showFullMenu = false;
  formSubmittedSuccessfully = false;
  model: ContactUsForm;
  isLargerThanBootstrapSmall = false;

  platformName = environment.platformName;

  contactUsForm: NgForm;
  @ViewChild('contactUsForm') currentForm: NgForm;

  constructor(private contactUsService: ContactUsService,
      private ngZone:NgZone,
      private router: Router) {

        if (window.innerWidth > 767) {
          this.isLargerThanBootstrapSmall = true;
        }

      window.onresize = (e) =>
    {
        //ngZone.run will help to run change detection
        this.ngZone.run(() => {
            if(window.innerWidth > 767){
              this.isLargerThanBootstrapSmall = true;
            } else {
              this.isLargerThanBootstrapSmall = false;
            }

        });
    };

  }

  ngOnInit() {
    this.model = new ContactUsForm();
  }

  displayFields() {
    this.showMobileMenu = false;
    this.showFullMenu = true;
  }

  onSubmit(valid){
    if (valid) {
      this.formSubmittedSuccessfully = true;
      this.contactUsService.contactUs(this.model.getContacUsDTO())
        .subscribe(data => {
          // Nothing to do here
        });
    } else {
      this.validateForm();
    }
  }

//Saving this incase we want to do validation when the form is changed
  // ngAfterViewChecked() {
  //   this.formChanged();
  // }

  // formChanged() {
  //   if (this.currentForm === this.contactUsForm) { return; }
  //   this.contactUsForm = this.currentForm;
  //   if (this.contactUsForm) {
  //     this.contactUsForm.valueChanges
  //       .subscribe(data => this.onValueChanged(data));
  //   }
  // }

  // onValueChanged(data?: any) {
  //   if (!this.contactUsForm) { return; }
  //   const form = this.contactUsForm.form;

  //   for (const field in this.formErrors) {
  //     // clear previous error message (if any)
  //     this.formErrors[field] = '';
  //     const control = form.get(field);

  //     if (control && control.dirty && !control.valid) {
  //       const messages = this.validationMessages[field];
  //       for (const key in control.errors) {
  //         this.formErrors[field] += messages[key] + ' ';
  //       }
  //     }
  //   }
  // }

    validateForm() {
      this.contactUsForm = this.currentForm;

      const form = this.contactUsForm.form;

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
    'supportType': '',
    'email': '',
    'firstName': '',
    'subject': '',
    'message': '',
  };

validationMessages = {
  'supportType': {
    'required': 'Contact type is required.'
  },
  'email': {
    'required':      'Email is required.',
    'email': 'Email invalid.'
  },
  'firstName': {
    'required': 'Name is required.'
  },
  'subject': {
    'required': 'Subject is required.'
  },
  'message': {
    'required': 'Message is required.'
  }
};

  redirect() {
    this.router.navigate(['./locations']);
  }

}
