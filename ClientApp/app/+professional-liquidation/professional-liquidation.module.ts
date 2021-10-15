import { NgModule } from '@angular/core';

import { AppModuleShared } from './../app.module.shared';
import { ProfessionalLiquidationComponent } from "./liquidation/professional-liquidation.component";
import { PracticesToLiquidateComponent } from './practices-to-liquidate/practices-to-liquidate.component';
import { ProfessionalHistoryComponent } from './history/professional-history.component';
import { ProfessionalLiquidationRoutes } from './professional-liquidation.routing';
import { ProfessionalLiquidationService } from './professional-liquidation.service';
import { ProfessionalLiquidationContractComponent } from './professional-liquidation-contract/professional-liquidation-contract.component';

@NgModule({
    imports:[
        AppModuleShared,
        ProfessionalLiquidationRoutes
	],
    declarations: [
        ProfessionalLiquidationComponent,
        PracticesToLiquidateComponent,
        ProfessionalHistoryComponent,
        ProfessionalLiquidationContractComponent
    ],
	providers: [
		ProfessionalLiquidationService
	]
})
export class ProfessionalLiquidationModule{}