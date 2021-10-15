import { Component, OnInit } from '@angular/core';
import { PracticeInosService } from './../practice-inos.service';
import { PracticeInos } from './../../models/practiceInos.model';
import { Router } from '@angular/router';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';


import { TypeFilter } from '../../+shared/constant';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-practice-inos-list',
    templateUrl: 'practice-inos-list.component.html'
})

export class PracticeInosListComponent implements OnInit {
    practiceInos: Array<any>;

    columns = [
        { header: "Código", property: "code", elementFilter: new ElementFilter(TypeFilter.TEXT) },
        { header: "Tipo", property: "practiceTypeName", searchProperty: 'PracticeType.Name' },
        { header: "Descripción", property: "description", elementFilter: new ElementFilter(TypeFilter.TEXT) }
    ]

    paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }

    reloadingData: boolean = false;
    practiceInosId: 0;
    deleteModalSubject: Subject<any> = new Subject();

    constructor(
        public practiceInosService: PracticeInosService,
        private router: Router,
        private toastyService: ToastyMessageService
    ) { }

    ngOnInit() { }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.router.navigate(['archivos/practicasInos/formulario'])
                break;

            case 'edit':
                this.router.navigate([`archivos/practicasInos/formulario/${event.item.number}`])
                break;

            case 'delete':
                this.practiceInosId = event.item.number;
                if (this.practiceInosId) {
                    this.deleteModalSubject.next();
                }
                break;
            case 'detail':
                this.router.navigate([`archivos/practicasInos/detalle/${event.item.number}`]);

            default:
                break;
        }
    }

    onDeleteConfirm() {
        this.practiceInosService.delete(this.practiceInosId)
            .subscribe((resp: any) => {
                this.toastyService.showSuccessMessagge("Se elimino correctamente");
                this.reloadingData = true;
            },
            (error: any) => {
                this.toastyService.showErrorMessagge("Ocurrio un error al eliminar la práctica INOS");
            });
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }

    uploadFile() {
        this.router.navigate(['archivos/practicasInos/formulario/upload/file']);
    }
}