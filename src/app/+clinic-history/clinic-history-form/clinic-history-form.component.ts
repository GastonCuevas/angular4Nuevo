import { ClinicItem } from './../../models/clinic-item.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastyMessageService, UtilityService, CommonService } from '../../+core/services';

import { ClinicHistory } from '../../models/clinic-history.model';
import { ClinicHistoryService } from '../clinic-history.service';
import * as moment from 'moment';
import { ItemCombo } from '../../+shared/util';
import { Observable, Subject } from 'rxjs';
import { PatientService } from '../../+patient/patient.service';
import { Patient } from '../../models/patient.model';
import { DiagnosticMovementService } from '../diagnostic-movement';
import { DiagnosticMovement } from '../../models/diagnostic-movement.model';
import { ItemPractice } from '../../models/item-practice.model';
import { FormControlService } from '../../+shared/forms/form-control.service';
import { AssignedPracticeTypeService } from '../../+item-practice/assigned-practice-type.service';

import { GenericControl, ControlType } from '../../+shared/forms/controls';
import { PracticeInosService } from '../../+practice-inos/practice-inos.service';
import { ClinicTable } from '../../models/clinic-table.model';
import { ClinicHistoryPharmacySchemeService} from '../pharmacy-scheme';


@Component({
  selector: 'app-clinic-history-form',
  templateUrl: './clinic-history-form.component.html',
  styleUrls: ['./clinic-history-form.component.scss']
})
export class ClinicHistoryFormComponent implements OnInit, OnDestroy {

    // variables for CH form
    idCH: any = 0;
    patientMovementId: any = 0;
    clinicHistory: ClinicHistory = new ClinicHistory();
    isLoading = false;
    isNewCH = true;
    isSaving = false;
    form: FormGroup;
    specialties: Array<ItemCombo>;
    loadingSpecialtyIAC = false;

    medicalInsurances = new Array<ItemCombo>();
    loadingMInsuranceIAC = false;
    practices: Array<ItemCombo>;
    practiceType: number;
    loadingPracticeIAC = false;
  
    professionals: Array<ItemCombo>;
    loadingProfessionalIAC = false;

    patient = new Patient();
    openModalDiscardSubject = new Subject();
    readonlyCH: boolean;

    // variables for tabs
    activeTab = 'items';
    showItems = false;
    showMsgItemsNotFound = false;
    formForItems: FormGroup;
    items = new Array<ItemPractice>();
    controlsForItems = new Array<GenericControl>();
    isValidListDiagnostics = false;

    showPharmacySchemeEditForm = false;
    showPharmacySchemeNewForm: boolean = false;
    showDiagnosticForm = false;
    hcEvolution: ClinicHistory;

    constructor(
        private fb: FormBuilder,
        private commonService: CommonService,
        private utilityService: UtilityService,
        private toastyMessageService: ToastyMessageService,
        public activatedRoute: ActivatedRoute,
        public clinicHistoryService: ClinicHistoryService,
        public patientService: PatientService,
        public controlService: FormControlService,
        private assignedPracticeTypeService: AssignedPracticeTypeService,
        private practiceInosService: PracticeInosService,
        public pharmacySchemeService: ClinicHistoryPharmacySchemeService,
        public diagnosticMovementService: DiagnosticMovementService,
    ) {
        this.idCH = this.activatedRoute.snapshot.paramMap.get('id');
        this.patientMovementId = this.activatedRoute.snapshot.paramMap.get('patientMovementId');

        this.isNewCH = !this.idCH;
        this.diagnosticMovementService.resetService();
        this.pharmacySchemeService.resetService();
    }

    ngOnInit() {
        this.readonlyCH = this.clinicHistoryService.readonly;
        this.formForItems = this.controlService.toFormGroup(this.controlsForItems);
        this.loadForm();
        this.loadProfessionals();
    }

    ngOnDestroy() {
        this.diagnosticMovementService.resetService();
        this.pharmacySchemeService.resetService();
    }

    private loadForm() {
        if (!this.idCH && this.patientMovementId) {
            // this.createForm();
            this.pharmacySchemeService.setSchemesList();
            this.diagnosticMovementService.setDiagnosticList();
            this.getPatientMovement();            
        }
        else this.getClinicHistory();
    }

