import { ServicesComponent } from './_components/services/services.component';
import { FaqComponent } from './_components/faq/faq.component';
import { PickupRedirectComponent } from './_components/pickup-redirect/pickup-redirect.component';
import { AppointmentsWReoccurringComponent } from './_components/appointments-w-reoccurring/appointments-w-reoccurring.component';
import { CalendarAppointmentListItemComponent } from './_components/calendar-appointment-list-item/calendar-appointment-list-item.component';
import { AppointmentListItemComponent } from './_components/appointment-list-item/appointment-list-item.component';
import { CalendarComponent } from './_components/calendar/calendar.component';
import { HailComponent } from './_components/hail/hail.component';
import { OrderCustomizationComponentComponent } from './_components/order-customization-component/order-customization-component.component';
import { OrderCustomizationsComponent } from './_components/order-customizations/order-customizations.component';
import { AppointmentDateComponent } from './_components/appointment-date/appointment-date.component';
import { CanActivateDateSelectionGuard } from './can-activate-date-selection-guard';
import { CanActivateCheckoutGuard } from './can-activate-checkout-guard';
import { CanActivateAlreadyLoggedIn } from './can-activate-already-logged-in';
import { TermsComponent } from './_components/terms/terms.component';
import { MapsConfig } from './MapsConfig';
import { ResetPasswordComponent } from './_components/reset-password/reset-password.component';
import { ContactUsService } from './_services/contact-us.service';
import { AppointmentsComponent } from './_components/appointments/appointments.component';
import { ShoppingCartComponent } from './_components/shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './_components/checkout/checkout.component';
import { UserAppointmentService } from './_services/user-appointment.service.service';
import { DateSelectionComponent } from './_components/date-selection/date-selection.component';
import { StorefrontComponent } from './_components/storefront/storefront.component';
import { AddCardComponent } from './_components/add-card/add-card.component';
import { LocationComponent } from './_components/location/location.component';
import { LocationService } from './_services/location.service';
import { PaymentMethodsComponent } from './_components/payment-methods/payment-methods.component';
import { UserPaymentMethodService } from './_services/user-payent-method.service';
import { NotificationService } from './_services/notification.service';
import { NotificationsComponent } from './_components/notifications/notifications.component';
import { AboutUsComponent } from './_components/about-us/about-us.component';
import { ShoppingCartService } from './_services/shopping-cart.service';
import { FacebookUserService } from './_services/facebook-user.service';
import { FooterComponent } from './_components/footer/footer.component';
import { NavBarComponent } from './_components/nav-bar/nav-bar.component';
import { RegisterComponent } from './_components/register/register.component';
import { SharedModule } from './_shared/shared.module';
import { CanActivateViaAuthGuard } from './can-activate-via-auth.guard';
import { GoogleUserService } from './_services/google-user.service';
import { LocalStorageService } from './_services/local-storage-service';
import { ImageService } from './_services/image.service';
import { HttpUtilService } from './_services/http-util.service';
import { AuthenticationService } from './_services/authentication.service';
import { UserCredentialsEntity } from './_models/entity/user-credentials-entity';
import { LocalStorageConstants } from './_models/constants/local-storage-constants';
import { UserService } from './_services/user.service';
import { ConfigService } from './_services/config.service';
import { LoginComponent } from './_components/login/login.component';
import { AppRoutingModule } from './app-routing.module';
import { AgmCoreModule, LAZY_MAPS_API_CONFIG } from 'angular2-google-maps/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RatingModule } from 'ngx-rating';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { PopoverModule } from 'ngx-popover';
import { ResponsiveModule } from 'ng2-responsive';
import { PubNubAngular } from 'pubnub-angular2';

import { AppComponent } from './app.component';
import { FacebookModule } from 'ng2-facebook-sdk';

