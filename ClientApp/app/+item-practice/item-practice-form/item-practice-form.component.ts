import { HcTableService } from './../../+hc-table/hc-table.service';
import { HcTable } from './../../models/hc-table.model';
import { AssignedPracticeType } from './../../models/assigned-practice-type.model';
import { AssignedPracticeTypeService } from './../assigned-practice-type.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { Subject } from 'rxjs/Subject';
import { CommonService } from './../../+core/services/common.service';
import * as jquery from 'jquery';
import { ItemPractice } from '../../models/item-practice.model';
import { ItemPracticeService } from '../item-practice.service';
import { InputAutoComplete } from '../../+shared';
import { LoadingGlobalService } from '../../+core/services';

@Component({
  selector: 'app-item-practice-form',
  templateUrl: './item-practice-form.component.html',
  styleUrls: ['./item-practice-form.component.scss']
})

export class ItemPracticeFormComponent implements OnInit {

  title: string = "Nuevo Item de Practica Medica";
  titlePractice: string = "";
  itemPractice: ItemPractice = new ItemPractice();
  assignedPracticeType: AssignedPracticeType = new AssignedPracticeType();
  ArrayOfPractices: Array<AssignedPracticeType> = new Array<AssignedPracticeType>();
  types: Array<any> = new Array<any>();
  hcTables: Array<HcTable> = new Array<HcTable>();
  auxListHcTable: Array<any> = new Array<any>();
  position: number = 0;
  form: FormGroup;
  formPractice: FormGroup;
  isEdit: boolean = false;
  isLoading: boolean = false;
  isNew: boolean = false;
  obras: Array<any>;
  openModalSubject: Subject<any> = new Subject();
  itemValue: number = 0;
  practicesInos: Array<any>;
  itemPracticeId: number = 0;
  deleteModalSubject: Subject<any> = new Subject();
  reloadingData: boolean = false;
  auxListMedicalEnsurance: Array<any> = new Array<any>();
  isLoadingMedicalEnsurance: boolean = false;
  nameMedicalEnsurance: string = "";
  assignedPracticeId = 0;
  isSaving = true;
  public auxListPracticeTypes: Array<any> = new Array<any>();
  public namePracticeType: string = '';
  public isLoadedPracticeType: boolean = false;
  public practiceTypes: Array<any>;
  public assignedPracticeSelected: any;
  public showEmptyMsg: boolean = true;
  
  columns = [
    { header: "Tipo de Practica", property: "practiceType.name" }
  ]

  paginator = {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0
  }

  @ViewChild('tableIAC') tableIAC: InputAutoComplete;

  constructor(
    public toastyMessageService: ToastyMessageService,
    public utilityService: UtilityService,
    public commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private fbp: FormBuilder,
    private router: Router,
    public itemPracticeService: ItemPracticeService,
    public assignedPracticeTypeService: AssignedPracticeTypeService,
    public hcTablesService: HcTableService,
    private loadingGlobalService: LoadingGlobalService
  ) { }

  addPracticeType() {
    const assignedPractice = this.itemPractice.assignedPractices.find(x => x.practiceTypeNumber == this.assignedPracticeSelected.number);
    if (!assignedPractice) {
      this.assignedPracticeType.itemPracticeNumber = this.itemPractice.numint;
      this.assignedPracticeType.practiceTypeNumber = this.assignedPracticeSelected.number;

      this.assignedPracticeTypeService.insert(this.assignedPracticeType).subscribe(
        response => {
              this.toastyMessageService.showSuccessMessagge("Tipo de Practica asignada");
              this.reloadingData = true;
              this.namePracticeType = "";
        },
      error => {
          var message = error.success = true && error.didError ? error.errorMessage : error.message;
          this.toastyMessageService.showErrorMessagge(message);
      });      
    }
    else
    {
      this.toastyMessageService.showErrorMessagge('La practica ya fue asignada, eliga otra practica');
      this.resetPracticeType();
    }
  }
    
  onActionClick(event: any) {
    switch (event.action) {
      case 'delete':
        this.assignedPracticeId = event.item.practiceTypeNumber;
        this.itemPracticeId = this.itemPractice.numint ? this.itemPractice.numint : 0;
        if (this.assignedPracticeId) this.deleteModalSubject.next();
        break;
      default:
        break;
    }
  }

  updateReloadingData(event: any) {
    this.reloadingData = event.value;
  }

  ngOnInit() {
    this.loadForm();
    this.loadPracticeTypes();
    this.loadTypes();
  }

