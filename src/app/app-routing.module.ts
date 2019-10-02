import { ServicesComponent } from './_components/services/services.component';
import { FaqComponent } from './_components/faq/faq.component';
import { AppointmentsWReoccurringComponent } from './_components/appointments-w-reoccurring/appointments-w-reoccurring.component';
import { environment } from 'environments/environment';
import { AppointmentDateComponent } from './_components/appointment-date/appointment-date.component';
import { CanActivateDateSelectionGuard } from './can-activate-date-selection-guard';
import { CanActivateCheckoutGuard } from './can-activate-checkout-guard';
import { CanActivateAlreadyLoggedIn } from './can-activate-already-logged-in';
import { CanDeactivateModalGuard } from './can-deactivate-modal-gaurd';
import { ContactUsComponent } from './_components/contact-us/contact-us.component';
import { AppointmentDetailsComponent } from './_components/appointment-details/appointment-details.component';
import { ShoppingCartComponent } from './_components/shopping-cart/shopping-cart.component';
import { DateSelectionComponent } from './_components/date-selection/date-selection.component';
import { CanActivateViaAuthGuard } from './can-activate-via-auth.guard';
import { StorefrontComponent } from './_components/storefront/storefront.component';
import { AddCardComponent } from './_components/add-card/add-card.component';
import { LoginComponent } from './_components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './_components/register/register.component';
import { AboutUsComponent } from './_components/about-us/about-us.component';
import { LocationComponent } from './_components/location/location.component';
import { NotificationsComponent } from './_components/notifications/notifications.component';
import { PaymentMethodsComponent } from './_components/payment-methods/payment-methods.component';
import { UserSettingsComponent } from './_components/user-settings/user-settings.component';
import { CheckoutComponent } from './_components/checkout/checkout.component';
import { AppointmentsComponent } from './_components/appointments/appointments.component';
import { ForgotPasswordComponent } from './_components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './_components/reset-password/reset-password.component';
import { TermsComponent } from './_components/terms/terms.component';
import { PrivacyComponent } from './_components/privacy/privacy.component';
import { HailComponent } from './_components/hail/hail.component';
import { CalendarComponent } from './_components/calendar/calendar.component';
import { PickupComponent } from './_components/pickup/pickup.component';
import { PickupRedirectComponent } from './_components/pickup-redirect/pickup-redirect.component';
import { GiftComponent } from './_components/gift/gift.component';
import { MyGiftsComponent } from './_components/my-gifts/my-gifts.component';
import { AboutComponent } from './_components/about/about.component';

const routes: Routes = [
  { path: '', redirectTo: environment.hailProfile ? '/hail' : environment.pickupProfile ? '/pickup' : '/locations', pathMatch: 'full' },
  { path: 'login',     component: LoginComponent, canActivate: [CanActivateAlreadyLoggedIn] },
  { path: 'register',     component: RegisterComponent, canActivate: [CanActivateAlreadyLoggedIn] },
  { path: 'pickup',     component: PickupComponent },
  { path: 'pickup-redirect',     component: PickupRedirectComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'about-us',     component: AboutUsComponent },
  { path: 'about',     component: AboutComponent },
  { path: 'contact-us',     component: ContactUsComponent },
  { path: 'locations',     component: environment.hailProfile ? HailComponent : LocationComponent },
  { path: 'storefront/:id',     component: StorefrontComponent, canActivate: [CanActivateViaAuthGuard]  },
  // { path: 'date-selection/:id',     component: DateSelectionComponent, canActivate: [CanActivateDateSelectionGuard]  },
  { path: 'date-selection',     component: AppointmentDateComponent, canActivate: [CanActivateDateSelectionGuard]  },
  { path: 'date-selection/:id',     component: AppointmentDateComponent, canActivate: [CanActivateDateSelectionGuard]  },
  { path: 'notifications',     component: NotificationsComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'payment-methods',     component: PaymentMethodsComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'add-card',     component: AddCardComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'user-settings',     component: UserSettingsComponent, canActivate: [CanActivateViaAuthGuard] },
  // { path: 'date-selection',     component: DateSelectionComponent, canActivate: [CanActivateDateSelectionGuard] },
  { path: 'checkout',     component: CheckoutComponent, canActivate: [CanActivateCheckoutGuard] },
  { path: 'shopping-cart',     component: ShoppingCartComponent, canActivate: [CanActivateViaAuthGuard] },
  //{ path: 'appointments',     component: AppointmentsComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'appointments',     component: AppointmentsWReoccurringComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'appointments/:id',     component: AppointmentDetailsComponent, canActivate: [CanActivateViaAuthGuard] },
  { path: 'forgot-password',     component: ForgotPasswordComponent },
  { path: 'reset-password',     component: ResetPasswordComponent },
  { path: 'terms',     component: TermsComponent },
  { path: 'privacy',     component: PrivacyComponent },
  { path: 'faq',     component: FaqComponent },
  { path: 'services',     component: ServicesComponent },
  { path: 'hail',     component: HailComponent },
 { path: 'calendar',     component: CalendarComponent },
 { path: 'gift',     component: GiftComponent },
 { path: 'my-gifts',     component: MyGiftsComponent },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {

  static getHomePage(): string {

    if(environment.hailProfile) {
      return '/hail';;
    } else {
      return '/locations';
    }
  }

  constructor() {

  }




}