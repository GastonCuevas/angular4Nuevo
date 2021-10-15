import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Exportation } from './../../models/exportation.model';
import { ExportationDetail } from './../../models/exportationDetail.model';
import { CommonService } from '../../+core/services/common.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from './../../+core/services/utility.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ExportationService } from './../exportation.service';

var FileSaver: any = require('file-saver');
var easyxml: any = require('easyxml');

@Component({
    selector: 'app-exportation-form',
    templateUrl: 'exportation-form.component.html'
})

export class ExportationFormComponent implements OnInit {
    exportation: Exportation = new Exportation();
    exportations: Array<Exportation> = new Array<Exportation>();
    exportationDetails: Array<ExportationDetail> = new Array<ExportationDetail>();
    exportationDetail: ExportationDetail = new ExportationDetail();
    openModalSubject: Subject<any> = new Subject();
    optionSelect: string;
    optionDetail: string;
    expNumber: number;
    fileName: string;
    sql: string;
    split: string;
    isNull: boolean = false;
    title: string = "Nueva Exportación";
    isEdit: boolean = false;
    isLoading: boolean = false;
    form: FormGroup;
    value: string = "";
    check: boolean = false;

    constructor(
        private commonService: CommonService,
        private toastyService: ToastyMessageService,
        private utilityService: UtilityService,
        private activatedRoute: ActivatedRoute,
        private exportationService: ExportationService,
        private fb: FormBuilder,
        private router: Router

    ) { }

    ngOnInit() {
        this.loadForm();
    }

    loadExportations() {
        this.commonService.getExportations().subscribe(response => {
            this.exportations = response.model;
        });
    }

    onChangeExport() {
        let number = +this.optionSelect;
        let lenght: number;
        for (let i in this.exportations) {
            if (this.exportations[i].number == number) {
                this.isNull = false;
                this.exportationDetails = <Array<Exportation>>this.exportations[i].exportationDetails;
            }
        }
    }

    onChangeDetail() {
        let number = +this.optionDetail;
        for (let i in this.exportationDetails) {
            if (this.exportationDetails[i].number == number) {
                this.isNull = true;
                this.exportationDetail = this.exportationDetails[i];
            }
        }
    }

    loadForm() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) this.getExportation(id);
        else this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            name: [this.exportation.name, Validators.required],
            description: [this.exportation.description, Validators.required]
        })
    }

    getExportation(id: string) {
        this.isEdit = true;
        this.title = "Editar Exportación";
        this.isLoading = true;
        this.exportationService.get(id).subscribe(response => {
            this.exportation = response.model;
            this.createForm();
            this.isLoading = false;
        },
            error => {
                this.isLoading = false;
                this.toastyService.showErrorMessagge();
            })
    }

    onSubmit($event: any) {
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        if (!id) {
            this.exportationService.add(this.exportation).subscribe(response => {
                this.toastyService.showSuccessMessagge("Alta exitosa de exportación");
                this.utilityService.navigate("sistema/exportaciones");
            },
                error => {
                    this.toastyService.showErrorMessagge("Ocurrió un error al dar el alta");
                })
        } else {
            this.exportationService.update(id, this.exportation).subscribe(response => {
                this.toastyService.showSuccessMessagge("Se guardaron los cambios");
                this.utilityService.navigate("sistema/exportaciones");
            },
                error => {
                    this.toastyService.showErrorMessagge("Ocurrió un error al dar el alta");
                })
        }
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this.utilityService.navigate("sistema/exportaciones");
    }

    goToExportationDetailForm(event: any) {
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        this.router.navigate([`sistema/exportaciones/detalles/` + id]);
    }


    goToExportationEntryForm(event: any) {
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        this.router.navigate([`sistema/exportaciones/entradas/` + id]);
    }

    convertToXML() {
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        this.exportationService.exportDefinition(id).subscribe(response => {
            try {
                this.check = true;
                var serializer = new easyxml({
                    singularize: true,
                    rootElement: 'NewDataSet',
                    dateFormat: 'ISO',
                    manifest: true,
                    unwrapArrays: true
                });
                var xml = serializer.render(response.content);
                var blob = new Blob([xml], { type: "application/xml" });
                FileSaver.saveAs(blob, response.fileName+".xml");
            } catch (error) {
                this.check = false;
            }
            this.check = true;

        })
    }

    downloadJsonFile() {
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        this.exportationService.exportDefinition(id).subscribe(response => {
            try {
                this.check = true;
                var blob = new Blob([JSON.stringify(response.content)], { type: "application/json" });
                FileSaver.saveAs(blob, response.fileName+".json");
            } catch (error) {
                this.check = false;
            }
            this.check = true;

        })
    }


}