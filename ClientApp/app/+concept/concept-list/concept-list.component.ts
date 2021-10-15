import { Component, OnInit } from '@angular/core';
import { TypeFilter } from '../../+shared/constant';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ConceptService } from '../concept.service';
import { IColumn } from '../../+shared/util';
import { GenericControl } from '../../+shared';

@Component({
  selector: 'app-concept-list',
  templateUrl: './concept-list.component.html',
  styleUrls: ['./concept-list.component.scss']
})
export class ConceptListComponent implements OnInit {

  reloadingData: boolean = false;
  lookAndFeelCode: string;
  openModalSubject: Subject<any> = new Subject();
  conceptId: 0;

  columns: Array<IColumn> = [
    { header: "Codigo", property: "code" },
    { header: "Descripcion", property: "description" },
    { header: "Precio", property: "price" },
    { header: "Tipo", property: "typeString", searchProperty: 'type' }
  ]
	controlsToFilter: Array<GenericControl> = [
    { key: 'code', label: 'Código', type: 'text', class: 'col s12 m3' },
    { key: 'description', label: 'Descripción', type: 'text', class: 'col s12 m6' },
    { key: 'price', label: 'Precio', type: 'number', class: 'col s12 m3' }

  ];

  paginator = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  }

  constructor(
    public conceptService: ConceptService,
    public messageService: ToastyMessageService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onActionClick(event: any) {
    switch (event.action) {
      case 'new':
        this.router.navigate(['sisarchivos/conceptos/formulario'])
        break;

      case 'edit':
        this.router.navigate([`sisarchivos/conceptos/formulario/${event.item.number}`])
        break;

      case 'delete':
        this.conceptId = event.item.number;
        if (this.conceptId) this.openModalSubject.next();
        break;

      default:
        break;
    }
  }

  onAgree() {
    this.conceptService.delete(this.conceptId).subscribe(
       result => {
           this.conceptId = 0;
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