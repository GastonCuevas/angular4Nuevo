import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportationService } from '../exportation.service';
import { Exportation } from '../../models/exportation.model';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs/Subject';
import { ElementFilter } from '../../+shared/dynamic-table/element-filter.model';
import { TypeFilter } from '../../+shared/constant';
import { ExportationDetailService } from '../../+exportations-detail/exportation-detail.service';
import { ExportationEntryService } from '../../+exportations-entry/exportation-entry.service';
import { UtilityService } from '../../+core/services/utility.service';
import { ExportationDetail } from '../../models/exportationDetail.model';
import { ExportationEntry } from '../../models/exportationEntry.model';
import { ConfigCKEditor } from '../../+exportations-detail/config-ckeditor';
import * as jquery from 'jquery';

@Component({
    selector: 'app-exportation-clone',
    templateUrl: 'exportation-clone-form.component.html',
    styleUrls: ['./exportation-clone-form.component.css']
})

export class ExportationCloneFormComponent implements OnInit {
    title: string = "";
    isLoading: boolean = false;
    form: FormGroup;
    formDetail: FormGroup;
    exportation: Exportation;
    isEdit: boolean = false;
    exportationDetailId: 0;
    exportationEntryNumber: 0;
    arrayOfDetails: Array<ExportationDetail> = Array<ExportationDetail>();
    arrayOfEntries: Array<ExportationEntry> = new Array<ExportationEntry>();
    indexDetail: number = 0;
    indexEntries: number = 0;
    exportationDetail: ExportationDetail = new ExportationDetail();
    tipos: Array<any> = new Array<any>();
    types: Array<any> = new Array<any>();
    isCsv: boolean = false;
    titleDetail: string = "Nuevo Detalle de Exportación";
    itemValueDetail: number = 0;
    itemValueEntry: number = 0;
    itemValue: number = 0;
    isNewDetail: boolean = false;
    isNew: boolean = false;
    expedientNumber: number = 0;
    exportationEntry: ExportationEntry = new ExportationEntry();
    showItems: boolean = false;
    formEntry: FormGroup;
    titleEntry: string = "Nueva Entrada de Exportación";
    isNewEntry: boolean = false;

    exportationId: 0;
    deleteModalSubjectDetail: Subject<any> = new Subject();
    deleteModalSubjectEntry: Subject<any> = new Subject();
    reloadingData: boolean = false;
    openModalSubject: Subject<any> = new Subject();
    openModalSubjectDetail: Subject<any> = new Subject();
    openModalSubjectEntry: Subject<any> = new Subject();

    config = ConfigCKEditor.CONFIG_EDIT;
    
    columnsDetail = [
        { header: "Nombre", property: "name", elementFilter: new ElementFilter(TypeFilter.TEXT) },
        { header: "Nombre de expediente", property: "fileName", elementFilter: new ElementFilter(TypeFilter.TEXT) },
        { header: "SQL", property: "sql", elementFilter: new ElementFilter(TypeFilter.TEXT), disableSorting: true },
        { header: "separa", property: "separa", elementFilter: new ElementFilter(TypeFilter.TEXT) }
    ]

