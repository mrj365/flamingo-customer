import { AuthenticationService } from './../_services/authentication.service';
import { Directive, ElementRef, Renderer } from '@angular/core';

@Directive({
  selector: '[unsecureDisplay]'
})
export class UnsecureDisplayDirective {

  constructor(private el: ElementRef, private renderer: Renderer, private authenticationService: AuthenticationService) {
     
     
     
    }

  ngDoCheck() {
    if (!this.authenticationService.isUserLoggedIn()) {
       this.renderer.setElementStyle(this.el.nativeElement, 'display', 'block');
     } else {
      // Use renderer to render the element with styles
      this.renderer.setElementStyle(this.el.nativeElement, 'display', 'none');
     }
  }

}