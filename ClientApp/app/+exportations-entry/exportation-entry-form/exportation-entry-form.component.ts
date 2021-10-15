import { Component, OnInit } from '@angular/core';
import { ExportationEntry } from './../../models/exportationEntry.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { ToastyMessageService } from './../../+core/services/toasty-message.service';
import { UtilityService } from './../../+core/services/utility.service';
import { ActivatedRoute } from '@angular/router';
import { ExportationEntryService } from './../exportation-entry.service';


@Component({
    selector: 'selector-name',
    templateUrl: 'exportation-entry-form.component.html',
    styleUrls: ['./exportation-entry-form.component.css']
})

export class ExportationEntryFormComponent implements OnInit {
    exportationEntry: ExportationEntry = new ExportationEntry();
    form: FormGroup;
    openModalSubject: Subject<any> = new Subject();
    isEdit: boolean = false;
    isLoading: boolean = false;
    title: string = "Nueva Entrada de Exportación";
    tipos: Array<any> = new Array<any>();
    expedientNumber: number = 0;
    showItems: boolean = false;


    constructor(
        private fb: FormBuilder,
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,
        private route: ActivatedRoute,
        private exportationEntryService: ExportationEntryService
    ) { }

    ngOnInit() {
        this.loadEntryTypes();
        this.loadForm();
        this.expedientNumber = this.exportationEntryService.expedientNumber;
    }

    loadEntryTypes() {
        this.exportationEntryService.getEntryTypes().subscribe(response => {
            this.tipos = response;
        })
    }

    onChangeEntryType() {
        if(this.exportationEntry.type != null && this.exportationEntry.type == '50') {
            this.showItems = true;
        } else {
            this.showItems = false;
            this.exportationEntry.tableFo = "";
            this.exportationEntry.fieldFo = "";
        }
    }

    loadForm() {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) this.getExportationDetail(id);
        else this.createForm();
    }

    createForm() {
        this.form = this.fb.group({
            name: [this.exportationEntry.name, Validators.required],
            key: [this.exportationEntry.key, null],
            tableFo: [this.exportationEntry.tableFo, null],
            fieldFo: [this.exportationEntry.fieldFo, null],
            types: [this.exportationEntry.type, Validators.required]
        })
    }

    getExportationDetail(id: string) {
        this.isEdit = true;
        this.title = "Editar Entrada de Exportación";
        this.isLoading = true;
        this.exportationEntryService.get(id).subscribe(response => {
            this.exportationEntry = response.model;
            if(this.exportationEntry.type != null && this.exportationEntry.type == '50') {
                this.showItems = true;
            } else {
                this.showItems = false;
            }
            this.createForm();
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
            this.exportationEntry.expedientNumber = this.expedientNumber;
            this.exportationEntryService.add(this.exportationEntry).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Alta exitosa de Entrada de Exportación");
                this.utilityService.navigate("sistema/exportaciones/formulario/" + this.expedientNumber);
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrió un error al dar el alta");
                })
        } else {
            this.exportationEntryService.update(id, this.exportationEntry).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                this.utilityService.navigate("sistema/exportaciones/formulario/" + this.expedientNumber);
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
        const id = this.route.snapshot.paramMap.get('id');
        this.utilityService.navigate("sistema/exportaciones/formulario/" + this.expedientNumber);
    }
}