  createForm() {
    this.form = this.fb.group({
        name: [this.itemPractice.name, Validators.required],
        table: [this.itemPractice.table],
        type: [this.itemPractice.type, Validators.required],
        description: [this.itemPractice.description, null],
        default: [this.itemPractice.bydefault, null],
        option: [this.itemPractice.option, null],
        order: [this.itemPractice.order, Validators.required]
    })
  }

  customCallbackPracticeType(event: any) {
    if (event != null) {
        this.namePracticeType = event;
        this.isLoadedPracticeType = true;
        let a = this.practiceTypes.find((e: any) => e.name.toLowerCase() == event.toLowerCase());
        if (a) {
            this.assignedPracticeSelected = a;
            this.namePracticeType = a.name;
            this.isLoadedPracticeType = true;
        }
    }
  }

  resetPracticeType() {
    this.namePracticeType = "";
    this.assignedPracticeSelected = null;
    this.isLoadedPracticeType = false;
  }

  loadForm() {
    this.assignedPracticeTypeService.itemPracticeNumber = 0;
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
        this.assignedPracticeTypeService.itemPracticeNumber = parseInt(id);
        this.getItemPractice(id);
    } else this.createForm()
  }

  loadPracticeTypes() {
    this.commonService.getPracticeType().subscribe(
        response => {
            this.practiceTypes = response.model || [];
            this.auxListPracticeTypes = this.practiceTypes.map(e => e.name );
        },
        error => this.toastyMessageService.showErrorMessagge("No se pudo obtener los tipos de practicas")
    );
  }

  loadTypes() {
    this.types = [
      { id: 1, name: 'string' },
      { id: 2, name: 'memo' },
      { id: 3, name: 'decimal' },
      { id: 4, name: 'integer' },
      { id: 5, name: 'date' },
      { id: 6, name: 'time' },      
      { id: 7, name: 'tabla' }
    ]
  }

  loadHcTables() {
    this.hcTablesService.getCombo().subscribe(response => {
        this.auxListHcTable = response.model;
        this.resetTableCombo(this.auxListHcTable);
    }, error => {
        this.toastyMessageService.showErrorMessagge();
      })
  }

  loadHcTablesEdit() {
    this.hcTablesService.getCombo().subscribe(response => {
        this.auxListHcTable = response.model;
        this.createForm();
    }, error => {
        this.toastyMessageService.showErrorMessagge();
      })
  }

  getItemPractice(id: any) {
    this.isEdit = true;
    this.title = "Editar Item de Practica Medica";
    this.isLoading = true;
    this.itemPracticeService.get(id).finally(() => this.isLoading = false).subscribe(response => {
        this.itemPractice = response.model;
        if(this.itemPractice.type == 7) {
          this.loadHcTablesEdit();
        } else {
          this.createForm();
        }

    }, error => {
        this.toastyMessageService.showErrorMessagge();
    })
  }

  createFormPractice() {
    this.formPractice = this.fbp.group({
      practiceTypeNumber: [this.assignedPracticeType.practiceTypeNumber, Validators.required],
      practiceTypeName: [this.assignedPracticeType.practiceTypeName, null]
    })
  }

  onCancelButton(): void {
    this.openModalSubject.next();
  }

  onAgree() {
      this.utilityService.navigate("archivos/practicasItems");
  }

  onCancel() {
      this.isNew = false;
  }

  onChangeType(type: any) {
    if (type && type == 7) {
        this.loadHcTables();
    } else {
      this.auxListHcTable = [];
      this.itemPractice.table = undefined;
    }
  }

  onChangeHcTable() {
  }

  onDeleteConfirm() {
    this.loadingGlobalService.showLoading('Eliminando Item de Practica...');
    this.assignedPracticeTypeService.delete(this.itemPracticeId, this.assignedPracticeId)
      .finally(() => this.loadingGlobalService.hideLoading())
      .subscribe((resp: any) => {
        this.toastyMessageService.showMessageToast("Exito", "Se elimino correctamente", "success");
        this.reloadingData = true;
      },
      (error: any) => {
        this.toastyMessageService.showErrorMessagge();
      });
  }

  onSubmit($event: any) {
    this.isSaving = true;
    const itemPractice = Object.assign({}, this.itemPractice, this.form.value);
    itemPractice.option = this.form.value.option ? 1 : 0;
    this.itemPracticeService.save(itemPractice)
    .finally(() => { this.isSaving = false; }).subscribe(
      response => {
        this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
        this.utilityService.navigate("archivos/practicasItems");
      },
      error => {
          this.toastyMessageService.showErrorMessagge("Ocurrió un error al dar el alta");
      });
  }

  private resetTableCombo(source: Array<any>) {
    this.tableIAC.updateSource(source);
    this.tableIAC.updateValue(null);
  }
}