import { Component, OnInit } from '@angular/core';
import { TypeFilter } from '../../+shared/constant';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { WardService } from '../ward.service';

@Component({
  selector: 'app-ward-list',
  templateUrl: './ward-list.component.html',
  styleUrls: ['./ward-list.component.scss']
})
export class WardListComponent implements OnInit {

  reloadingData: boolean = false;
  lookAndFeelCode: string;
  openModalSubject: Subject<any> = new Subject();
  bedId: 0;

  columns = [
    { header: "nombre", property: "name", elementFilter: new ElementFilter(TypeFilter.TEXT) },
    { header: "Sector", property: "wardSector.name", elementFilter: new ElementFilter(TypeFilter.TEXT) },
    { header: "Tipo", property: "wardType.name", elementFilter: new ElementFilter(TypeFilter.TEXT) }
  ]

  paginator = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  }

  constructor(
    public wardService: WardService,
    public messageService: ToastyMessageService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  onActionClick(event: any) {
    switch (event.action) {
      case 'new':
        this.router.navigate(['camas/salas/formulario'])
        break;

      case 'edit':
        this.router.navigate([`camas/salas/formulario/${event.item.number}`])
        break;

      case 'delete':
        this.bedId = event.item.number;
        if (this.bedId) this.openModalSubject.next();
        break;

      default:
        break;
    }
  }

  onAgree() {
    this.wardService.delete(this.bedId).subscribe(
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