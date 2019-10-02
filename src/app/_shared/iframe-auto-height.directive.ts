import {Directive, ElementRef, OnInit, Renderer} from "@angular/core";

@Directive({
    selector: "[iframeAutoHeight]"
})
export class IframeAutoHeightDirective implements OnInit {
    private el: HTMLFrameElement;
    private renderer: Renderer;
    private prevHeight: number;
    private sameCount: number;

    constructor(_elementRef: ElementRef, _renderer: Renderer) {
        this.el = _elementRef.nativeElement;
        this.renderer = _renderer;
    }

    ngOnInit() {
        const self = this;
        if (this.el.tagName === "IFRAME") {
            this.renderer.listen(this.el.contentDocument, "load", () => {
                // this.renderer.listen(this.el.contentDocument, "load", () => {
                    console.log('all');
                    self.prevHeight = 0;
                    self.sameCount = 0;
                    setTimeout(() => {
                        self.setHeight();
                    }, 50);
                // });
            });
        }
    }

    setHeight() {
        const self = this;
        if (this.el.contentWindow.document.body.scrollHeight !== this.prevHeight) {
            this.sameCount = 0;
            this.prevHeight = this.el.contentWindow.document.body.scrollHeight;
            this.renderer.setElementStyle(
                self.el,
                "height",
                this.el.contentWindow.document.body.scrollHeight + "px"
            );
            setTimeout(() => {
                self.setHeight();
            }, 50);

        } else {
            this.sameCount++;
            if (this.sameCount < 2) {
                setTimeout(() => {
                    self.setHeight();
                }, 50);
            }
        }
    }
}