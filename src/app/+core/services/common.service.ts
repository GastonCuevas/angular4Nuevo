import { Injectable } from '@angular/core';

import { RequestService } from './request.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class CommonService {

  public lookAndFeel: any;

  constructor(
    private requestService: RequestService
  ) { }

  public getBeds(): Observable<any> {
    return this.requestService.get('api/bed/combo')
  }
  public getLocalities(provinceId: number, countryId: number = 1): Observable<any> {
    return this.requestService.get(`api/locality/combo?country=${countryId}&province=${provinceId}`)
  }
  public getZones(): Observable<any> {
    return this.requestService.get('api/zone/combo')
  }
  public getIdentifiers(): Observable<any> {
    return this.requestService.get('api/identifier/combo')
  }
  public getRegibr(): Observable<any> {
    return this.requestService.get('api/regGrossIncome/combo')
  }
  public getCategories(): Observable<any> {
    return this.requestService.get('api/category/combo')
  }
  public getProvinces(): Observable<any> {
    return this.requestService.get('api/province/combo')
  }
  public getAcountType(): Observable<any> {
    return this.requestService.get('/api/accounttype/combo');
  }
  public getAccountPlan(): Observable<any> {
    return this.requestService.get('/api/accountplan/combo');
  }
  public getGrossinAliquot(): Observable<any> {
    return this.requestService.get('/api/grossincomealiquot/combo');
  }
  public getGainCondition(): Observable<any> {
    return this.requestService.get('/api/gaincondition/combo');
  }
  public getGainInscription(): Observable<any> {
    return this.requestService.get('/api/gaininscription/combo');
  }
  public getRegIva(): Observable<any> {
    return this.requestService.get('/api/regiva/combo');
  }
  public getGenres(): Observable<any> {
    return this.requestService.get('api/genre/combo');
  }
  public getMedicalInsurances(): Observable<any> {
    return this.requestService.get('api/medicalInsurance/combo');
  }
  public getCenters(): Observable<any> {
    return this.requestService.get('api/originCenter/combo');
  }
  public getCivilStates(): Observable<any> {
    return this.requestService.get('api/civilState/combo');
  }
  public getLowReasons(): Observable<any> {
    return this.requestService.get('api/lowReason/combo');
  }
  public getBloodTypes(): Observable<any> {
    return this.requestService.get('api/bloodGroup/combo');
  }
  public getImpresionReasons(): Observable<any> {
    return this.requestService.get('api/impresionReason/combo');
  }
  public getorigins(): Observable<any> {
    return this.requestService.get('api/patientOrigin/combo');
  }
  public getImageAccount(accountNumber: number): Observable<any> {
    return this.requestService.get(`api/image/${accountNumber}`);
  }
  public uploadImage(id: any, data: any): Observable<any> {
    return this.requestService.upFileServer(`api/image/account/upload/${id}`, data);
  }
  public getModes(): Observable<any> {
    return this.requestService.get(`api/patientMode/combo`);
  }
  public getActivities(): Observable<any> {
    return this.requestService.get(`api/activity/combo`);
  }
  public getProvince(id: any): Observable<any> {
    return this.requestService.get(`api/province/${id}`);
  }
  public getExportations(): Observable<any> {
    return this.requestService.get(`api/export/combo`);
  }
  public getPracticeType(): Observable<any> {
    return this.requestService.get(`api/generic/combo/PRACTICAS_TIPOS`);
  }
  public getGroups(): Observable<any> {
    return this.requestService.get('api/group/combo');
  }
  public getUseCases(): Observable<any> {
    return this.requestService.get('api/usecase/combo');
  }
  public getLookAndFeel(): Observable<any> {
    this.lookAndFeel = this.requestService.get(`api/lookandfeel/config`);
    return this.lookAndFeel;
  }
  public getMaterialColors(): Observable<any> {
    return this.requestService.get('material-colors.json')
  }
  public getFontFamilies(): Observable<Array<{ code: number, name: string }>> {
    return this.requestService.get('font-families.json');
  }

  public getWeekDays(): Observable<any> {
    return this.requestService.get('week-days.json')
  }

  public editItem(config: any, code: any): Observable<any> {
    return this.requestService.put(`api/usecase/${code}/${config}`);
  }

  public getGenericCombo(tableName: any): Observable<any> {
    return this.requestService.get(`api/generic/combo/${tableName}`);
  }
  public getSpecialties(): Observable<any> {
    return this.requestService.get('api/specialty/combo');
  }

  public getSpecialtiesByProfessional(professionalNumber: number): Observable<any> {
    return this.requestService.get(`api/specialty/combo/${professionalNumber}`);
  }

  public getPatients(): Observable<any> {
    return this.requestService.get('api/patient/combo');
  }

  public getTurnStates(): Observable<any> {
    return this.requestService.get(`api/turnmanagement/validTurnStates`);
  }

  public getAllTurnStates(): Observable<any> {
    return this.requestService.get(`api/generic/combo/ESTADOS_TURNOS`);
  }

  public getMedicalInsurancesWithContract(): Observable<any> {
    return this.requestService.get('api/medicalinsurance/with-contract/combo');
  }

  /** region by Practice */

  getInosPracticesByType(practiceType: number): Observable<any> {
    return this.requestService.get(`api/inospractice/type/${practiceType}/combo`);
  }

  getInosPracticesByProfessionalAndMI(professionalId: number, medicalInsuranceId: number): Observable<any> {
    return this.requestService.get(`api/inospractice/professional/${professionalId}/${medicalInsuranceId}/combo`);
  }

  public getInosPractices(): Observable<any> {
    return this.requestService.get('api/inospractice/combo');
  }

  public getInosPracticesByMedicalInsurance(medicalInsurance: number): Observable<any> {
    return this.requestService.get(`api/inospractice/medical-insurance/${medicalInsurance}/combo`);
  }

  public getInosPracticesByProfessional(professionalId: number): Observable<any> {
    return this.requestService.get(`api/inospractice/professional/${professionalId}/combo`);
  }

  public getInosPracticeTypeByMedicalInsurance(medicalInsurance: number, practiceType: number): Observable<any> {
    return this.requestService.get(`api/inospractice/medical-insurance/${medicalInsurance}/${practiceType}/combo`);
  }

  public getInosPracticesByProfessionalOsAndPracticeType(professionalId: number, medicalInsuranceId: number, practiceType: number): Observable<any> {
    return this.requestService.get(`api/inospractice/professional/${professionalId}/${medicalInsuranceId}/${practiceType}/combo`);
  }

  public getInosPracticesByProfessionalOs(professionalId: number, medicalInsuranceId: number): Observable<any> {
    return this.requestService.get(`api/inospractice/professional/${professionalId}/${medicalInsuranceId}/combo`);
  }
  /** endregion */

  public getMedicalInsurancesByPatient(patient: number): Observable<any> {
    return this.requestService.get(`api/medicalInsurance/patient/${patient}/combo`);
  }

  public getBedTypes(): Observable<any> {
    return this.requestService.get(`api/generic/combo/TIPO_CAMAS`);
  }

  public getWards(): Observable<any> {
    return this.requestService.get(`api/generic/combo/SALAS`);
  }

  public getHolidaysByFilter(filterBy: string): Observable<any> {
    // return this.requestService.get(`api/Holiday?filterBy=${filterBy}`);
    return this.requestService.get(`api/Holiday/all?filterBy=${filterBy}`);
  }

  public getWardTypes(): Observable<any> {
    return this.requestService.get(`api/generic/combo/TIPO_SALAS`);
  }

  public getWardSectors(): Observable<any> {
    return this.requestService.get(`api/generic/combo/SECTOR_SALA`);
  }

  public getDeposits(): Observable<any> {
    return this.requestService.get(`api/generic/combo/DEPOSITOS`);
  }

  public getPracticeItems(): Observable<any> {
    return this.requestService.get(`api/itemPractice/combo`);
  }

  public getTableItems(): Observable<any> {
    return this.requestService.get(`api/hcTableItem/combo`);
  }

  public getDiagnostics(): Observable<any> {
    return this.requestService.get(`api/diagnostic/combo`);
  }

  public getTypes(): Observable<any> {
    return this.requestService.get(`api/generic/combo/TIPO_ITEMS`);
  }

  public getHcTableItems(hcTableId: number): Observable<any> {
    return this.requestService.get(`api/hctableitem/combo/${hcTableId}`);
  }

  public getArticles(): Observable<any> {
    return this.requestService.get(`api/pharmacyScheme/article/combo`);
  }

  public getArticlesBis(): Observable<any> {
    return this.requestService.get(`api/pharmacyScheme/article/combo`)
    .map(response => {
      let dataSource: Array<any> = response.model;
      dataSource.forEach(item => {
        item['number'] = item.code;
        item['name'] = item.description;
      });
      response.model = dataSource;
      return response;
    });
  }

  public getTables(): Observable<any> {
    return this.requestService.get(`api/ImportData/combo`);
  }

  getMIByProfessionalAndPatient(professionalId: number, patientId: number): Observable<any> {
    return this.requestService.get(`api/MedicalInsurance/ByProfessionalAndPatient/${professionalId}/${patientId}`);
  }

  getMIByProfessional(professionalId: number): Observable<any> {
    return this.requestService.get(`api/MedicalInsurance/ByProfessional/${professionalId}`);
  }

  /** region by Professional */

  public getProfessionals(medicalInsuranceId?: number): Observable<any> {
    if (medicalInsuranceId) return this.requestService.get(`api/ProfessionalContractMedicalInsurance/professionals/combo/${medicalInsuranceId}`);
    return this.requestService.get(`api/Professional/combo`);
  }

  getProfessionalsBySpecialty(specialty: number): Observable<any> {
    return this.requestService.get(`api/Professional/combo-with-valid/${specialty}`);
  }

  getProfessionalsWithContract(): Observable<any> {
    return this.requestService.get(`api/Professional/combo/withcontract`);
  }

  /*
  * get professionals with contracts (valid and expired) filtered by medical insurances 
  */
  getProfessionalsByMInsurance(medicalInsuranceId?: number): Observable<any> {
    if (medicalInsuranceId) return this.requestService.get(`api/ProfessionalContractMedicalInsurance/professionals/combo-with-valid/${medicalInsuranceId}`);
    return this.requestService.get(`api/Professional/combo`);
  }

  getProfessionalsByPractice(practiceNumber: number) {
    return this.requestService.get(`api/Professional/combo-with-valid/bypractice/${practiceNumber}`);
  }

  /** endregion */

  public getResponsibles(): Observable<any> {
    return this.requestService.get('/api/patientResponsible/combo');
  }

  public getConcepts(): Observable<any> {
    return this.requestService.get('/api/concept');
  }

  public getConceptsByType(type: number): Observable<any> {
    return this.requestService.get(`api/concept/type/${type}`);
  }

  public getConceptsByContractProf(contractId: number): Observable<any> {
    return this.requestService.get(`api/professionalcontractconcept/${contractId}`);
  }
}
