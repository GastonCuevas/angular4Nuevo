import {
    Component, OnInit, Input, NgModule, NgModuleFactory, Compiler, SimpleChanges,
    ViewChild, ElementRef, Output, EventEmitter
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-dynamic-component',
    template: `<div #mainDynamicComponent>
                    <ng-container *ngComponentOutlet="dynamicComponent;
                            ngModuleFactory: dynamicModule;"></ng-container>
                </div>`
})
export class DynamicComponent implements OnInit {

    dynamicComponent: any;
    dynamicModule: NgModuleFactory<any>;

    @Input() html: string;
    @Input() genericObject: any;
    @ViewChild('mainDynamicComponent') mainDynamicComponent: ElementRef;
    @Output() afterViewInitEE = new EventEmitter<any>();

    private dynamicComponentHTML: any;

    constructor(private compiler: Compiler) {
    }

    ngOnInit() {
            this.dynamicComponent = this.createNewComponent(this.html, this.genericObject);
            this.dynamicModule = this.compiler.compileModuleSync(this.createComponentModule(this.dynamicComponent));
    }

    ngAfterViewInit() {
        this.dynamicComponentHTML = this.mainDynamicComponent.nativeElement.outerHTML;
        this.afterViewInitEE.emit(this.dynamicComponentHTML);
    }

    protected createComponentModule(componentType: any) {
        @NgModule({
            imports: [CommonModule],
            declarations: [
                componentType
            ],
            entryComponents: [componentType]
        })
        class RuntimeComponentModule {
        }
        // a module for just this Type
        return RuntimeComponentModule;
    }

    protected createNewComponent(template: string, object: any) {

        @Component({
            selector: 'dynamic-component',
            template: template ? template : '<div></div>'
        })
        class MyDynamicComponent {
            model: any = object;
            constructor() {
                // console.log('model-----------', this.model);
            }
        }

        return MyDynamicComponent;
    }
}
