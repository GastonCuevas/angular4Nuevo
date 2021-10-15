import { NgModule } from '@angular/core';
import { AppModuleShared } from './../app.module.shared';

import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserService } from './user.service';
import { UserRoutes } from './user.routing';

@NgModule({
    imports: [
        AppModuleShared,
        UserRoutes
    ],
    declarations: [
        UserListComponent,
        UserFormComponent,
        UserDetailComponent
    ],
    providers: [
        UserService
    ]
})
export class UserModule { }
