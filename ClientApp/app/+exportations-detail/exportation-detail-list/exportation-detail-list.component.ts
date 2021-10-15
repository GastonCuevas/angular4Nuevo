import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { ExportationDetail } from './../../models/exportationDetail.model';
import { Exportation } from './../../models/exportation.model';
import { Subject } from 'rxjs/Subject';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { FilterType } from '../../+shared/util';
import { Router, ActivatedRoute } from '@angular/router';
import { ExportationDetailService } from './../../+exportations-detail/exportation-detail.service';
import { ExportationService } from './../../+exportations/exportation.service';
import { CommonService } from './../../+core/services/common.service';
import { ToastyMessageService } from './../../+core/services/toasty-message.service';

@Component({
    selector: 'app-exportation-detail-list',
    templateUrl: 'exportation-detail-list.component.html'
})

export class ExportationDetailListComponent implements OnInit, OnChanges {

    exportationDetailId: 0;
    deleteModalSubject: Subject<any> = new Subject();
    reloadingData: boolean = false;
    @Input() exportId?: number; 

    columns = [
        { header: "Nombre", property: "name", elementFilter: new ElementFilter(FilterType.TEXT) },
        { header: "Nombre de archivo", property: "fileName", elementFilter: new ElementFilter(FilterType.TEXT) },
        { header: "Separador", property: "separa", elementFilter: new ElementFilter(FilterType.TEXT) }
    ]

    paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }

    constructor(
        private route: ActivatedRoute,
        public exportationDetailService: ExportationDetailService,
        private commonService: CommonService,
        private router: Router,
        private toastyMessageService: ToastyMessageService
    ) { }

    ngOnInit() {
        // this.exportationDetailService.expedientNumber = this.route.snapshot.paramMap.get('id');
    }

    ngOnChanges(changes: SimpleChanges){
        if(this.exportId != null){
            this.exportationDetailService.expedientNumber = this.exportId;
        }
    }

    goBack() {
        this.router.navigate([`sistema/exportaciones/formulario/${this.exportationDetailService.expedientNumber}`]);
    }

    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.router.navigate(['sistema/exportaciones/detalles/formulario'])
                break;
            case 'edit':
                this.router.navigate([`sistema/exportaciones/detalles/formulario/${event.item.number}`])
                break;
            case 'delete':
                this.exportationDetailId = event.item.number;
                if (this.exportationDetailId) this.deleteModalSubject.next();
                break;
            case 'detail':
                this.router.navigate([`sistema/exportaciones/detalles/detalleVista/${event.item.number}`]);
                break;
            default:
                break;
        }
    }

    onDeleteConfirm(event: any) {
        this.exportationDetailService.delete(this.exportationDetailId).subscribe(
            resp => {
                this.exportationDetailId = 0;
                this.reloadingData = true;
                this.toastyMessageService.showSuccessMessagge("Se elimino correctamente");
            },
            error => {
                this.toastyMessageService.showErrorMessagge("Ocurrio un error inesperado");
            });
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }

}