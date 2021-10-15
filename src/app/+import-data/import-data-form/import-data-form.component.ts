import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ImportData } from '../../models/import-data.model';
import { ImportDataService } from '../import-data.service';
import { ToastyMessageService, UtilityService } from '../../+core/services';
import { Subject, Observable, Subscription } from 'rxjs';
import { ImportFieldService } from '../import-field.service';
import { DynamicTableComponent } from '../../+shared';

@Component({
    selector: 'app-import-data-form',
    templateUrl: './import-data-form.component.html',
    styleUrls: ['./import-data-form.component.scss']
})
export class ImportDataFormComponent implements OnInit {

    /*   excel: Blob;
        fileLoad: {
            name: string,
            size: number
        } */

    // data: Array<any> = new Array<any>();
    public form: FormGroup;
    importData = new ImportData();
    // public tableName: string;
    id: number;
    isEdit: boolean;
    isNew = false;
    isLoading = false;
    // reloadingData = false;
    openModalSubject: Subject<any> = new Subject();
    deleteModalSubject: Subject<any> = new Subject();
    sourceTables: Observable<any> = this.importDataService.getTablesList();
    //@ViewChild(DynamicTableComponent) dynamicTableComponent: DynamicTableComponent;
    constructor(
        public importDataService: ImportDataService,
        public importFieldService: ImportFieldService,
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _toastyService: ToastyMessageService,
        private _utilityService: UtilityService,
        private fb: FormBuilder
    ) {
        this.id = +(this._activatedRoute.snapshot.paramMap.get('id') || 0);
        this.importFieldService.tableName = this._activatedRoute.snapshot.paramMap.get('table')||'';
        this.isEdit = !!this.id;
    }

    ngOnInit() {
        this.loadForm();
    }

    createForm() {
        this.form = this.fb.group({
            table: [this.importData.table]
        });
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onConfirmClose() {
        this.importData = new ImportData();
        this.importFieldService.fields = [];
        this._utilityService.navigate("sistema/importData");
    }

    onSaveImport() {
        //Object.assign(this.importData, this.form.value);
        if(!this.isEdit){
            this.importData.importFields = this.importFieldService.fields.filter(x=>x.valid==true);
        }else{
            this.importData.importFields = this.importFieldService.fields;
        }
        var result = !!this.id ? this.importDataService.update(this.id, this.importData) : this.importDataService.add(this.importData);
        result.subscribe(() => {
            this._toastyService.showSuccessMessagge("Se importo los datos correctamente");
            this.importData = new ImportData();
            this.importFieldService.fields = [];
            this._utilityService.navigate("sistema/importData");
        },
            () => {
                this._toastyService.showErrorMessagge("Ocurrio un error al guardar los datos");
            });
    }

    getImportation(id: number) {
        this.isLoading = true;
        this.importFieldService.getByTable(this.importFieldService.tableName)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.importData.id = id;
                this.importData.table = this.importFieldService.tableName;
                this.importFieldService.fields = response.model;
                this.importFieldService.fields.forEach(element => {
                    element.importId = id;
                });
                this.createForm();
                // this.importFieldService.importId = this.importData.id;
                // this.importFieldService.tableName = this.importData.table;
            },
            () =>this._toastyService.showErrorMessagge())
    }

    loadForm() {
        if (this.isEdit) {
            this.getImportation(this.id);
        } else {
            this.createForm();
        }
    }

    // onActionClick(event: any) {
    //     switch (event.action) {
    //         case 'new':
    //             if(this.importFieldService.tableName)
    //                 this._router.navigate([`sistema/importData/formulario/${this.importFieldService.importId}/field`])
    //             break;
    //         /*  case 'edit':
    //                  this._router.navigate([`sistema/importData/formulario/${this.importFieldService.importId}/field/${event.item.id}`])
    //                  break; */
    //         // case 'delete':
    //         //     this.id = event.item.id?event.item.id:event.item.name;
    //         //     if (this.id) this.deleteModalSubject.next();
    //         //     break;
    //         default:
    //             break;
    //     }
    // }

    // onDeleteConfirm() {
    //     this.importFieldService.localDelete(this.id).subscribe(
    //         () => {
    //             this.id = 0;
    //             //this.dynamicTableComponent.updateTable();
    //             this._toastyService.showSuccessMessagge("Se elimino correctamente");
    //         },
    //         () => {
    //             this._toastyService.showErrorMessagge("Ocurrio un error inesperado");
    //         });
    // }
    selectedClick(item: any){
        item.valid = !item.valid;
    }

    onChangeTableList(item: any) {
        this.importData.table = item.name;
        this.isLoading = true;
        if (item.name == null) {
            this.importData = new ImportData();
            this.isLoading = false;
        } else {
            this.importFieldService.getByTable(item.name).subscribe(
                resp => {
                    this.importFieldService.fields = resp.model;
                },
                () => {
                    this._toastyService.showErrorMessagge("Ocurrio un error inesperado");
                },
                () => {
                    this.isLoading = false;
                });
        }
    }
}
