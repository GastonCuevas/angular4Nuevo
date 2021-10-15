import { NgModule } from '@angular/core';

import { ContractOsListComponent } from './contract-os-list/contract-os-list.component';
import { ContractOsFormComponent } from './contract-os-form/contract-os-form.component';
import { ContractOsDetailComponent } from './contract-os-detail/contract-os-detail.component';
import { ContractOsService } from './contract-os.service';
import { ContractOsPracticeService } from './../+contract-os/contract-os-practice.service';
import { ContractOsRoutes } from './contract-os.routing';
import { AppModuleShared } from '../app.module.shared';

@NgModule({
	imports: [
		AppModuleShared,
		ContractOsRoutes
	],
	exports: [],
	declarations: [
		ContractOsListComponent,
		ContractOsFormComponent,
		ContractOsDetailComponent
	],
	providers: [
		ContractOsService,
		ContractOsPracticeService
	],
})
export class ContractOsModule { }
