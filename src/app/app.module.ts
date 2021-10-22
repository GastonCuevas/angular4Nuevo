import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RequestService } from './+core/services/request.service';
import { StorageService } from './+core/services/storage.service';
import { UtilityService } from './+core/services/utility.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [CommonModule, BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [RequestService, UtilityService, StorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
