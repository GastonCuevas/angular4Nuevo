import { NgModule } from '@angular/core';
import { NavBarService } from  '../+core/services/navbar.service'
import { AppModuleShared } from '../app.module.shared';
import { DynamicListComponent } from './dynamic-list/dynamic-list.component';
import { dynamicViewRoutes } from './dynamic-view.routing';
import { DynamicViewService } from './dynamic-view.service';

import { AuxiliaryComponent } from './dynamic-list/auxiliary.component';

@NgModule({
    imports: [
        dynamicViewRoutes,
        AppModuleShared,
    ],
    declarations: [
        DynamicListComponent,
        AuxiliaryComponent
    ],
    providers: [
        NavBarService,DynamicViewService
    ]
})

export class DynamicView { }