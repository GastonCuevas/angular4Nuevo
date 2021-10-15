import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExportationDetail } from './../../models/exportationDetail.model';
import { Subject } from 'rxjs/Subject';
import { ActivatedRoute } from '@angular/router';
import { ExportationDetailService } from './../exportation-detail.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from './../../+core/services/utility.service';
import { ConfigCKEditor } from '../config-ckeditor';
import * as jquery from 'jquery';


@Component({
    selector: 'app-exportation-detail-form',
    templateUrl: 'exportation-detail-form.component.html',
    styleUrls: ['./exportation-detail-form.component.css']
})

export class ExportationDetailFormComponent implements OnInit, AfterViewChecked {
    exportationDetail: ExportationDetail = new ExportationDetail();
    openModalSubject: Subject<any> = new Subject();
    form: FormGroup;
    isEdit: boolean = false;
    isLoading: boolean = false;
    title: string = "Nuevo Detalle de Exportación";
    expedientNumber: number = 0;
    tipos: Array<any> = new Array<any>();
    isCsv: boolean = false;

    config = ConfigCKEditor.CONFIG_EDIT;

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private exportationDetailService: ExportationDetailService,
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService
    ) { }

    ngOnInit() {
        this.loadTypesCombo();
        this.loadForm();
        this.expedientNumber = this.exportationDetailService.expedientNumber;
    }

    ngAfterViewChecked() {
        $('#textarea1').trigger('autoresize');
        $('#textarea2').trigger('autoresize');
    }

    onChangeDetailType() {
        if(this.exportationDetail.type == "2") {
            this.isCsv = true;
        } else {
            this.isCsv = false;
            this.exportationDetail.separa ='';
        }
    }

    loadTypesCombo() {
        this.exportationDetailService.getDetailType().subscribe(response => {
            this.tipos = response;
        });
    }

    loadForm() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.getExportationDetail(id);
        else this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            name: [this.exportationDetail.name, Validators.required],
            fileName: [this.exportationDetail.fileName, Validators.required],
            sql: [this.exportationDetail.sql, null],
            separa: [this.exportationDetail.separa, null],
            docHtml: [this.exportationDetail.docHtml, null],
            tipos: [this.exportationDetail.type, Validators.required]
        })
    }

    getExportationDetail(id: string) {
        this.isEdit = true;
        this.title = "Editar Detalle de Exportación";
        this.isLoading = true;
        this.exportationDetailService.get(id).subscribe(response => {
            this.exportationDetail = response.model;
            this.createForm();
            this.onChangeDetailType();
            this.isLoading = false;
        },
        error => {
            this.isLoading = false;
            this.toastyMessageService.showErrorMessagge();
        })
    }

    onSubmit($event: any) {
        let id = this.route.snapshot.paramMap.get('id');
        if (!id) {
            this.exportationDetail.expedientNumber = this.expedientNumber;
            this.exportationDetailService.add(this.exportationDetail).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Alta exitosa de Detalla de Exportación");
                this.utilityService.navigate("sistema/exportaciones/formulario/"+this.expedientNumber);
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrió un error al dar el alta");
                })
        } else {
            this.exportationDetailService.update(id, this.exportationDetail).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                this.utilityService.navigate("sistema/exportaciones/formulario/"+this.expedientNumber);
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrió un error al guardar los cambios");
                }
            )
        }
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this.utilityService.navigate("sistema/exportaciones/formulario/"+this.expedientNumber);
    }

}