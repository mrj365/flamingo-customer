import { Directive, ElementRef, Renderer, Input, Attribute, HostBinding } from '@angular/core';
import { ImageService } from '../_services/image.service';

@Directive({
  selector: '[imgSrc]',
  providers:[ImageService]
})
export class ImgSrcDirective {

  @Input() imgSrc: string;
  @Input() public input: any;

  constructor(private el: ElementRef, private renderer: Renderer, private imageService: ImageService) {

  }

  //https://angular.io/guide/lifecycle-hooks

  /**
   * Respond after Angular initializes the component's views and child views.
   * Called once after the first ngAfterContentChecked().
   * A component-only hook.
   */
  ngAfterViewInit() {
    this.logDebug('after view ' + this.imgSrc);
    let parcedImgSrc = this.imageService.getImgUrl(this.imgSrc);
    this.renderer.setElementProperty(this.el.nativeElement, 'src', parcedImgSrc);
    // this.renderer.setElementAttribute(this.el.nativeElement, 'src', parcedImgSrc);
  }

  /**
   * Detect and act upon changes that Angular can't or won't detect on its own.
   * Called during every change detection run, immediately after ngOnChanges() and ngOnInit()
   */
  // ngDoCheck(){
  //   // Use renderer to render the emelemt with styles
  //   //this.logDebug(this.imgSrc);
  //   let parcedImgSrc = this.imageService.getImgUrl(this.imgSrc);
  //   this.renderer.setElementProperty(this.el.nativeElement, 'src', parcedImgSrc);
  // }

  /**
   * changes Respond when Angular (re)sets data-bound input properties. 
   * The method receives a SimpleChanges object of current and previous property values.
   */
  ngOnChanges(changes){
    this.logDebug('change ' + this.imgSrc);
      
    let parcedImgSrc = this.imageService.getImgUrl(this.imgSrc);
    this.renderer.setElementProperty(this.el.nativeElement, 'src', parcedImgSrc);
    // this.renderer.setElementAttribute(this.el.nativeElement, 'src', parcedImgSrc);

  }
  
  logDebug(logMessage: string) {
    if(console) {
      console.log(logMessage);
    }
  }
  
}
