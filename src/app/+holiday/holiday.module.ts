import { NgModule } from '@angular/core';
import { AppModuleShared } from '../app.module.shared';

import { HolidayFormComponent } from './holiday-form/holiday-form.component';
import { HolidayListComponent } from './holiday-list/holiday-list.component';
import { holidayRoutes } from './holiday.routing';
import { HolidayService } from './holiday.service';

@NgModule({
    imports: [
        holidayRoutes,
        AppModuleShared
    ],
    declarations: [
        HolidayFormComponent,
        HolidayListComponent
    ],
    providers: [
        HolidayService
    ],
})
export class HolidayModule { }
