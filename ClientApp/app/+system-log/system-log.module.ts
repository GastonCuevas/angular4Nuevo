import { NgModule } from '@angular/core';
import { AppModuleShared } from "../app.module.shared";
import { SystemLogRoutes } from './system-log.routing';
import { SystemLogListComponent } from './system-log-list/system-log-list.component';
import { SystemLogService } from './system-log.service';

@NgModule({
  imports: [
    SystemLogRoutes,
    AppModuleShared
  ],
  declarations: [
  SystemLogListComponent],
  providers: [
    SystemLogService
  ]
})
export class SystemLogModule { }
