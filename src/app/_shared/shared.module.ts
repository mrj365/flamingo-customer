import { WhitespaceValidatorDirective } from './whitespace-validator.directive';
import { NumbersValidatorDirective } from './numbers-validator.directive';
import { NumbersOnlyDirective } from './numbers-only.directive';
import { EmailValidatorDirective } from './email-validator.directive';
import { NgModule } from '@angular/core';
import { PhoneValidatorDirective } from './phone-validator.directive';
import { UnsecureDisplayDirective } from './unsecure-display.directive';
import { ImgSrcDirective } from './img-src.directive';
import { SecureDisplayDirective } from './secure-display.directive';
import { EqualValidatorDirective } from './equal-validator.directive';
import { IntegersOnlyDirective } from './integers-only.directive';
import { PmImgSrcDirective } from './pm-img-src.directive';
import { IframeAutoHeightDirective } from './iframe-auto-height.directive';
import { CurrencyValidatorDirective } from './currency-validator.directive';



@NgModule({
    declarations: [
        SecureDisplayDirective,
        ImgSrcDirective,
        UnsecureDisplayDirective,
        EmailValidatorDirective,
        PhoneValidatorDirective,
        EqualValidatorDirective,
        IntegersOnlyDirective,
        PmImgSrcDirective,
        IframeAutoHeightDirective,
        NumbersOnlyDirective,
        CurrencyValidatorDirective,
        NumbersValidatorDirective,
        WhitespaceValidatorDirective
],
    exports: [
        SecureDisplayDirective,
        UnsecureDisplayDirective,
        ImgSrcDirective,
        EmailValidatorDirective,
        PhoneValidatorDirective,
        EqualValidatorDirective,
        IntegersOnlyDirective,
        PmImgSrcDirective,
        IframeAutoHeightDirective,
        NumbersOnlyDirective,
        CurrencyValidatorDirective,
        NumbersValidatorDirective,
        WhitespaceValidatorDirective
    ]
})

export class SharedModule{}