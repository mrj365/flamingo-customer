import { Validator, ValidatorFn, AbstractControl, FormControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
  selector: '[isnumber][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: NumbersValidatorDirective, multi: true }
  ]
})
export class NumbersValidatorDirective implements Validator {
  validator: ValidatorFn;
  
  constructor() {
    this.validator = validateFormControlFactory();
  }
  
  validate(c: FormControl) {
    return this.validator(c);
  }

}

// validation function - validate form control is number
function validateFormControlFactory() : ValidatorFn {
  return (c: AbstractControl) => {

    let isValid = false;

    var NUMBER_REGEXP = /^\d+$/;

    //Do not test empty strings
     if (!c.value || NUMBER_REGEXP.test(c.value)) {
        isValid = true;
    }

    if(isValid) {
      return null;
    } else {
      return {
        isnumber: {
          valid: false
        }
      };
    }

  }
}