import * as Raven from 'raven-js';
import { LocationStrategy, HashLocationStrategy } from "@angular/common";
import { UserSettingsComponent } from './_components/user-settings/user-settings.component';
import { StorefrontService } from './_services/storefront.service';
import { AppointmentDetailsComponent } from './_components/appointment-details/appointment-details.component';
import { ContactUsComponent } from './_components/contact-us/contact-us.component';
import { ForgotPasswordComponent } from './_components/forgot-password/forgot-password.component';
import { CanDeactivateModalGuard } from './can-deactivate-modal-gaurd';
import { environment } from '../environments/environment';
import { PrivacyComponent } from './_components/privacy/privacy.component';
import { NavBarHailComponent } from './_components/nav-bar-hail/nav-bar-hail.component';
import { PlacesAutoCompleteComponent } from './_components/places-auto-complete/places-auto-complete.component';
import { PickupComponent } from './_components/pickup/pickup.component';
import { GiftComponent } from './_components/gift/gift.component';
import { GiftCardService } from './_services/gift-card.service';
import { MyGiftsComponent } from './_components/my-gifts/my-gifts.component';
import { MyGiftBalanceComponent } from './_components/my-gift-balance/my-gift-balance.component';
import { MyGiftRedeemComponent } from './_components/my-gift-redeem/my-gift-redeem.component';
import { MyGiftApplyModalComponent } from './_components/my-gift-apply-modal/my-gift-apply-modal.component';
import { OrderSummaryComponent } from './_components/order-summary/order-summary.component';
import { AboutComponent } from './_components/about/about.component';
import { FooterMobileComponent } from './_components/footer-mobile/footer-mobile.component';


export function startupServiceFactory(configService: ConfigService, userService: UserService): Function {
    return () => {
      //configService.setConfig();
      userService.behalfOf();
      userService.setLocalUser();
    };
}

// Enable Sentry if in production. 
if(environment.production) {
  Raven
    .config(environment.sentryAPIKey)
    .install();
}

//Log exceptions
// export class RavenErrorHandler implements ErrorHandler {

//   handleError(err:any) : void {
//     Raven.captureException(err.originalError || err);

//     let userCredentials = localStorage.getItem(LocalStorageConstants.CURRENT_USER_KEY);
//     if(userCredentials) {
//       let userCredentialsEntity: UserCredentialsEntity = JSON.parse(userCredentials);
//       Raven.setUserContext({
//         id: userCredentialsEntity.uniqueId
//     });
//     }

//   }
// }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavBarComponent,
    FooterComponent,
    FooterMobileComponent,
    AboutUsComponent,
    AboutComponent,
    NotificationsComponent,
    UserSettingsComponent,
    PaymentMethodsComponent,
    AddCardComponent,
    LocationComponent,
    StorefrontComponent,
    DateSelectionComponent,
    CheckoutComponent,
    ShoppingCartComponent,
    AppointmentsComponent,
    AppointmentDetailsComponent,
    ContactUsComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    TermsComponent,
    PrivacyComponent,
    AppointmentDateComponent,
    OrderCustomizationsComponent,
    OrderCustomizationComponentComponent,
    HailComponent,
    NavBarHailComponent,
    PlacesAutoCompleteComponent,
    CalendarComponent,
    AppointmentListItemComponent,
    CalendarAppointmentListItemComponent,
    AppointmentsWReoccurringComponent,
    PickupComponent,
    PickupRedirectComponent,
    FaqComponent,
    ServicesComponent,
    GiftComponent,
    MyGiftsComponent,
    MyGiftBalanceComponent,
    MyGiftRedeemComponent,
    MyGiftApplyModalComponent,
    OrderSummaryComponent,
],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    FacebookModule.forRoot(),
    AgmCoreModule.forRoot(),
    ReactiveFormsModule,
    RatingModule,
    Ng2Bs3ModalModule, // Modal
    ResponsiveModule,
    SharedModule, // Used for directives
    PopoverModule // Used for popoverss
  ],
  providers: [
    {
      // Provider for APP_INITIALIZER
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [ConfigService, UserService],
      multi: true
    },
    // { provide: ErrorHandler, useClass: RavenErrorHandler },
    {
      // Provider for url hashing strategy
      // https://stackoverflow.com/questions/35284988/angular-2-404-error-occur-when-i-refresh-through-the-browser
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthenticationService,
    HttpUtilService,
    UserService,
    ConfigService,
    ImageService,
    FacebookUserService,
    GoogleUserService,
    LocalStorageService,
    ShoppingCartService,
    NotificationService,
    UserPaymentMethodService,
    LocationService,
    StorefrontService,
    UserAppointmentService,
    ContactUsService,
    GiftCardService,
    {
      provide: LAZY_MAPS_API_CONFIG,
      useClass: MapsConfig,
      deps: [ConfigService]
    },

    //Guards
    CanActivateViaAuthGuard,
    CanDeactivateModalGuard,
    CanActivateAlreadyLoggedIn,
    CanActivateCheckoutGuard,
    CanActivateDateSelectionGuard,

    //pub nub
    PubNubAngular

  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ], // Needed for modal
  bootstrap: [AppComponent]
})
export class AppModule { }
