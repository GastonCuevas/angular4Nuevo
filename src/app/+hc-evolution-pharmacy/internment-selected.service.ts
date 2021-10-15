import { forEach } from '@angular/router/src/utils/collection';
import { Injectable } from '@angular/core';
import { ISort } from '../interface/sort.interface';
import { Observable } from 'rxjs/Observable';
import { RequestService } from '../+core/services/request.service';
import { PatientMedicationConsumption } from '../models/patien-medication-consumption.model';
import { Internment } from '../models/internment.model';
import { InternmentSelected } from '../models/internment-selected.model';

@Injectable()
export class InternmentSelectedService {

    baseUrl = "api/internment";
    patientNumber: any;
    patientName: string = "";
    index: number = 0;

    internmentIds: Array<number> = new Array<number>();
    uncheckedInternmentIds: Array<number> = new Array<number>();
    newPatientMedicationConsumption: Array<PatientMedicationConsumption> = new Array<PatientMedicationConsumption>();
    isNewPatientMedicationConsumption: boolean;
    isNewPatient: boolean;
    number: number = 0;
    filter: string;
    selectedInternments: Array<InternmentSelected>;
    allSelected: boolean;
    quantityElements: number = 0;
    public patMovId: any;

    private allItems: any[];

    // pager object
    pager: any = {};

    // paged items
    pagedItems: any[];

    constructor(
        public requestService: RequestService
    ) {
        this.isNewPatientMedicationConsumption = false;
        this.index = 0;
    }

    public getAll(paginator: any, filterBy?: any, sort?: ISort): Observable<any> {
        let url = `${this.baseUrl}/getInternmentsToSelect?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`
        url += filterBy ? `&filterBy=${filterBy}` : '&filterBy=PatMov.MovementState.Number=1';
        if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
        return this.requestService.get(url)
            .map(response => {
                this.quantityElements = response.itemsCount;
                response.model.forEach((item: any) => {
                    item.selected = this.allSelected;
                    item.time = item.time.substr(0, 5);
                });

                // carga de items seleccionados
                response.model.forEach((item: any) => {
                    if (this.allSelected) {
                        item.selected = !((this.uncheckedInternmentIds.findIndex((d: number) => d == item.id)) != -1);
                    } else if (!this.allSelected) {
                        item.selected = this.internmentIds.findIndex((d: number) => d == item.id) != -1;
                    }
                });

                return response;
            });
    }

    public deleteInternmentId(id: number) {
        if (this.allSelected) this.uncheckedInternmentIds.push(id);
        const index = this.internmentIds.findIndex((d: number) => d == id);
        if (index != -1) this.internmentIds.splice(index, 1);
    }

    deleteUncheckedItem(id: number) {
        const index = this.uncheckedInternmentIds.findIndex((d: number) => d == id);
        if (index != -1) this.uncheckedInternmentIds.splice(index, 1);
    }
}
