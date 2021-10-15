import { HcTableItemService } from './../hc-table-item.service';
import { HcTableService } from './../hc-table.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { Subject } from 'rxjs/Subject';
import { TypeFilter } from '../../+shared/constant';

@Component({
  selector: 'app-hc-table-list',
  templateUrl: './hc-table-list.component.html',
  styleUrls: ['./hc-table-list.component.scss']
})
export class HcTableListComponent implements OnInit {

  hcTableId: number;
  deleteModalSubject: Subject<any> = new Subject<any>();
  reloadingData: boolean = false;

  constructor(
    public hcTableService: HcTableService,
    public hcTableItemService: HcTableItemService,
    private router: Router,
    public toastyMessageService: ToastyMessageService
  ) { }

  ngOnInit() {
  }

  columns = [
    { header: "Nombre", property: "name", elementFilter: new ElementFilter(TypeFilter.TEXT) },
    { header: "Descripcion", property: "description", elementFilter: new ElementFilter(TypeFilter.TEXT) }
  ]

  paginator = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  }

  onActionClick(event: any) {
    switch(event.action){
      case 'new':
        this.router.navigate(['archivos/tablasHc/formulario']);
        break;
      case 'edit':
        this.router.navigate([`archivos/tablasHc/formulario/${event.item.number}`]);
        break;
      case 'delete':
        this.hcTableId = event.item.number
        if(this.hcTableId){
          this.deleteModalSubject.next();
        }
        break;
      default:
        break;
    }
  }

  onDeleteConfirm() {
    this.hcTableService.delete(this.hcTableId)
      .subscribe((resp: any) => {
        this.toastyMessageService.showMessageToast("Exito", "Se elimino correctamente", "success");
        this.reloadingData = true;
      },
      (error: any) => {
        this.toastyMessageService.showErrorMessagge();
      });
  }

  updateReloadingData(event: any) {
    this.reloadingData = event.value;
  }
}
