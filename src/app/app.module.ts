import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { StoreModule } from '@ngrx/store';
// import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppModuleShared } from './app.module.shared';
// import { CoreModule } from './+core/core.module';
import { AppComponent } from './components/app/app.component';
// import { appReducer } from './app-store';
// import { routing } from './app.routes';
// import { LoginModule } from './+login/login.module';
// import { UserModule } from './+user/user.module';
// import { PatientModule } from './+patient/patient.module';
// import { ProfessionalModule } from './+professional/professional.module';
// import { MedicalInsuranceModule } from './+medical-insurance/medical-insurance.module';
// import { DiagnosticModule } from './+diagnostic/diagnostic.module';
// import { PatientResponsibleModule } from './+patient-responsible/patient-responsible.module';
// import { DynamicView } from './+dynamic-view/dynamic-view.module';
// import { DynamicViewModule } from './+dynamic-view-v2/dynamic-view.module';
// import { ExportationModule } from './+exportations/exportation.module';
// import { IntellReportModule } from './+intellReport-finalUser/intellReport-finalUser.module';
// import { ExportationDetailModule } from './+exportations-detail/exportation-detail.module';
// import { ExportationEntryModule } from './+exportations-entry/exportation-entry.module';
// import { PracticeInosModule } from './+practice-inos/practice-inos.module';
// import { ContractOsModule } from './+contract-os/contract-os.module';
// import { LookAndFeelModule } from "./+look-and-feel/look-and-feel.module";
// import { ContractProfessionalModule } from "./+contract-professionals/contract-professional.module";
// import { ReportUseCaseModule } from './+report-use-case/report-use-case.module';
// import { ItemPracticeModule } from './+item-practice/item-practice.module';
// import { HcTableModule } from './+hc-table/hc-table.module';
// import { TurnManagementModule } from './+turn-management/turn-management.module';
// import { TurnConsultationModule } from './+turn-consultation/turn-consultation.module';
// import { PatienteMedicalInsuranceModule } from './+patient-medical-insurance/patient-medical-insurance.module';
// import { BedModule } from './+bed/bed.module';
// import { HolidayModule } from './+holiday/holiday.module';
// import { BedMovementModule } from './+bed-movement/bed-movement.module';
// import { InternmentModule } from './+internment/internment.module';
// import { WardModule } from './+ward/ward.module';
// import { WardSectorModule } from './+ward-sector/ward-sector.module';
// import { ClinicHistoryModule } from './+clinic-history/clinic-history.module';
// import { HcEvolutionPharmacyModule } from './+hc-evolution-pharmacy/hc-evolution-pharmacy.module';
// import { CubeModule } from './+cube/cube.module';
// import { ImportDataModule } from './+import-data/import-data.module';
// import { MedicalInsuranceLiquidationModule } from './+medical-insurance-liquidation/medical-insurance-liquidation.module';
// import { ProfessionalLiquidationModule } from './+professional-liquidation/professional-liquidation.module';
// import { ArbolModule } from './+arbol/arbol.module';
// import { ImportRunModule } from './+import-run/import-run.module';
// import { ConceptModule } from './+concept/concept.module';
// import { PharmacyModule } from './+pharmacy/pharmacy.module';
// import { SystemLogModule } from './+system-log/system-log.module';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppModuleShared,
    // CoreModule.forRoot(),
    // LoginModule,
    // StoreModule.provideStore(appReducer),
    // StoreDevtoolsModule.instrumentOnlyWithExtension(),

    // UserModule,
    // PatientModule,
    // ProfessionalModule,
    // MedicalInsuranceModule,
    // DiagnosticModule,
    // PatientResponsibleModule,
    // DynamicView,
    // DynamicViewModule,
    // ExportationModule,
    // IntellReportModule,
    // ExportationDetailModule,
    // ExportationEntryModule,
    // PracticeInosModule,
    // ContractOsModule,
    // LookAndFeelModule,
    // ContractProfessionalModule,
    // ReportUseCaseModule,
    // ItemPracticeModule,
    // HcTableModule,
    // TurnManagementModule,
    // TurnConsultationModule,
    // PatienteMedicalInsuranceModule,
    // BedModule,
    // HolidayModule,
    // BedMovementModule,
    // InternmentModule,
    // WardModule,
    // WardSectorModule,
    // ClinicHistoryModule,
    // HcEvolutionPharmacyModule,
    // CubeModule,
    // ImportDataModule,
    // MedicalInsuranceLiquidationModule,
    // ProfessionalLiquidationModule,
    // ArbolModule,
    // ImportRunModule,
    // ConceptModule,
    // PharmacyModule,
    // SystemLogModule
  ],
  providers: [{ provide: 'BASE_URL', useFactory: getBaseUrl }],
})
export class AppModule {}

export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}
