import { Component, OnInit } from '@angular/core';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  externalUrl: SafeUrl;
  el: HTMLFrameElement;

  constructor(private sanitizer: DomSanitizer) {
    this.externalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.staticImgPath + 'sitedocs/terms.htm'); 
    window.addEventListener('message', this.receiveMessage, false);

   }

  ngOnInit() {
  }

  receiveMessage(event) {
    let iframeId = 'genericIframe';
    let iframe = '#' + iframeId;

    //only receive messages from iframe src
    if ($(iframe).attr('src').startsWith(event.origin)) {
    
      //messages with a numeric payload means iframe height
      if (!isNaN(event.data)){
        document.getElementById(iframeId).style.height = 'auto';
        $(iframe).height(event.data + 'px');
      }
    }
  }

}
