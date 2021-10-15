import {
    Component, OnChanges, OnInit, Input, NgModule, NgModuleFactory, Compiler, SimpleChanges
} from '@angular/core';

// import { SharedModule } from './shared.module';
// import { AppModuleShared } from "../../app.module.shared";
import { CommonModule } from '@angular/common';

@Component({
    selector: 'dynamic',
    template: `<ng-container *ngComponentOutlet="dynamicComponent;
                            ngModuleFactory: dynamicModule;"></ng-container>`
})
export class DynamicComponent implements OnInit, OnChanges{

    dynamicComponent: any;
    dynamicModule: NgModuleFactory<any>;

    @Input('html') html: string;
    @Input('dataSource') dataSource: Array<any>;

    constructor(private compiler: Compiler) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['html'] && !changes['html'].isFirstChange()) {
            this.dynamicComponent = this.createNewComponent(this.html, {text: 'texto prueba', atributo2: 23}, this.dataSource);
            this.dynamicModule = this.compiler.compileModuleSync(this.createComponentModule(this.dynamicComponent));
        }
    }

    ngOnInit() {
        this.dynamicComponent = this.createNewComponent(this.html, {text: 'texto prueba', atributo2: 23}, this.dataSource);
        this.dynamicModule = this.compiler.compileModuleSync(this.createComponentModule(this.dynamicComponent));
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

    protected createNewComponent(template: string, object: any, dataSource: Array<any>) {

        @Component({
            selector: 'dynamic-component',
            template: template ? template : '<div></div>'
        })
        class MyDynamicComponent {
            objectGeneric: any = object;
            list: Array<any> = dataSource ? dataSource : new Array<any>();
            constructor() {
                // console.log('list-----------');
                // console.log(this.list)
            }
        }

        return MyDynamicComponent;
    }
}
