import { HcEvolutionSchemeService } from './../../+hc-evolution-pharmacy/hc-evolution-scheme.service';
import { PharmacyScheme } from './../../models/pharmacy-scheme.model';
import { ClinicItem } from './../../models/clinic-item.model';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastyMessageService, UtilityService, CommonService } from '../../+core/services';

import * as moment from 'moment';
import { ItemCombo } from '../../+shared/util';
import { Observable, Subject } from 'rxjs';
import { PatientService } from '../../+patient/patient.service';
import { Patient } from '../../models/patient.model';
import { DiagnosticMovement } from '../../models/diagnostic-movement.model';
import { ItemPractice } from '../../models/item-practice.model';
import { FormControlService } from '../../+shared/forms/form-control.service';
import { AssignedPracticeTypeService } from '../../+item-practice/assigned-practice-type.service';

import { GenericControl, ControlType } from '../../+shared/forms/controls';
import { ControlOptions } from '../../+dynamic-view-v2/util';
import { PracticeInosService } from '../../+practice-inos/practice-inos.service';
import { ClinicTable } from '../../models/clinic-table.model';
import { HcEvolution } from '../../models/hc-evolution.model';
import { HcEvolutionService } from '../hc-evolution.service';
import { InputAutoComplete } from '../../+shared';
import { ClinicHistoryPharmacySchemeService } from '../../+clinic-history/pharmacy-scheme';


@Component({
  selector: 'hc-evolution-form',
  templateUrl: './hc-evolution-form.component.html',
  styleUrls: ['./hc-evolution-form.component.scss']
})
export class HcEvolutionFormComponent implements OnInit {

    // variables for CH form
    idCH: any = 0;
    hcEvolution: HcEvolution = new HcEvolution();
    isLoading = false;
    isSaving = false;
    form: FormGroup;
    // sourceSpecialties = new Array<ItemCombo>();
    medicalInsurances = new Array<ItemCombo>();
    loadingMInsuranceIAC = false;
    loadingSpecialtyIAC = false;
    practices = new Array<ItemCombo>();
    practiceType: number;
    loadingPracticeIAC = false;
    professionals: Array<ItemCombo>;
    specialties = new Array<ItemCombo>();;
    loadingProfessionalIAC = false;

    patient = new Patient();
    openModalDiscardSubject = new Subject();
    deleteModalSchemeSubject = new Subject();
    readonlyCH: boolean;

    // variables for tabs
    activeTab = 'items';
    showItems = false;
    showMsgItemsNotFound = false;
    formForItems: FormGroup;
    items = new Array<ItemPractice>();
    controlsForItems = new Array<GenericControl>();
    editPharmacySchemeItem = false;
    reloadingDataScheme: boolean = false;
    chSchemeId: string;
    newPharmacySchemeItems: boolean = false;

