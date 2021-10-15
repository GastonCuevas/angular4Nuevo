import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { ISort } from '../interface/sort.interface';
import { Observable } from 'rxjs/Observable';
import { Internment } from '../models/Internment.model';
import { GenericControl } from '../+shared';
import { IColumn } from '../+shared/util';
import { CommonService } from '../+core/services';
import * as moment from 'moment';

@Injectable()
export class InternmentService {

    public baseUrl: string = "api/internment";
    idToPrint: number;
    readonly = false;

    controlsToFilter: Array<GenericControl> = [
        { key: 'patient', label: 'Paciente', type: 'name', class: 'col s12 m3', searchProperty: 'patMov.patient.patientAccount.name'},
        { key: 'cuit', label: 'Documento', type: 'text', class: 'col s12 m3', searchProperty: 'patMov.patient.patientAccount.cuit'},
        { key: 'professional', label: 'Profesional', type: 'name', class: 'col s12 m3', searchProperty: 'patMov.proContract.prof.professionalAccount.name' },
        { key: 'bed', label: 'Cama', type: 'autocomplete', class: 'col s12 m3', functionForData: this.commonService.getBeds(), searchProperty: 'bedId'},
        { key: 'dateFrom', label: 'Fecha Desde', type: 'date', class: 'col s6 m2', searchProperty: 'patMov.date'},
        { key: 'dateTo', label: 'Fecha Hasta', type: 'date', class: 'col s6 m2', searchProperty: 'patMov.date'},
        { key: 'medicalInsurance', label: 'Obra Social', type: 'autocomplete', class: 'col s12 m4', functionForData: this.commonService.getMedicalInsurances(), searchProperty: 'patMov.miContract.medicalInsuranceNumber' },
        { key: 'occupied', label: 'Tipo de Internación ', type: 'select', class: 'col s12 m4', options: [{number: 0, name: 'Todas'}, {number: 1, name: 'Internados'}, {number: 2, name: 'Dadas de Alta'}], value: 1 }
    ];

    columns: Array<IColumn> = [
        { header: "Paciente", property: "patientName", searchProperty: 'patMov.patient.patientAccount.name'},
        { header: "Profesional", property: "professionalName", searchProperty: 'patMov.proContract.prof.professionalAccount.name'},
        { header: "Cama", property: "bedName", searchProperty: 'bed.name'},
        { header: "Fecha", property: "admissionDate", type: 'date', searchProperty: 'patMov.date' },
        { header: "Hora", property: "time", searchProperty: 'patMov.time'}
    ];

    constructor(
      private requestService: RequestService,
      private commonService: CommonService,
    ) { }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
      let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
      if (filterBy) url += `&filterBy=${filterBy}`;
      if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
      return this.requestService.get(url)
        .map(response => {
            if (this.controlsToFilter[7].value == 0)this.columns[3] = { header: 'Fecha', property: 'date' };
            else if (this.controlsToFilter[7].value == 1 ) this.columns[3] = { header: 'Fecha Ingreso', property: 'admissionDate' };
            else this.columns[3] = { header: 'Fecha Egreso', property: 'departureDate' };
            let dataSource: Array<Internment> = response.model;
            dataSource.forEach(item => {
                item.time = item.time.substr(0, 5);
                item.departureDate = item.departureDate ? moment(item.departureDate).format("DD-MM-YYYY") : '';
                item.admissionDate = moment(item.admissionDate).format("DD-MM-YYYY");
                item.date = item.departureDate || item.admissionDate;
                item.time = item.departureTime ? item.departureTime.substring(0,5): item.time;
            });
            response.model = dataSource;
            return response;
        });
    }

    get(id: number): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    isValidPatientToInternment(id: number): Observable<any> {
        return this.requestService.get(`api/patient/valid/${id}`);
    }

    public update(internment: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${internment.id}`, internment);
    }

    public discharge(internment: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/discharge/${internment.id}`, internment);
    }

    public cancelDischarge(internment: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/cancelDischarge/${internment.id}`, internment);
    }

    public add(internment: Internment): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, internment);
    }

    getBeds(): Observable<any> {
        return this.requestService.get(`api/bedmovement/combo`);
    }

    getPatientsWithoutHospitalization(): Observable<any> {
        return this.requestService.get(`api/patient/patientsdischarged`);
    }

    getProfessionals(specialty?: number): Observable<any> {
        if (specialty)
            return this.requestService.get(`api/Professional/combo/${specialty}`);
        return this.requestService.get(`api/Professional/combo`);
    }

}
