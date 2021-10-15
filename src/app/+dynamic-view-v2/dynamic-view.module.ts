import { NgModule } from '@angular/core';
import { AppModuleShared } from '../app.module.shared';

import { DynamicViewListComponent } from './dynamic-view-list/dynamic-view-list.component';
import { DynamicViewFormComponent } from './dynamic-view-form/dynamic-view-form.component';
import { dynamicViewRoutes } from './dynamic-view.routing';
import { DynamicViewService } from './dynamic-view.service';
import { AuxiliaryComponent } from './dynamic-view-list/auxiliary.component';

@NgModule({
    imports: [
        dynamicViewRoutes,
        AppModuleShared,
    ],
    declarations: [
        DynamicViewListComponent,
        AuxiliaryComponent,
        DynamicViewFormComponent
    ],
    providers: [
        DynamicViewService
    ]
})

export class DynamicViewModule { }