import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PatientMedicalInsuranceListComponent } from './patient-medical-insurance-list/patient-medical-insurance-list.component';
import { PatientMedicalInsuranceFormComponent } from './patient-medical-insurance-form/patient-medical-insurance-form.component';
import { AuthGuard } from '../+core/services';
import { RouteGuard } from '../+core/guard/route-guard.service';

const routes: Routes = [
  { path: 'pacienteObraSocial/obraSocial/:patientId', component: PatientMedicalInsuranceListComponent, canActivate: [AuthGuard,RouteGuard] },
  { path: 'pacienteObraSocial/obraSocial/:patientId/formulario', component: PatientMedicalInsuranceFormComponent, canActivate: [AuthGuard,RouteGuard]},
  { path: 'pacienteObraSocial/obraSocial/:patientId/formulario/:id', component: PatientMedicalInsuranceFormComponent, canActivate: [AuthGuard,RouteGuard]}
];

export const patientMedicalInsuranceRoutes = RouterModule.forRoot(routes);