import { Validator, ValidatorFn, AbstractControl, FormControl, NG_VALIDATORS } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({
  selector: '[notblank][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: WhitespaceValidatorDirective, multi: true }
  ]
})
export class WhitespaceValidatorDirective implements Validator {
  validator: ValidatorFn;
  
  constructor() {
    this.validator = validateFormControlFactory();
  }
  
  validate(c: FormControl) {
    return this.validator(c);
  }

}

// validation function - validate form control isn't blank space
function validateFormControlFactory() : ValidatorFn {
  return (c: AbstractControl) => {

    let isValid = false;

    //Do not test empty strings
    if (!c.value || c.value.trim() !== '') {
        isValid = true;
    }

    if(isValid) {
      return null;
    } else {
      return {
        notblank: {
          valid: false
        }
      };
    }

  }
}