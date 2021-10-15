import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonService, ToastyMessageService } from '../../+core/services';
import { BedMovementService } from '../bed-movement.service';
import { PaginatorComponent, GenericControl } from '../../+shared';

@Component({
    selector: 'app-bed-movement-list',
    templateUrl: './bed-movement-list.component.html',
    styleUrls: ['./bed-movement-list.component.scss']
})
export class BedMovementListComponent implements OnInit, AfterViewInit {

    isLoading: boolean = true;
    bedMovements: Array<any>;

    controlsToFilter: Array<GenericControl> = [
        { key: 'sector', label: 'Sector', type: 'autocomplete', class: 'col s12 m3', functionForData: this.commonService.getGenericCombo('SECTOR_SALA'), searchProperty: 'Ward.SectorId'},
        { key: 'ward', label: 'Sala', type: 'autocomplete', class: 'col s12 m3', functionForData: this.commonService.getWards(), searchProperty: 'WardId' },
        { key: 'bedType', label: 'Tipo de Cama', type: 'autocomplete', class: 'col s12 m3', functionForData: this.commonService.getGenericCombo('TIPO_CAMAS'), searchProperty: 'TypeId'},
        { key: 'wardType', label: 'Tipo de Sala', type: 'autocomplete', class: 'col s12 m3', functionForData: this.commonService.getGenericCombo('TIPO_SALAS'), searchProperty: 'Ward.TypeId'}
    ];
    
    private filterBy: string = '';

    @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;

    constructor(
        private commonService: CommonService,
        private toastyMessageService: ToastyMessageService,
        public bedMovementService: BedMovementService
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.loadBeds();
    }

    onFilterChange(filterBy: string) {
        this.filterBy = filterBy;
        this.paginatorComponent.paginator.currentPage = 1;
        this.loadBeds();
    }

    onPageChange() {
        this.loadBeds();
    }

    private loadBeds() {
        this.isLoading = true;
        this.bedMovementService.getAll(this.paginatorComponent.paginator, this.filterBy)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.paginatorComponent.loadPaginator(response.itemsCount);
                this.bedMovements = response.model;
            },
            error => {
                this.toastyMessageService.showErrorMessagge("Ocurrio un error al obtener los datos");
            });
    }
}