    paginatorDetail = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }

    columnsEntry = [
        { header: "Nombre", property: "name", elementFilter: new ElementFilter(TypeFilter.TEXT) },
        { header: "Key", property: "key", elementFilter: new ElementFilter(TypeFilter.TEXT) },
        { header: "Tipo", property: "typeDescription", disableSorting: true },
        { header: "Tabla Fo", property: "tableFo", disableSorting: true },
        { header: "Campo Fo", property: "fieldFo", disableSorting: true },
    ]

    paginatorEntry = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }

    constructor(
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        public utilityService: UtilityService,
        public exportationService: ExportationService,
        public toastyMessageService: ToastyMessageService,
        public exportationDetailService: ExportationDetailService,
        public exportationEntryService: ExportationEntryService
    ) { }

    ngOnInit() { 
        this.loadForm();
        this.loadTypesCombo();
        this.loadEntryTypes();
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
        }, error => {
            this.toastyMessageService.showErrorMessagge("Ocurrio un error al traer los datos de los tipos");
        });
    }

    loadForm() {
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) this.getExportation(id);
        else this.createForm();
    }

    getExportation(id: string) {
        this.isEdit = true;
        this.title = "Clonar Exportación";
        this.isLoading = true;
        this.exportationService.get(id).subscribe(response => {
            this.exportation = response.model;
            let clone = this.activatedRoute.snapshot.paramMap.get('change');
            if (clone && (clone == "clone")) {
                this.exportation.number = 0;
                console.log("Entro por el clonar----");
                console.log("vector de detalles de exportaciones original: ",this.exportation);
                if(this.exportation.exportationDetails != null) {
                    for (let i = 0; i < this.exportation.exportationDetails.length; i++) {
                        this.exportation.exportationDetails[i].number = 0;
                    }
                    this.arrayOfDetails = this.exportation.exportationDetails;
                    for(let i = 0; i < this.arrayOfDetails.length; i++) {
                        if(this.arrayOfDetails[i].number != null){
                            this.arrayOfDetails[i].number = this.indexDetail;
                            this.indexDetail = this.indexDetail + 1;
                        }
                    }
                    this.exportationDetailService.exportationDetails = this.arrayOfDetails;
                    console.log("Vector de detalles de exportacion: ",this.arrayOfDetails);
                }

                if(this.exportation.exportEntries != null) {
                    for(let i = 0; i < this.exportation.exportEntries.length; i++) {
                        this.exportation.exportEntries[i].number = 0;
                    }
                    this.arrayOfEntries = this.exportation.exportEntries;
                    for(let i = 0; i < this.arrayOfEntries.length; i++) {
                        if(this.arrayOfEntries[i].number != null) {
                            this.arrayOfEntries[i].number = this.indexEntries;
                            this.indexEntries = this.indexEntries + 1;
                        }
                    }
                    this.exportationEntryService.exportationEntries = this.arrayOfEntries;
                }
                
            }
            this.createForm();
            this.isLoading = false;
        },
            error => {
                this.isLoading = false;
                this.toastyMessageService.showErrorMessagge("asfasfcas");
            })
    }

    createForm() {
        this.form = this.fb.group({
            name: [this.exportation.name, Validators.required],
            description: [this.exportation.description, Validators.required]
        })
    }

    // inicio de logica formulario de detalle
    
    onActionClickDetail(event: any) {
        switch (event.action) {
            case 'new':
                this.itemValueDetail = 0;
                this.titleDetail = "Nuevo Detalle de Exportación";    
                this.exportationDetail = new ExportationDetail();
                this.exportationDetailService.isNewDetail = true;
                this.isNewDetail = true;
                this.createFormDetail();
                this.isNew = true;
                break;
            case 'edit':
                this.itemValueDetail = parseInt(`${event.item.number}`);
                this.isLoading = true;
                this.exportationDetail = new ExportationDetail();
                this.titleDetail = "Editar Detalle de Exportación";
                this.exportationDetailService.isNewDetail = true;
                for(let i = 0;i < this.exportationDetailService.exportationDetails.length;i++) {
                    if(this.itemValueDetail == this.exportationDetailService.exportationDetails[i].number) {
                        this.exportationDetail.fileName = this.exportationDetailService.exportationDetails[i].fileName;
                        this.exportationDetail.name = this.exportationDetailService.exportationDetails[i].name;
                        this.exportationDetail.separa = this.exportationDetailService.exportationDetails[i].separa;
                        this.exportationDetail.sql = this.exportationDetailService.exportationDetails[i].sql;
                        this.exportationDetail.type = this.exportationDetailService.exportationDetails[i].type;
                        this.exportationDetail.docHtml = this.exportationDetailService.exportationDetails[i].docHtml;
                        this.exportationDetail.number = this.exportationDetailService.exportationDetails[i].number;
                    }
                }
                this.isLoading = false;
                this.createFormDetail();
                this.isNewDetail = true;
                break;
            case 'delete':
                this.exportationDetailId = event.item.number;
                if (this.exportationDetailId) this.deleteModalSubjectDetail.next();
                break;
            default:
                break;
        }
    }

    updateReloadingDataDetail(event: any) {
        this.reloadingData = event.value;
    }

    createFormDetail() {
        this.formDetail = this.fb.group({
            name: [this.exportationDetail.name, Validators.required],
            fileName:   [this.exportationDetail.fileName, Validators.required],
            sql:        [this.exportationDetail.sql, null],
            separa:     [this.exportationDetail.separa, null],
            docHtml:    [this.exportationDetail.docHtml, null],
            tipos:      [this.exportationDetail.type, Validators.required]
        })
    }

    getExportationDetail(id: string) {
        this.isEdit = true;
        this.title = "Editar Detalle de Exportación";
        this.isLoading = true;
        this.exportationDetailService.get(id).subscribe(response => {
            this.exportationDetail = response.model;
            this.createFormDetail();
            this.onChangeDetailType();
            this.isLoading = false;
        },
        error => {
            this.isLoading = false;
            this.toastyMessageService.showErrorMessagge("Ocurrio un error");
        })
    }

    onSubmitDetail($event: any) {
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        let itemValue = this.itemValueDetail;
        const exportationDetail = Object.assign({}, this.exportationDetail, this.formDetail.value);
        exportationDetail.docHtml = this.exportationDetail.docHtml;
        if(itemValue == 0 && exportationDetail.number == null) {
            exportationDetail.number = 0;
            exportationDetail.expedientNumber = 0;
            this.exportationDetailService.add(exportationDetail).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Alta exitosa de detalle de exportación");
                this.isNew = false;
                this.isNewDetail = false;
                this.isNewEntry = false;
                this.exportationDetailService.exportationDetails[this.indexDetail].number = this.indexDetail;
                this.indexDetail = this.indexDetail + 1;
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrio un error al dar el alta");
                })
        } else {
            exportationDetail.number = 0;
            exportationDetail.expedientNumber = 0;
            this.exportationDetailService.update(itemValue, exportationDetail).subscribe(response => {
                this.arrayOfDetails = response.model;
                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                this.isNew = false;
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrio un error al editar los datos");
                })
        }
    }

    onCancelDetail(): void {
        this.openModalSubjectDetail.next();
    }

    onAgreeDetail() {
        if( this.exportationDetailId != null ) {
            for(let i = 0; i < this.exportationDetailService.exportationDetails.length; i++) {
                if(this.exportationDetailId == this.exportationDetailService.exportationDetails[i].number) {
                    this.exportationDetailService.exportationDetails.splice(i,1);
                    this.indexDetail = this.indexDetail-1; 
                    this.toastyMessageService.showSuccessMessagge("Se elimino correctamente");        
                }
            }
            
        } else {
            this.toastyMessageService.showErrorMessagge("Ocurrio un error inesperado");
        }
        this.isNew = false;
        this.isNewDetail = false;
        this.isNewEntry = false;
    }

    // fin de logica de formulario de detalle de exportacion 
    
    
    // inicio de logica de formulario de entrada de exportacion 
    
    loadEntryTypes() {
        this.exportationEntryService.getEntryTypes().subscribe(response => {
            this.types = response;
        }, error => {
            this.toastyMessageService.showErrorMessagge("Ocurrio un error al traer los datos");
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

    onActionClickEntry(event: any) {
        switch (event.action) {
            case 'new':
                this.itemValueEntry = 0;
                this.titleEntry = "Nueva Entrada de Exportación";    
                this.exportationEntry = new ExportationEntry();
                this.exportationEntryService.isNewEntry = true;
                this.isNewEntry = true;
                this.createFormEntry();
                this.isNew = true;
                break;
            case 'edit':
                this.itemValueEntry = parseInt(`${event.item.number}`);
                this.isLoading = true;
                this.exportationEntry = new ExportationEntry();
                this.titleEntry = "Editar Entrada de Exportación";
                this.exportationEntryService.isNewEntry = true;
                for(let i = 0;i < this.exportationEntryService.exportationEntries.length;i++) {
                    if(this.itemValueEntry == this.exportationEntryService.exportationEntries[i].number) {
                        this.exportationEntry.name = this.exportationEntryService.exportationEntries[i].name;
                        this.exportationEntry.key = this.exportationEntryService.exportationEntries[i].key;
                        this.exportationEntry.type = this.exportationEntryService.exportationEntries[i].type;
                        this.exportationEntry.fieldFo = this.exportationEntryService.exportationEntries[i].fieldFo;
                        this.exportationEntry.tableFo = this.exportationEntryService.exportationEntries[i].tableFo;
                        this.exportationEntry.number = this.exportationEntryService.exportationEntries[i].number;
                    }
                }
                this.isLoading = false;
                this.createFormEntry();
                this.isNewEntry = true;
                break;
            case 'delete':
                this.exportationEntryNumber = event.item.number;
                if (this.exportationEntryNumber) this.deleteModalSubjectEntry.next();
                break;
            default:
                break;
        }
    }

    updateReloadingDataEntry(event: any) {
        this.reloadingData = event.value;
    }

    createFormEntry() {
        this.formEntry = this.fb.group({
            name:        [this.exportationEntry.name, Validators.required],
            key:         [this.exportationEntry.key, null],
            tableFo:     [this.exportationEntry.tableFo, null],
            fieldFo:     [this.exportationEntry.fieldFo, null],
            types:       [this.exportationEntry.type, Validators.required]
        })
    }

    getExportationEntry(id: string) {
        this.isEdit = true;
        this.titleEntry = "Editar Entrada de Exportación";
        this.isLoading = true;
        this.exportationEntryService.get(id).subscribe(response => {
            this.exportationEntry = response.model;
            if(this.exportationEntry.type != null && this.exportationEntry.type == '50') {
                this.showItems = true;
            } else {
                this.showItems = false;
            }
            this.createFormEntry();
            this.isLoading = false;
        },
            error => {
                this.isLoading = false;
                this.toastyMessageService.showErrorMessagge("Ocurrió un error al cargar los datos");
            })
    }

    onSubmitEntry($event: any) {
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        let itemValue = this.itemValueEntry;
        const exportationEntry = Object.assign({}, this.exportationEntry, this.formEntry.value);
        if(itemValue == 0 && exportationEntry.number == null) {
            exportationEntry.number = 0;
            exportationEntry.expedientNumber = 0;
            this.exportationEntryService.add(exportationEntry).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Alta exitosa de detalle de exportación");
                this.isNew = false;
                this.isNewDetail = false;
                this.isNewEntry = false;
                this.exportationEntryService.exportationEntries[this.indexEntries].number = this.indexEntries;
                this.indexEntries = this.indexEntries + 1;
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrio un error al dar el alta");
                })
        } else {
            exportationEntry.number = 0;
            exportationEntry.expedientNumber = 0;
            this.exportationDetailService.update(itemValue, exportationEntry).subscribe(response => {
                this.arrayOfEntries = response.model;
                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                this.isNew = false;
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrio un error al editar los datos");
                })
        }
    }

    onCancelEntry(): void {
        this.openModalSubjectEntry.next();
    }

    onAgreeEntry() {
        if( this.exportationEntryNumber != null ) {
            for(let i = 0; i < this.exportationEntryService.exportationEntries.length; i++) {
                if(this.exportationEntryNumber == this.exportationEntryService.exportationEntries[i].number) {
                    this.exportationEntryService.exportationEntries.splice(i,1);
                    this.indexEntries = this.indexEntries-1; 
                    this.toastyMessageService.showSuccessMessagge("Se elimino correctamente");        
                }
            }
            
        } else {
            this.toastyMessageService.showErrorMessagge("Ocurrio un error inesperado");
        }
        this.isNew = false;
        this.isNewDetail = false;
        this.isNewEntry = false;
    }

    // fin de logica de formulario de entrada de exportacion

    onSubmit($event: any) {
        this.exportation.exportationDetails = this.exportationDetailService.exportationDetails;
        this.exportation.exportEntries = this.exportationEntryService.exportationEntries;
        for(let i = 0; i < this.exportation.exportationDetails.length; i++) {
            this.exportation.exportationDetails[i].number = 0;
            this.exportation.exportationDetails[i].expedientNumber = 0;
        }
        
        for(let i = 0; i < this.exportation.exportEntries.length; i++) {
            this.exportation.exportEntries[i].number = 0;
            this.exportation.exportEntries[i].expedientNumber = 0;
        }

        const exportation = Object.assign({}, this.exportation, this.form.value);
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        if (!id) {
            this.exportationService.add(exportation).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Alta exitosa de exportación");
                this.utilityService.navigate("sistema/exportaciones");
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrió un error al dar el alta");
                })
        } else {
            let clone = this.activatedRoute.snapshot.paramMap.get('change');
            if (clone && (clone == "clone")) {
                this.exportationService.add(exportation).subscribe(response => {
                    this.indexDetail = 0;
                    this.indexEntries = 0;
                    this.toastyMessageService.showSuccessMessagge("Alta exitosa de contrato OS");
                    this.utilityService.navigate("sistema/exportaciones");
                },
                    error => {
                        this.toastyMessageService.showErrorMessagge("Ocurrió un error al dar el alta");
                    })
             }else{
                this.exportationService.update(id, exportation).subscribe(response => {
                    this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                    this.utilityService.navigate("sistema/exportaciones");
                    this.indexDetail = 0;
                    this.indexEntries = 0;
                },
                    error => {
                        this.toastyMessageService.showErrorMessagge("Ocurrió un error al editar los datos");
                    })
            }
            
        }
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this.utilityService.navigate("sistema/exportaciones");
    }

    onCancel() {
        this.isNew = false;
        this.isNewDetail = false;
        this.isNewEntry = false;
    }
}