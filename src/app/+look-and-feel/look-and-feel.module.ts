import { NgModule } from '@angular/core';
import { ColorPickerModule } from 'ngx-color-picker';

import { AppModuleShared } from "../app.module.shared";
import { IACColorComponent } from './iac-color/iac-color.component';
import { LookAndFeelListComponent } from './look-and-feel-list/look-and-feel-list.component';
import { LookAndFeelFormComponent } from './look-and-feel-form/look-and-feel-form.component';
import { LookAndFeelRoutes } from "./look-and-feel.routing";

@NgModule({
    imports: [
        AppModuleShared,
        ColorPickerModule,
        LookAndFeelRoutes
    ],
    declarations: [
        IACColorComponent,
        LookAndFeelListComponent,
        LookAndFeelFormComponent,
    ],
    providers: []
    })
export class LookAndFeelModule { }
