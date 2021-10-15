import { NgModule } from '@angular/core';
import { AppComponent } from './components/app/app.component';
import { ServerModule } from '@angular/platform-server';
import { AppModuleShared } from './app.module.shared';
import { UserModule } from './+user/user.module';



@NgModule({
    bootstrap: [ AppComponent ],
    imports: [
        ServerModule,
        AppModuleShared,
    ]
})
export class AppModule {
}
