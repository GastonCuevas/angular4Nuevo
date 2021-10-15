import { Component, OnInit } from '@angular/core';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { CommonService } from '../../+core/services/common.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HcTableService } from '../hc-table.service';
import { HcTableItemService } from '../hc-table-item.service';
import { HcTable } from '../../models/hc-table.model';
import { HcTableItem } from '../../models/hc-table-item.model';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-hc-table-form',
    templateUrl: './hc-table-form.component.html',
    styleUrls: ['./hc-table-form.component.scss']
})
export class HcTableFormComponent implements OnInit {

    title: string = "Nueva Tabla de Historia Clinica";
    titlePractice: string = "";
    hcTable: HcTable = new HcTable();
    hcTableItem: HcTableItem = new HcTableItem();
    hcTableItems: Array<HcTableItem> = new Array<HcTableItem>();
    position: number = 0;
    form: FormGroup;
    formItems: FormGroup;
    isEdit: boolean = false;
    isLoading: boolean = false;
    isNew: boolean = false;
    openModalSubject: Subject<any> = new Subject();
    itemValue: number = 0;
    tableHcId: 0;
    deleteModalSubject: Subject<any> = new Subject();
    reloadingData: boolean = false;
    hcTableItemId = 0;

    columns = [
        { header: "Nombre", property: "name" }
    ]

    paginator = {
        currentPage: 1,
        pageSize: 10,
        totalItems: 0
    }

    constructor(
        public toastyMessageService: ToastyMessageService,
        public utilityService: UtilityService,
        public commonService: CommonService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private fbp: FormBuilder,
        private router: Router,
        public hcTableService: HcTableService,
        public hcTableItemService: HcTableItemService
    ) { }

    ngOnInit() {
        this.loadForm();
    }



    onActionClick(event: any) {
        switch (event.action) {
            case 'new':
                this.router.navigate([`archivos/tablasHc/formulario/${this.hcTable.number}/item`])
                break;
            case 'edit':
                this.router.navigate([`archivos/tablasHc/formulario/${this.hcTable.number}/item/${event.item.numInt}`])
                break;
            case 'delete':
                this.hcTableItemId = event.item.numInt;
                if (this.hcTableItemId) this.deleteModalSubject.next();
                break;
            default:
                break;
        }
    }

    updateReloadingData(event: any) {
        this.reloadingData = event.value;
    }

    createForm() {
        this.form = this.fb.group({
            name: [this.hcTable.name, null],
            description: [this.hcTable.description, null]
        })
    }

    loadForm() {
        this.hcTableItemService.hcTableNumber = 0;
        const id = this.activatedRoute.snapshot.paramMap.get('id');
        if (id) {
            this.hcTableItemService.hcTableNumber = parseInt(id);
            this.getTableHc(id);
        } else this.createForm()
    }

    getTableHc(id: any) {
        this.isEdit = true;
        this.title = "Editar Tabla de Historia Clinica";
        this.isLoading = true;
        this.hcTableService.get(id).finally(() => this.isLoading = false).subscribe(response => {
            this.hcTable = response.model;
            this.createForm();
        }, error => {
            this.toastyMessageService.showErrorMessagge();
        })
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this.utilityService.navigate("archivos/tablasHc");
    }

    onCancel() {
        this.isNew = false;
    }

    onDeleteConfirm() {
        this.hcTableItemService.delete(this.hcTableItemId)
            .subscribe((resp: any) => {
                this.toastyMessageService.showMessageToast("Exito", "Se elimino correctamente", "success");
                this.reloadingData = true;
            },
            (error: any) => {
                this.toastyMessageService.showErrorMessagge();
            });
    }

    onSubmit($event: any) {
        let id = this.activatedRoute.snapshot.paramMap.get('id');
        const hcTable = Object.assign({}, this.hcTable, this.form.value);
        if (!id) {
            this.hcTableService.add(hcTable).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Alta exitosa de tabla de historia clinica");
                this.utilityService.navigate("archivos/tablasHc");
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrió un error al dar el alta");
                })
        } else {
            this.hcTableService.update(id, hcTable).subscribe(response => {
                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
                this.utilityService.navigate("archivos/tablasHc");
            },
                error => {
                    this.toastyMessageService.showErrorMessagge("Ocurrió un error al dar el alta");
                })
        }
    }

}
