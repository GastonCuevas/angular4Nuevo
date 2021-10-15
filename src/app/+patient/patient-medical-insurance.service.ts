import { Injectable } from '@angular/core';
import { RequestService } from '../+core/services/request.service';
import { Observable } from 'rxjs/Rx';
import { ISort } from '../interface';
import { PatientMedicalInsurance } from '../models/patient-medical-insurance.model';

@Injectable()
export class PatientMedicalInsuranceService {
    baseUrl = "api/patientMedicalInsurance";
    patientNumber: any;
    patientName: string = "";
    index: number = 0;

    newPatientMedicalInsurances: Array<PatientMedicalInsurance> = new Array<PatientMedicalInsurance>();
    isNewPatientMedicalInsurance: boolean;
    isNewPatient: boolean;
    number: number = 0;

    constructor(
        public requestService: RequestService
    ) { 
        this.isNewPatientMedicalInsurance = false;
        this.index = 0;
    }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        if (this.isNewPatient) return Observable.of({ model: JSON.parse(JSON.stringify(this.newPatientMedicalInsurances)) });
        let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}&filterBy=patientNumber=${this.patientNumber}`;
        if (filterBy) url += ` and ${filterBy}`;
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url)
            .map( response => {
                const dataSource: Array<any> = response.model;
                dataSource.forEach(item => {
                    item['yesOrNo'] = item.byDefault ? 'Si' : '';
                });
                response.model = dataSource;
                return response;
        });
    }

    public get(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/`+id);
    }

    public checkContractMedicalInsurance(id: any): Observable<any> {
        return this.requestService.get(`${this.baseUrl}/contract/`+id);
    }

    public add(patientMedicalInsurance: PatientMedicalInsurance): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, patientMedicalInsurance);
    }

    public addArray(patientMedicalInsurance: PatientMedicalInsurance): Observable<any> {
        if (patientMedicalInsurance.byDefault) {
            this.newPatientMedicalInsurances.forEach(element => {
                element.byDefault = false;
            });
        }

        this.newPatientMedicalInsurances.push(patientMedicalInsurance);
        this.newPatientMedicalInsurances[this.index].number = this.index;
        this.index = this.index + 1;
        return Observable.of(this.newPatientMedicalInsurances);
    }

    public update(id: any, patientMedicalInsurance: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${id}`, patientMedicalInsurance);
    }

    public updateArray(id: any, patientMedicalInsurance: any): Observable<any> {
        const index = this.newPatientMedicalInsurances.findIndex(x => x.number == id);
        if (this.newPatientMedicalInsurances[index].byDefault != patientMedicalInsurance.byDefault) {
            if (this.newPatientMedicalInsurances.length == 1) return Observable.throw({ success: true, errorMessage: "El paciente tiene que tener una OS por defecto" });
            if (patientMedicalInsurance.byDefault)
                this.newPatientMedicalInsurances.forEach(element => {
                    element.byDefault = false;
                });
            else this.newPatientMedicalInsurances[!index ? 1 : 0].byDefault = true;
        }
        this.newPatientMedicalInsurances[index] = patientMedicalInsurance;

        return Observable.of(this.newPatientMedicalInsurances);
    }

    public delete(id: any): Observable<any> {
        if(!this.isNewPatient){
            return this.requestService.delete(`${this.baseUrl}/${id}`);
        } else {
            let position = this.newPatientMedicalInsurances.indexOf(id);
            if(position) {
                this.newPatientMedicalInsurances.splice(position,1);
            }
            return Observable.of(this.newPatientMedicalInsurances);
        }
    }

    public find(patientMedicalInsurance: PatientMedicalInsurance): boolean {
        var exist = false;
        let a = this.newPatientMedicalInsurances.find((e: any) => {
            return e.number == patientMedicalInsurance.number && e.number != patientMedicalInsurance.number;
        })
        if(a) {exist = true;}
        return exist;
    }

    public updateFisic(id: any, patientMedicalInsurance: any): Observable<any> {
        return this.requestService.put(`${this.baseUrl}/${id}`, patientMedicalInsurance);
    }

    public addFisic(patientMedicalInsurance: any): Observable<any> {
        return this.requestService.post(`${this.baseUrl}`, patientMedicalInsurance);
    }
}