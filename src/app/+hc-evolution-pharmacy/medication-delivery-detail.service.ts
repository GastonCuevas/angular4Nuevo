import { Injectable } from '@angular/core';
import { RequestService, ToastyMessageService } from '../+core/services';
import { Observable } from 'rxjs/Observable';
import { ISort } from '../interface/sort.interface';
import { IColumn } from '../interface/column.interface';
import { InternmentSelectedService } from './internment-selected.service';
import { InternmentSelected } from '../models/internment-selected.model';
import { Paginator } from '../+shared/util/index';

@Injectable()
export class MedicationDeliveryDetailService {

  baseUrl = "api/internment";
  columns: Array<IColumn> = [
    { header: "Paciente", property: "patientName", disableSorting: true },
    { header: "Fecha desde", property: "dateIni", disableSorting: true },
    { header: "Fecha hasta", property: "dateEnd", disableSorting: true },
    { header: "Cantidad", property: "count", disableSorting: true },
  ];
  selectedInternments: Array<InternmentSelected> = new Array<InternmentSelected>();
  allInternments: Array<InternmentSelected> = new Array<InternmentSelected>();

  constructor(
    private requestService: RequestService,
    public internmentSelectedService: InternmentSelectedService,
    private toastyMessageService: ToastyMessageService
  ) { }

  public getAllInternments() {
    let url = `api/internment/all/${this.internmentSelectedService.patMovId.id}`;
    return this.requestService.get(url)
      .map(response => {
        let selected = new Array<any>();
        this.allInternments = response.model;
        this.allInternments.forEach(item => {
          if (this.internmentSelectedService.allSelected) {
            item.selected = !((this.internmentSelectedService.uncheckedInternmentIds.findIndex((d: number) => d == item.id)) != -1);
          } else if (!this.internmentSelectedService.allSelected) {
            item.selected = this.internmentSelectedService.internmentIds.findIndex((d: number) => d == item.id) != -1;
          }

          if (item.selected) {
            this.selectedInternments.push(item);
            selected.push(item);
          }
        });
        response['selected'] = selected;
        return response;
      });
  }

  // public getAll(paginator: Paginator, sort?: ISort): Observable<any> {
  //   let startIndex = (paginator.currentPage - 1) * paginator.pageSize;
  //   let endIndex = Math.min(startIndex + paginator.pageSize - 1, paginator.totalItems - 1);

  //   return this.getAllInternments(1)
  //     .map(result => {
  //       let selectedPage = result.model;
  //       let response: any = {
  //         model: selectedPage,
  //         itemsCount: result.model.length,
  //         pageSize: paginator.pageSize,
  //         pageNumber: paginator.currentPage
  //       };
  //       console.log("response:", result);
  //       return response;
  //     });
  // }

  public getScheme(): Observable<any> {

    let url = `api/internment/all/${this.internmentSelectedService.patMovId.id}`;
    return this.requestService.get(url);

    // return this.getAllInternments()
    //   .map(result => {
    //     //let selectedPage = result.model[result.model.length-1];
    //     let response: any = {
    //       model: result.model,
    //     };
    //     return response;
    //   });
  }

}
