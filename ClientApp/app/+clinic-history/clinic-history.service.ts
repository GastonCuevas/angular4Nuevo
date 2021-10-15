import { Injectable } from '@angular/core';
import { RequestService } from './../+core/services/request.service';
import { Observable } from 'rxjs/Observable';
import { ISort } from '../interface';
import { ClinicHistory } from '../models';
import { GenericControl } from '../+shared';
import { AbstractServiceBase } from '../+shared/util';

@Injectable()
export class ClinicHistoryService extends AbstractServiceBase {
    baseUrl = 'api/hcEvolution';
    readonly = false;
    specialtyId: number;
    practiceId: number;
    patientId: number;
    patientName: string;
    controlsToFilter: GenericControl[];

    constructor(
        private requestService: RequestService
    ) {
        super();
        this.reset();
    }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}/byPatient?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`

        if (filterBy) {
            url += `&filterBy=${filterBy}`;
            if (this.patientId) url += ` and patientNumber=${this.patientId}`;
        } else if (this.patientId) url += `&filterBy=patientNumber=${this.patientId}`;

        // if (filterBy) url += `&filterBy=${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url);
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/${id}`);
    }

    public getWithItems(patientMovementId: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/patientMovement/${patientMovementId}`);
    }

    public update(data: ClinicHistory): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${data.id}`, data);
    }

    public insert(data: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, data);
    }

    public delete(id: any): Observable<any> {
        return this.requestService.delete(`${this.baseUrl}/${id}`);
    }

    public getLastScheme(patientId: number): Observable<any> {
        return this.requestService.get(`api/pharmacyScheme/getMedications/${patientId}`);
    }

    public getLastDiagnostic(patientId: number): Observable<any> {
        return this.requestService.get(`api/diagnosticMovement/patient/${patientId}`);
    }

    setCustomFilters() {
        this.controlsToFilter = [
            { key: 'medicalInsurance', label: 'Obra Social', type: 'text', class: 'col s12 m3', searchProperty: 'miContract.os.medicalInsuranceAccount.name' },
            { key: 'professional', label: 'Profesional', type: 'name', class: 'col s12 m3', searchProperty: 'proContract.prof.professionalAccount.name' },
            { key: 'dateFrom', label: 'Fecha Desde', type: 'date', class: 'col s6 m2', searchProperty: 'date' },
            { key: 'dateTo', label: 'Fecha Hasta', type: 'date', class: 'col s6 m2', searchProperty: 'date' },
            { key: 'withoutevolutions', label: 'Movimientos ', type: 'select', class: 'col s12 m2', options: [{ number: 0, name: 'Todas' }, { number: 1, name: 'Con Evoluciones' }, { number: 2, name: 'Sin Evoluciones' }], value: 0 }
        ];
    }

    reset() {
        this.patientId = 0;
        this.patientName = '';
        this.controlsToFilter = [
            { key: 'patient', label: 'Paciente', type: 'name', class: 'col s12 m3', searchProperty: 'patient.patientAccount.name' },
            { key: 'cuit', label: 'Documento', type: 'text', class: 'col s12 m2', searchProperty: 'patient.patientAccount.cuit' },
            { key: 'medicalInsurance', label: 'Obra Social', type: 'text', class: 'col s12 m4', searchProperty: 'miContract.os.medicalInsuranceAccount.name' },
            { key: 'practice', label: 'Practica de Atencion', type: 'text', class: 'col s12 m3', searchProperty: 'inosPractice.description' },
            { key: 'professional', label: 'Profesional', type: 'name', class: 'col s12 m4', searchProperty: 'proContract.prof.professionalAccount.name' },
            { key: 'dateFrom', label: 'Fecha Turno desde', type: 'date', class: 'col s6 m2', parameter: true },
            { key: 'dateTo', label: 'Fecha Evolucion', type: 'date', class: 'col s6 m2', parameter: true },
            { key: 'withoutevolutions', label: 'Movimientos ', type: 'select', class: 'col s12 m4', options: [{ number: 0, name: 'Todas' }, { number: 1, name: 'Con Evoluciones' }, { number: 2, name: 'Sin Evoluciones' }], value: 0, parameter: true }
        ];
    }
}
