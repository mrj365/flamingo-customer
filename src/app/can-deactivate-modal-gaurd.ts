import { CanDeactivate } from '@angular/router';
import { StorefrontComponent } from './_components/storefront/storefront.component';

export class CanDeactivateModalGuard implements CanDeactivate<StorefrontComponent>{
    canDeactivate(target: StorefrontComponent) {
        alert(target);
        // if(target.modalService.close()){
            // return window.confirm('Do you really want to cancel?');
            target.modalService.close();
            return false;
        // }
        // return true;
  }
}