    private createForm() {
        this.form = this.fb.group({
            specialtyId: [this.clinicHistory.specialtyId, Validators.required], // deberia no ser requerido ver backend
            professionalId: [this.clinicHistory.professionalId, Validators.required],
            patientId: [this.clinicHistory.patientId, Validators.required],
            date: [this.clinicHistory.date, null],
            medicalInsuranceId: [this.clinicHistory.medicalInsuranceId, Validators.required],
            practiceId: [this.clinicHistory.practiceId, Validators.required],
        });
    }

    private getClinicHistory() {
        this.isLoading = true;
        this.clinicHistoryService.get(this.idCH)
            .finally(() => this.isLoading = false)
            .subscribe(
            response => {
                this.clinicHistory = response.model;
                this.pharmacySchemeService.setSchemesList(this.clinicHistory.pharmacySchemes);
                this.diagnosticMovementService.setDiagnosticList(this.clinicHistory.diagnostics);
                this.createForm();
                this.getPatient();
                this.onChangePractice();
                this.hcEvolution = this.clinicHistory;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al cargar los datos');
            });
    }

    private getPatient() {
        this.patientService.get(+this.form.value.patientId).subscribe(
            response => {
                this.patient = response.model;
                this.form.patchValue({
                    transplanted: this.patient.transplanted
                  });
            }, error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos del paciente');
            });
    }

    private getPatientMovement() {
        this.clinicHistoryService.getWithItems(this.patientMovementId).subscribe(
            response => {
                this.clinicHistory = response.model;
                //this.clinicHistory.specialtyId = undefined;
                
                this.createForm();
                this.onChangeMI();
                this.getPatient();
                this.onChangePractice();
                this.getPractices();
                this.getSpecialty();
            }, error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos del paciente');
            });
    }

    private loadProfessionals() {
        this.commonService.getProfessionals(this.clinicHistory.medicalInsuranceId).subscribe(
            response => {
                this.professionals = response.model;
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Profesionales');
            });
    }

    private getMedicalInsurances() {
        this.medicalInsurances = [];
        this.loadingMInsuranceIAC = true;
        this.commonService.getMedicalInsurancesByPatient(this.form.value.patientId)
            .finally(() => this.loadingMInsuranceIAC = false)
            .subscribe(
                response => {
                    this.medicalInsurances = response.model;
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de O.S.');
                });
    }

    private getPractices() {
        //this.practices = [];
        this.loadingPracticeIAC = true;
        this.commonService.getInosPracticesByProfessionalOs(this.form.value.professionalId,this.form.value.medicalInsuranceId)
            .finally(() => this.loadingPracticeIAC = false)
            .subscribe(
                response => {
                    this.practices = response.model;
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Prácticas');
                });
    }

    private getProfessionals() {
        this.loadingProfessionalIAC = true;
        this.commonService.getProfessionals(this.clinicHistory.medicalInsuranceId)
            .finally(() => this.loadingProfessionalIAC = false)
            .subscribe(
                response => {
                    this.professionals = response.model;
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Profesionales');
                });
    }

    private getSpecialty(){
        this.loadingSpecialtyIAC = true;
        this.commonService.getSpecialtiesByProfessional(this.form.value.professionalId)
            .finally(() => this.loadingSpecialtyIAC = false)
            .subscribe(
                response => {
                    this.specialties = response.model;
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Error al cargar el combo de Especialidades');
                });
    }

    onChangeSpecialty() {
        //this.getProfessionals();
    }

    onChangeMI() {
        this.resetItems();
        this.getProfessionals();
    }

    onChangeProfessional(){
        this.resetItems();
        this.getPractices();
        this.getSpecialty();
    }

    onChangePatient() {
        this.practices = [];
        this.getMedicalInsurances();
        if (this.form.value.patientId) this.getPatient();
        else {
            this.patient = new Patient();
            this.resetItems();
        }
    }

    private resetItems() {
        if (!this.form.value.medicalInsuranceId || !this.form.value.patientId || !this.form.value.practiceId)
            this.showMsgItemsNotFound = false;
        this.showItems = false;
        this.controlsForItems = new Array<GenericControl>();
        this.formForItems = this.controlService.toFormGroup(this.controlsForItems);
    }

    onChangePractice() {
        if (this.form.value.practiceId) {
            this.practiceInosService.get(this.form.value.practiceId).subscribe(
                response => {
                    this.practiceType = response.model.practiceTypeNumber;
                    this.getAllAssignedPractice();
                },
                error => {
                    this.toastyMessageService.showToastyError(error, 'Error al cargar items');
                });
        } else this.resetItems();
    }

    private getAllAssignedPractice() {
        this.assignedPracticeTypeService.getAllItems(this.practiceType).subscribe(
            response => {
                this.items = response.model;
                this.items.sort((x, y) => x.order - y.order);
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
            if (!this.isNewCH) {
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

        let clinicHistory = Object.assign(this.clinicHistory, this.form.value);
    
        if (this.isNewCH) this.setEvolutionHc(clinicHistory);
        else this.setEvolutionHcEdit(clinicHistory);
        //clinicHistory.pharmacySchemes = this.pharmacySchemeService.schemesList;
        clinicHistory.pharmacySchemes = this.pharmacySchemeService.medicineSchemesList;

        clinicHistory.diagnostics = this.diagnosticMovementService.diagnosticMovements;
        const result = !!this.idCH ? this.clinicHistoryService.update(clinicHistory) : this.clinicHistoryService.insert(clinicHistory);
        
        result.finally(() => this.isSaving = false)
            .subscribe(
            result => {
                this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios.");
                this.utilityService.navigate("historiaclinica/listado");
            },
            error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al guardar los datos');
            });
    }

    setEvolutionHcEdit(clinicHistory: ClinicHistory) {
        let hcItems = new Array<ClinicItem>();
        let hcTables = new Array<ClinicTable>();
        this.items.forEach((e: ItemPractice) => {
            if (e.table) {
                let hcTable = this.hcEvolution.hcTables.find(x => x.itemId == e.numint);
                if (hcTable) {
                    hcTable.tableId = this.formForItems.value[e.name];
                    hcTables.push(hcTable);
                }
            } else {
                let hcItem = this.hcEvolution.hcItems.find(x => x.itemId == e.numint);
                if (hcItem) {
                    hcItem.itemId = e.numint;
                    hcItem.value = this.formForItems.value[e.name];
                    hcItems.push(hcItem);
                }
            }
        });
        clinicHistory.hcItems = hcItems;
        clinicHistory.hcTables = hcTables;
    }

    setEvolutionHc(clinicHistory: ClinicHistory) {
        let hcItems = new Array<ClinicItem>();
        let hcTables = new Array<ClinicTable>();

        this.items.forEach(e => {
            if (e.table) {
                let hcTable = new ClinicTable();
                hcTable.itemId = e.numint;
                hcTable.tableId = this.formForItems.value[e.name];
                hcTables.push(hcTable);
            } else {
                let hcItem = new ClinicItem();
                hcItem.itemId = e.numint;
                hcItem.value = this.formForItems.value[e.name];
                hcItems.push(hcItem);
            }
        });
        clinicHistory.date = (new Date()).toISOString();
        const isNotNull = hcItems.filter(item => item.value != null);
        const tableNotNull = hcTables.filter(item => item.tableId != null);
        clinicHistory.hcItems = isNotNull;
        clinicHistory.hcTables = tableNotNull;
        //clinicHistory.hcItems = !isNull.length ? hcItems : [];
        //clinicHistory.hcTables = !tableNull.length ? hcTables:[];
    }

    onCancelButtonOfCH(): void {
        this.openModalDiscardSubject.next();
    }

    onReturnButtonOfCH() {
        this.utilityService.navigate('historiaclinica/listado');
    }

    /** Esquema de medicacion **/
    onActionScheme(event: any) {
        switch (event.action) {
        case 'new':
            this.showPharmacySchemeNewForm = true;
            this.pharmacySchemeService.isNew = true;
            break;
        case 'edit':
            this.showPharmacySchemeNewForm = true;
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
        this.showPharmacySchemeEditForm = false;
    }

    closeNewScheme() {
        this.showPharmacySchemeNewForm = false;
    }

    /********************************* Diagnostic ***********************************/
    onActionDiagnostic(event: any) {
        switch (event.action) {
        case 'new':
            this.diagnosticMovementService.isNew = true;
            this.showDiagnosticForm = true;
            break;
        case 'edit':
            this.diagnosticMovementService.isNew = false;
            this.diagnosticMovementService.diagnosticMovement = event.item;
            this.showDiagnosticForm = true;
            break;
        case 'detail':
            break;
        default:
            break;
        }
    }

    closeDiagnosticForm() {
        this.showDiagnosticForm = false;
    }

    changeActiveTab(tab: string) {
        this.activeTab = tab;
    }

    discardChanges() {
        this.utilityService.navigate(`historiaclinica/listado/${this.clinicHistoryService.patientId}`);
    }
}
