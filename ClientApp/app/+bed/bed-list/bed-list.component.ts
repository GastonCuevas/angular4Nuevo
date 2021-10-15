import { Component, OnInit } from '@angular/core';
import { FilterType } from '../../+shared/util';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { BedService } from '../bed.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { GenericControl } from '../../+shared/index';
import { CommonService } from '../../+core/services/common.service';

@Component({
  selector: 'app-bed-list',
  templateUrl: './bed-list.component.html',
  styleUrls: ['./bed-list.component.scss']
})
export class BedListComponent implements OnInit {

  reloadingData: boolean = false;
  lookAndFeelCode: string;
  openModalSubject: Subject<any> = new Subject();
  bedId: 0;

  controlsToFilter: Array<GenericControl> = [
    { key: 'bedname', label: 'Cama', type: 'text', class: 'col s12 m6', searchProperty: 'name'},
    { key: 'ward', label: 'Sala', type: 'autocomplete', class: 'col s12 m6', functionForData: this.commonService.getWards(), searchProperty: 'wardId' },
    { key: 'type', label: 'Tipo', type: 'autocomplete', class: 'col s12 m6', functionForData: this.commonService.getBedTypes(), searchProperty: 'typeId'},
    { key: 'sector', label: 'Sector', type: 'autocomplete', class: 'col s12 m6', functionForData: this.commonService.getWardSectors(), searchProperty: 'ward.sectorId' }
  ];

  columns = [
    { header: "Cama", property: "name" },
    { header: "Sector", property: "ward.sectorName", searchProperty: 'ward.wardSector.name' },
    { header: "Sala", property: "ward.name", searchProperty: 'ward.name' },
    { header: "Tipo", property: "bedType.name", searchProperty: 'bedType.name' }
  ]

  paginator = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  }

  constructor(
    public bedService: BedService,
    private commonService: CommonService,
    public messageService: ToastyMessageService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onActionClick(event: any) {
    switch (event.action) {
      case 'new':
        this.router.navigate(['camas/camas/formulario'])
        break;

      case 'edit':
        this.router.navigate([`camas/camas/formulario/${event.item.id}`])
        break;

      case 'delete':
        this.bedId = event.item.id;
        if (this.bedId) this.openModalSubject.next();
        break;

      default:
        break;
    }
  }

  onAgree() {
    this.bedService.delete(this.bedId).subscribe(
       result => {
           this.bedId = 0;
           this.reloadingData = true;
           this.messageService.showSuccessMessagge("Se elimino correctamente");
       },
       error => {
           this.messageService.showErrorMessagge("Ocurrio un error inesperado");
       });  
  }

  updateReloadingData(event: any) {
    this.reloadingData = event.value;
  }
}