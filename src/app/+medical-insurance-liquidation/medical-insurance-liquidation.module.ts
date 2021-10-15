import { NgModule } from '@angular/core';

import { AppModuleShared } from './../app.module.shared';
import { MILiquidationComponent } from "./mi-liquidation/mi-liquidation.component";
import { PracticesToLiquidateComponent } from './practices-to-liquidate/practices-to-liquidate.component';
import { MedicalInsuranceLiquidationRoutes } from './medical-insurance-liquidation.routing';
import { MedicalInsuranceLiquidationService } from './medical-insurance-liquidation.service';
import { MedicalInsuranceLiquidationListComponent } from './medical_insurance_liquidation_list/medical-insurance-liquidation-list.component';
import { MedicalInsuranceCollectedComponent } from './medical_insurance_collected/medical-insurance-collected.component';

@NgModule({
    imports:[
        AppModuleShared,
        MedicalInsuranceLiquidationRoutes
	],
    declarations: [
        MILiquidationComponent,
        PracticesToLiquidateComponent,
        MedicalInsuranceLiquidationListComponent,
        MedicalInsuranceCollectedComponent
    ],
	providers: [
		MedicalInsuranceLiquidationService
	]
})
export class MedicalInsuranceLiquidationModule{}