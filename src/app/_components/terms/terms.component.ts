import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { environment } from 'environments/environment';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.css']
})
export class TermsComponent implements OnInit {

  termsUrl: SafeUrl;

  constructor(private sanitizer: DomSanitizer) { 

    this.termsUrl = this.sanitizer.bypassSecurityTrustResourceUrl(environment.staticImgPath + 'sitedocs/terms.htm') ;

    window.addEventListener('message', this.receiveMessage, false);
  }

  ngOnInit() {
  }

  receiveMessage(event) {
    let iframeId = 'terms';
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