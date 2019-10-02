import { Directive, forwardRef } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidatorFn, Validator, FormControl } from '@angular/forms';


// validation function
function validateEmailFactory() : ValidatorFn {
  return (c: AbstractControl) => {

    let isValid = false;

    var EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    //Do not test empty strings
    if (!c.value || EMAIL_REGEXP.test(c.value)) {
        isValid = true;
    }

    if(isValid) {
      return null;
    } else {
      return {
        email: {
          valid: false
        }
      };
    }

  }
}


@Directive({
  selector: '[email][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }
  ]
})
export class EmailValidatorDirective implements Validator {
  validator: ValidatorFn;
  
  constructor() {
    this.validator = validateEmailFactory();
  }
  
  validate(c: FormControl) {
    return this.validator(c);
  }
  
}