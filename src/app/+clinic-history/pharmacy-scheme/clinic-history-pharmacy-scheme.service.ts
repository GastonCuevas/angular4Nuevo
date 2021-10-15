import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestService } from './../../+core/services';
import { Sort, IColumn } from '../../+shared/util';
import { PharmacyScheme, MedicationScheme,  } from '../../models/pharmacy-scheme.model';

@Injectable()
export class ClinicHistoryPharmacySchemeService {
    schemesList = new Array<PharmacyScheme>();
    medicineSchemesList = new Array<MedicationScheme>();
    isNew = false;
    index: any;
    medicineScheme: MedicationScheme;
    scheme: PharmacyScheme;
    medicationsSelected: Array<any> = new Array<any>();

    columns: Array<IColumn>  = [
        { header: 'Codigo', property: 'articleCode', disableSorting: true },
        { header: 'Nombre', property: 'articleName', disableSorting: true },
        { header: 'Cantidad', property: 'quantity', disableSorting: true },
        { header: 'Fecha', property: 'date', disableSorting: true, type: 'date' },
        { header: 'Hora', property: 'time', disableSorting: true },
        { header: 'Posologia', property: 'posology', disableSorting: true }
    ];

    columnsMedicationScheme: Array<IColumn>  = [
        { header: 'Fecha de Inicio', property: 'dateIni', disableSorting: true },
        { header: 'Fecha de Fin', property: 'dateEnd', disableSorting: true },
        { header: 'Observación', property: 'observation', disableSorting: true }
    ];

    constructor(
        private requestService: RequestService
    ) {
    }

    addMedicineScheme (medicineScheme: MedicationScheme): boolean {
        this.medicineSchemesList.push(medicineScheme);
        return true;
    }
    updateMedicineScheme (medicineScheme: MedicationScheme): boolean {
        this.medicineSchemesList[this.index] = medicineScheme;
        return true;
    }
    deleteMedicineScheme(index: any): boolean {
        if (index === -1) return false;
        this.medicineSchemesList.splice(index, 1);
        return true;
    }

    getAllMedicineScheme (filterBy?: any, sort?: Sort): Observable<any> {
        return Observable.of({ model: this.medicineSchemesList });
    }

    setSchemesList(schemes?: Array<MedicationScheme>) {
        this.medicineSchemesList = schemes || [];
        // this.schemesList.forEach((d: MedicationScheme) => d.idCode = d.articleCode);
    }






    getAll(filterBy?: any, sort?: Sort): Observable<any> {
        return Observable.of({ model: this.schemesList });
    }

    getArticles(): Observable<any> {
        return this.requestService.get('api/hcEvolution/articles/combo');
    }

    save(pharmacyScheme: PharmacyScheme): boolean {
        return !pharmacyScheme.idCode ? this.add(pharmacyScheme) : this.update(pharmacyScheme);
    }

    add(pharmacyScheme: PharmacyScheme): boolean {
        pharmacyScheme.idCode = pharmacyScheme.articleCode;
        this.schemesList.push(pharmacyScheme);
        return true;
    }

    public addRange(contractProfessionalPractices: Array<any>): Observable<any> {
        contractProfessionalPractices.forEach(e => {
            this.schemesList.push(e);
        });
        return Observable.of(this.schemesList);
    }

    update(pharmacyScheme: PharmacyScheme) {
        const index = this.schemesList.findIndex((d: PharmacyScheme) => d.idCode == pharmacyScheme.idCode);
        if (index === -1) return false;
        pharmacyScheme.idCode = pharmacyScheme.articleCode;
        this.schemesList[index] = pharmacyScheme;
        return true;
    }

    delete(id: string): boolean {
        const index = this.schemesList.findIndex((d: PharmacyScheme) => d.idCode === id);
        if (index === -1) return false;
        this.schemesList.splice(index, 1);
        return true;
    }

    // setSchemesList(schemes?: Array<PharmacyScheme>) {
    //     this.schemesList = schemes || [];
    //     this.schemesList.forEach((d: PharmacyScheme) => d.idCode = d.articleCode);
    // }

    exists(pharmacyScheme: PharmacyScheme): boolean {
        return this.schemesList.some((d: PharmacyScheme) => d.articleCode == pharmacyScheme.articleCode && d.idCode != pharmacyScheme.idCode);
    }

	resetService() {
		this.scheme = new PharmacyScheme();
		this.schemesList = new Array<PharmacyScheme>();
		this.isNew = false;
    }

    public getMedicationsToCheck(paginator: any, filterBy?: string, sort?: Sort): Observable<any> {
        let url: string = "api/hcevolutionpharmacy/medications?";
        // if (this.osId) url += `filterBy=MedicalInsuranceContract.MedicalInsuranceNumber = ${this.osId}`;
        if (filterBy) url += `filterBy= ${filterBy}&`; else url +=`&`;
        if (sort) url += `orderBy=${sort.sortBy}&ascending=${sort.ascending}`;

        return this.requestService.get(url);
    }

    // selectedAll(checked: boolean) {
    //     this.medicationsSelected.forEach(item => {
    //         if (item.added == false) {
    //             item.selected = checked;
    //         }
    //     });
    // }
}