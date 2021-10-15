import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';

import { ToastyMessageService, UtilityService } from '../../+core/services';
import { CubeService } from '../cube.service';
import { Cube } from '../../models';

import * as moment from 'moment';
import { IColumn } from '../../interface';

@Component({
    selector: 'app-cube-form',
    templateUrl: './cube-form.component.html',
    styleUrls: ['./cube-form.component.scss']
})
export class CubeFormComponent implements OnInit {

    isLoading = false;
    isNew = false;
    cubeId: number;
    reloadingData: boolean = false;
    form: FormGroup;
    formInit: FormGroup;
    sourceParameteres = this.cubeService.getCombo();
    sourceCubes = this.cubeService.getCubesCombo();
    openModalSubject: Subject<any> = new Subject();
    datePickerOptions: any;
    datePickerOptionsWhitMin: any;
    showDPOwhitMin = true;

    selectedCube = new Cube();

    columns: Array<IColumn> = [
        { header: "Codigo", property: "code" },
        { header: "Descripcion", property: "name" },
        { header: "Fecha Desde", property: "dateFrom", disableSorting: true },
        { header: "Fecha hasta", property: "dateTo", disableSorting: true }
      ]
    paginator = { currentPage: 1, pageSize: 10, totalItems: 0 };

    constructor(
        private fb: FormBuilder,
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        public cubeService: CubeService,
    ) { this.initDatePickerOptions(); }

    ngOnInit() { this.createForm(); }

    private initDatePickerOptions() {
        this.datePickerOptions = this.utilityService.getDatePickerOptions();
        this.datePickerOptions.max = false;
        this.datePickerOptionsWhitMin = this.utilityService.getDatePickerOptions();
        this.datePickerOptionsWhitMin.max = false;
        this.datePickerOptions['onSet'] = (value: any) => {
            if (value.select) {
                this.datePickerOptionsWhitMin.min = moment(this.form.value.dateFrom, 'DD/MM/YYYY').toDate();
                this.showDPOwhitMin = !this.showDPOwhitMin;
                if (this.form.value.dateTo) {
                    if (moment(this.form.value.dateTo, 'DD/MM/YYYY').isBefore(moment(this.form.value.dateFrom, 'DD/MM/YYYY'), 'day')) {
                        this.form.controls.dateTo.setValue(null);
                    }
                }
            }
            else if (value.clear === null) {
                this.datePickerOptionsWhitMin.min = false;
                this.showDPOwhitMin = !this.showDPOwhitMin;
            }
        }
    }

    private createForm() {
        this.form = this.fb.group({
            cube: ['', Validators.required],
            dateFrom: ['', Validators.required],
            dateTo: ['', Validators.required]
        });
    }

    private setSelected(item: Cube) {
        this.selectedCube = item;
    }

    analizeCube() {
        // this.selectedCube.dateFrom = moment(this.form.value.dateFrom, 'DD/MM/YYYY').format('YYYY/MM/DD');
        // this.selectedCube.dateTo = moment(this.form.value.dateTo, 'DD/MM/YYYY').format('YYYY/MM/DD');
        this.selectedCube.dateFrom = this.form.value.dateFrom;
        this.selectedCube.dateTo = this.form.value.dateTo
        this.cubeService.selectedCube = this.selectedCube;
        this.utilityService.navigate(`archivos/cubo-analisis/${this.selectedCube.code}`);
    }

    setNew() { this.isNew = true; }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }

    onActionClick(event: any) {
        switch (event.action) {
          case 'new':
            this.setNew();
            break;
    
          case 'edit':
          this.selectedCube = event.item;
            this.cubeService.selectedCube = this.selectedCube;
            this.cubeService.isLoad = true;
            this.utilityService.navigate(`archivos/cubo-analisis/${this.selectedCube.code}`);
            break;
    
          case 'delete':
            this.cubeId = event.item.number;
            if (this.cubeId) this.openModalSubject.next();
            break;
          default:
            break;
        }
      }
    
    onAgree() {
        this.cubeService.delete(this.cubeId).subscribe(
        result => {
            this.cubeId = 0;
            this.reloadingData = true;
            this.toastyMessageService.showSuccessMessagge("Se elimino correctamente");
        },
        error => {
            this.toastyMessageService.showErrorMessagge("Ocurrio un error en el servidor");
        });  
      }
    onReturn() {
        this.isNew = false;
        this.utilityService.navigate(`archivos/cubo`);
    }
}
