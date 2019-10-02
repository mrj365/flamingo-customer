import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * This directive will rewrite any non integer number to an integer
 * greater thant 0
 */
@Directive({
  selector: '[IntegersOnly]'
})
export class IntegersOnlyDirective {

    DIGITS_REGEXP =  new RegExp(/\D/g);
    constructor(private el: ElementRef) { 

        // Sanatize clipboard by removing any non-numeric input after pasting
        this.el.nativeElement.onpaste = (e:any) => {
            e.preventDefault();
            let text;
            let clp = (e.originalEvent || e).clipboardData;
            if (clp === undefined || clp === null) {
                text = (<any>window).clipboardData.getData('text') || '';
                if (text !== '') {
                    let decimalIndex = text.indexOf('.');
                    if(decimalIndex !== -1) {
                        text = text.substring(0, decimalIndex);
                    }

                    text = text.replace(this.DIGITS_REGEXP, '');

                    if(!text || +text == 0) {
                        text = '1';
                    }

                    if (window.getSelection) {
                        let newNode = document.createElement('span');
                        newNode.innerHTML = text;
                        window.getSelection().getRangeAt(0).insertNode(newNode);
                    } else {
                        (<any>window).selection.createRange().pasteHTML(text);
                    }
                }
            } else {
                text = clp.getData('text/plain') || '';
                
                if (text !== '') {

                    let decimalIndex = text.indexOf('.');
                    if(decimalIndex !== -1) {
                        text = text.substring(0, decimalIndex);
                    }
                    text = text.replace(this.DIGITS_REGEXP, '');

                    if(!text || +text == 0) {
                        text = '1';
                    }

                    document.execCommand('insertText', false, text);
                }
            }
        };
    }

  @HostListener('keydown', ['$event']) onKeyDown(event) {
    let e = <KeyboardEvent> event;

    //Cannot press period 110, 190 (alpha and numeric periods)
    if ([8, 46, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode === 65 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+C
      (e.keyCode === 67 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+V
    //   (e.keyCode === 86 && (e.ctrlKey || e.metaKey)) ||
      // Allow: Ctrl+X
      (e.keyCode === 88 && (e.ctrlKey || e.metaKey)) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
      }

      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }
    }

      @HostListener('keyup', ['$event']) onKeyUp(event) {
        let e = <KeyboardEvent> event;

        // if(+this.el.nativeElement.value === 0) {
        //     this.el.nativeElement.value = '1';
        // }

      if([8,46].indexOf(e.keyCode) !== -1 ) {

        //   if(this.el.nativeElement.value === '') {
        //       this.el.nativeElement.value = '1';
        //   }
          return;
      }
      // Ensure that it is a number and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
          e.preventDefault();
      }
    }

}