    // @Input() idCH: number;
    @Input() isNewEvolution: boolean = true;
    @Input() patientMovementId: number;
    @Input() hcEvolutionId: number;
    @Input() readonly: boolean = false;
    @Output() onActionEdit: EventEmitter<any> = new EventEmitter<any>();
    @Output() closeClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        public activatedRoute: ActivatedRoute,
        public hcEvolutionService: HcEvolutionService,
        public patientService: PatientService,
        public controlService: FormControlService,
        private assignedPracticeTypeService: AssignedPracticeTypeService,
        private practiceInosService: PracticeInosService,
        public pharmacySchemeService: ClinicHistoryPharmacySchemeService
    ) {
        this.pharmacySchemeService.resetService();
    }

    ngOnInit() {
        this.readonlyCH = this.hcEvolutionService.readonly;
        this.formForItems = this.controlService.toFormGroup(this.controlsForItems);
        this.getProfessionals(this.hcEvolutionService.medicalInsuranceId);
        this.loadForm();
    }

    private loadForm() {
        if (this.isNewEvolution) {
            this.pharmacySchemeService.setSchemesList();
            this.createForm();
        }
        else this.getHcEvolution();
    }

    private createForm() {
        this.form = this.fb.group({
            specialtyId: [this.hcEvolution.specialtyId, Validators.required],
            professionalId: [this.hcEvolution.professionalId, Validators.required],
            date: [this.hcEvolution.date, null],
            practiceId: [this.hcEvolution.practiceId, Validators.required],
        });
    }

    getHcEvolution() {
        if (this.hcEvolutionId) {
            this.hcEvolutionService.get(this.hcEvolutionId).subscribe(response => {
                this.hcEvolution = response.model;
                this.pharmacySchemeService.setSchemesList(this.hcEvolution.pharmacySchemes);
                this.loadPracticeItems(this.hcEvolution.practiceId);
                this.createForm();
                this.getPractices(this.hcEvolution.professionalId);
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos de la evolucion');
            });
        } else {
            this.hcEvolution = this.hcEvolutionService.hcEvolution;
            this.pharmacySchemeService.setSchemesList(this.hcEvolution.pharmacySchemes);
            this.loadPracticeItems(this.hcEvolution.practiceId);
            this.createForm();
            this.getPractices(this.hcEvolution.professionalId);
        }
    }

    private getSpecialties() {
        this.loadingSpecialtyIAC = true;
        this.commonService.getSpecialtiesByProfessional(this.form.value.professionalId)
        .finally(() => this.loadingSpecialtyIAC = false)
        .subscribe(
            response => {
                this.specialties = response.model;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de especialidades');
            });
    }

    private getPractices(professionalId: number) {
        this.loadingPracticeIAC = true;
        // this.commonService.getInosPracticesByProfessional(professionalId)
        this.commonService.getInosPracticesByProfessionalOs(professionalId, this.hcEvolutionService.medicalInsuranceId)
            .finally(() => this.loadingPracticeIAC = false)
            .subscribe(
            response => {
                this.practices = response.model;
                this.form.controls['practiceId'].setValue(this.hcEvolution.practiceId);
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Prácticas');
            });
    }

    private getProfessionals(medicalInsuranceId: number) {
        this.loadingProfessionalIAC = true;
        this.commonService.getProfessionals(medicalInsuranceId)
            .finally(() => this.loadingProfessionalIAC = false)
            .subscribe(
                response => {
                    this.professionals = response.model;
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Profesionales');
                });
    }

    onChangeProfessional() {
        this.resetItems();
        this.getSpecialties();
        this.getPractices(this.form.value.professionalId);
    }

    private resetItems(){
        this.showItems = false;
        this.controlsForItems = new Array<GenericControl>();
        this.formForItems = this.controlService.toFormGroup(this.controlsForItems);
    }

    loadPracticeItems(practiceId: number) 
    {
        if (practiceId) {
            this.practiceInosService.get(practiceId).subscribe(
                response => {
                    this.practiceType = response.model.practiceTypeNumber;
                    this.getAllAssignedPractice();
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Error al cargar items');
                });
        } else this.showItems = false;
    }

    onChangePractice() {
        let practiceId = this.form && this.form.value.practiceId;
        if (practiceId) {
            this.practiceInosService.get(practiceId).subscribe(
                response => {
                    this.practiceType = response.model.practiceTypeNumber;
                    this.getAllAssignedPractice();
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Error al cargar items');
                });
        } else this.showItems = false;
    }    

    private getAllAssignedPractice() {
        this.assignedPracticeTypeService.getAllItems(this.practiceType).subscribe(
            response => {
                this.items = response.model;
                this.setInputControls(this.items);
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar items');
            });
    }

    private setInputControls(items: any[]) {
        const totalItems = this.items.length;
        this.controlsForItems = new Array<GenericControl>();
        if (totalItems != 0) {
            for (let item of this.items) {
                const control = this.getOptions(item);
                this.controlsForItems.push(control);
            }
            this.formForItems = this.controlService.toFormGroup(this.controlsForItems);
            if (!this.isNewEvolution) {
                this.setDataControls(this.formForItems);
            }
            this.showItems = true;
        } else {
            this.formForItems = this.controlService.toFormGroup(this.controlsForItems);
            this.showItems = false;
            this.showMsgItemsNotFound = true;
        }
    }

    private setDataControls(formForItems: FormGroup) {
        this.items.forEach((e: ItemPractice) => {
            if (e.table) {
                let hcTable = this.hcEvolution.hcTables.find(x => x.itemId == e.numint);
                if (hcTable) {
                  this.formForItems.controls[e.name].setValue(hcTable.tableId);
                }
            } else {
                let hcItem = this.hcEvolution.hcItems.find(x => x.itemId == e.numint);
                if (hcItem) {
                  this.formForItems.controls[e.name].setValue(hcItem.value);
                }
            }
        });
    }

    private getOptions(item: ItemPractice): GenericControl {
        let controlOptions: GenericControl = new GenericControl();
        controlOptions.key = item.name;
        controlOptions.label = item.name;
        controlOptions.value = item.bydefault;
        controlOptions.order = item.numint;
        controlOptions.type = this.getType(item.type);
        controlOptions.class = controlOptions.type === 'memo' ? 'col s12 m12' : 'col s12 m4';
        controlOptions.required = item.option;
        if (item.table) controlOptions.functionForData = this.commonService.getHcTableItems(item.table);

        if (controlOptions.type === 'date' && !controlOptions.datePickerOptions) {
            controlOptions.datePickerOptions = this.utilityService.getDatePickerOptions();
            controlOptions.datePickerOptions.max = false;
        }

        if (controlOptions.type === 'time' && !controlOptions.timePickerOptions)
            controlOptions.timePickerOptions = this.utilityService.getTimePickerOptions();

        return controlOptions;
    }

    private getType(type: number) {
        let controlType: ControlType;
        switch (type) {
          case 1:
              controlType = 'text';
              break;
          case 2:
              controlType = 'memo';
              break;
          case 3 || 4:
              controlType = 'number';
              break;
          case 5:
              controlType = 'date';
              break;
          case 6:
              controlType = 'time';
              break;
          case 7:
              controlType = 'autocomplete';
              break;
          default:
              controlType = 'text';
              break;
        }
        return controlType;
    }

    save() {
        this.isSaving = true;
        let hcEvolution = Object.assign(this.hcEvolution, this.form.value);
        if (this.isNewEvolution) this.setEvolutionHc(hcEvolution);
        else this.setEvolutionHcEdit(hcEvolution);

        hcEvolution.pharmacySchemes = this.pharmacySchemeService.medicineSchemesList;
        hcEvolution.professionalName = this.getProfessionalName(hcEvolution.professionalId);
        hcEvolution.practiceName = this.getPracticeName(hcEvolution.practiceId);
        hcEvolution.specialtyName = this.getSpecialtyName(hcEvolution.specialtyId);

        const result = this.hcEvolutionService.save(hcEvolution);
        if (result) {
            this.toastyMessageService.showSuccessMessagge(`La evolucion ha sido ${this.isNewEvolution ? "agregada" : "modificada"}`);
        } else {
            this.toastyMessageService.showErrorMessagge(`Error al cargar evolucion`);
        }
        this.closeClick.emit();
    }

    private getProfessionalName(professionalId: number) {
        const professional = this.professionals.find((d: any) => d.number == professionalId);
        return !professional ? '' : professional.name;
    }

    private getPracticeName(practiceId: number) {
        const professional = this.practices.find((d: any) => d.number == practiceId);
        return !professional ? '' : professional.name;
    }

    private getSpecialtyName(specialtyId: number) {
        const specialty = this.specialties.find((d: any) => d.number == specialtyId);
        return !specialty ? '' : specialty.name;
    }

    setEvolutionHcEdit(hcEvolution: HcEvolution) {
        let hcItems = new Array<ClinicItem>();
        let hcTables = new Array<ClinicTable>();
        this.items.forEach((e: ItemPractice) => {
            if (e.table) {
                let hcTable = this.hcEvolution.hcTables.find(x => x.itemId == e.numint);
                if (hcTable) {
                    hcTable.tableId = this.formForItems.value[e.name];
                    hcTables.push(hcTable);
                } else {
                    let hcTable = new ClinicTable();
                    hcTable.id = e.numint;
                    hcTable.hcId = hcEvolution.id;
                    hcTable.tableId = this.formForItems.value[e.name];
                }
            } else {
                let hcItem = this.hcEvolution.hcItems.find(x => x.itemId == e.numint);
                if (hcItem) {
                    hcItem.itemId = e.numint;
                    hcItem.value = this.formForItems.value[e.name];
                    hcItems.push(hcItem);
                } else {
                    let hcItem = new ClinicItem();
                    hcItem.itemId = e.numint;
                    hcItem.value = this.formForItems.value[e.name];
                    hcItem.hcId = hcEvolution.id;
                    hcItems.push(hcItem);
                }
            }
        });
        hcEvolution.hcItems = hcItems;
        hcEvolution.hcTables = hcTables;
    }

    setEvolutionHc(hcEvolution: HcEvolution) {
        let hcItems = new Array<ClinicItem>();
        let hcTables = new Array<ClinicTable>();

        this.items.forEach(e => {
            if (e.table && this.formForItems.value[e.name]) {
                let hcTable = new ClinicTable();
                hcTable.itemId = e.numint;
                hcTable.tableId = this.formForItems.value[e.name];
                hcTables.push(hcTable);
            } else if (!e.table && this.formForItems.value[e.name]){
                let hcItem = new ClinicItem();
                hcItem.itemId = e.numint;
                hcItem.value = this.formForItems.value[e.name];
                hcItems.push(hcItem);
            }
        });
        hcEvolution.date = moment().format();  // 2018-06-11T15:11:54-03:00
        // hcEvolution.date = moment().format('DD/MM/YYYY');
        hcEvolution.hcItems = hcItems;
        hcEvolution.hcTables = hcTables;
    }

    onCancelButtonOfCH(): void {
        this.openModalDiscardSubject.next();
    }

    /******************************* Esquema de medicacion ****************************/
    onActionScheme(event: any) {
        switch (event.action) {
        case 'new':
            this.newPharmacySchemeItems = true;
            this.pharmacySchemeService.isNew = true;
            break;
        case 'edit':
            this.newPharmacySchemeItems = true;
            this.pharmacySchemeService.isNew = false;
            this.pharmacySchemeService.medicineScheme = event.item;
            this.pharmacySchemeService.index = event.index;
            break;
        case 'detail':
            break;
        default:
            break;
        }
    }

    closeScheme() {
        this.editPharmacySchemeItem = false;
    }

    closeViewNewItems() {
        this.newPharmacySchemeItems = false;
    }

    changeActiveTab(tab: string) {
        this.activeTab = tab;
    }

    discardChanges() {
        //this.utilityService.navigate('historiaclinica/listado');
        this.closeClick.emit();
    }

    deleteScheme() {
        const result = this.pharmacySchemeService.delete(this.chSchemeId);
        let message: string;
        if (result) {
            message = 'Se elimino el esquema correctamente';
            this.chSchemeId = '';
            this.reloadingDataScheme = true;
        } else message = 'No se pudo eliminar el esquema';
        this.toastyMessageService.showSuccessMessagge(message);
    }

    updateReloadingDataScheme(event: any) {
        this.reloadingDataScheme = event.value;
    }
}
