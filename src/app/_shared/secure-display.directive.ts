import { AuthenticationService } from './../_services/authentication.service';
import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[secureDisplay]'
})
export class SecureDisplayDirective {

  constructor(private el: ElementRef, private renderer: Renderer, private authenticationService: AuthenticationService) {
     
     
     
    }

  ngDoCheck() {
    if (!this.authenticationService.isUserLoggedIn()) {
      // Use renderer to render the element with styles
       this.renderer.setElementStyle(this.el.nativeElement, 'display', 'none');
     } else {
       this.renderer.setElementStyle(this.el.nativeElement, 'display', 'block');
     }
  }

}