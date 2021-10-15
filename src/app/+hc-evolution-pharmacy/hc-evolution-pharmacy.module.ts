import { InternmentSelectedService } from './internment-selected.service';
import { HcEvolutionSchemeListComponent } from './hc-evolution-scheme-list/hc-evolution-scheme-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppModuleShared } from '../app.module.shared';
import { ReturnMedicationFormComponent } from './return-medication-form/return-medication-form.component';
import { HcEvolutionPharmacyService } from './hc-evolution-pharmacy.service';
import { HcEvolutionSchemeService } from './hc-evolution-scheme.service';
import { PharmacySchemeItemService } from './pharmacy-scheme-item.service';
import { InternmentSelectedListComponent } from './internment-selected-list/internment-selected-list.component';
import { PatientSchemesComponent } from './patient-schemes/patient-schemes.component';
import { HcEvolutionPharmacyRoutes } from './hc-evolution-pharmacy.routing';
import { MedicationDeliveryDetailComponent } from './medication-delivery-detail/medication-delivery-detail.component';
import { MedicationDeliveryDetailService } from './medication-delivery-detail.service';
import { ReturnMedicationListComponent } from './return-medication-list/return-medication-list.component';
import { ReturnMedicationService } from './return-medication.service';
import { MedicationDeliveryEditFormComponent } from './medication-delivery-form/medication-delivery-edit-form.component';
import { MedicationDeliveryTotalComponent } from './medication-delivery-total/medication-delivery-total.component';

@NgModule({
  imports: [
    HcEvolutionPharmacyRoutes,
    AppModuleShared
  ],
  declarations: [
    InternmentSelectedListComponent,
    ReturnMedicationFormComponent, 
    HcEvolutionSchemeListComponent,
    PatientSchemesComponent,
    MedicationDeliveryDetailComponent,
    ReturnMedicationListComponent,
    MedicationDeliveryEditFormComponent,
    MedicationDeliveryTotalComponent
  ],
  providers: [
    InternmentSelectedService,
    HcEvolutionPharmacyService,
    PharmacySchemeItemService,
    HcEvolutionSchemeService,
    PatientSchemesComponent,
    MedicationDeliveryDetailService,
    ReturnMedicationService
  ]
})
export class HcEvolutionPharmacyModule { }
