import { ContractProfessionalMedicalInsuranceService } from './../contract-professional-medical-insurance.service';
import { ProfessionalContractMedicalInsurance } from './../../models/professional-contract-medicalInsurance.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../+core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'contract-professional-medical-insurance-form',
  templateUrl: './contract-professional-medical-insurance-form.component.html',
  styleUrls: ['./contract-professional-medical-insurance-form.component.scss']
})
export class ContractProfessionalMedicalInsuranceFormComponent implements OnInit {

  public inosPractices: Array<any>;
  functionForMedicalInsurances = this.commonService.getMedicalInsurances();
  loadingPracticeIAC: boolean = false;
  public auxListInosPractices: Array<any> = new Array<any>();
  public auxListMedicalInsurance: Array<any> = new Array<any>();
  public form: FormGroup;
  public isLoading: boolean = false;
  public isLoadingMedicalInsurance: boolean = false;
  public isLoadingInosPractice: boolean = false;
  public professionalContractMedicalInsurance: ProfessionalContractMedicalInsurance = new ProfessionalContractMedicalInsurance();
  public medicalInsurances: Array<any>;
  public medicalInsuranceName: string = "";
  public openModalSubject: Subject<any> = new Subject();
  isNew: boolean = true;
  itemValue: number = 0;
  public contractNumber: number = 0;
  public professionalAccount: number = 0;
  isAnyPracticeSelected: boolean = false;

  @Output() actionClick: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
    private activatedRoute: ActivatedRoute,
    private toastyService: ToastyMessageService,
    public contractProfessionalMedicalInsuranceService: ContractProfessionalMedicalInsuranceService,
  ) {
    this.contractNumber = +(this.activatedRoute.snapshot.paramMap.get('id') || 0);
    this.professionalAccount = +(this.activatedRoute.snapshot.paramMap.get('profesionalId') || 0);
  }

  ngOnInit() {
    this.isNew = true;
    this.loadForm();
  }

  createForm() {
    this.form = this.fb.group({
      medicalInsuranceName: [this.professionalContractMedicalInsurance.medicalInsuranceName, Validators.required],
      practiceName: [this.professionalContractMedicalInsurance.practiceName, null],
      practiceNumber: [this.professionalContractMedicalInsurance.practiceNumber, Validators.required],
      factor: [this.professionalContractMedicalInsurance.factor, [Validators.required, Validators.min(0), Validators.max(100)]],
      fixed: [this.professionalContractMedicalInsurance.fixed, Validators.required],
      porcob: [this.professionalContractMedicalInsurance.porcob],
      retention: [this.professionalContractMedicalInsurance.retention, [Validators.required, Validators.min(0), Validators.max(100)]],
      coinsurancePercentage: [this.professionalContractMedicalInsurance.coinsurancePercentage, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }
  
  getMedicalInsuranceContract() {
    this.professionalContractMedicalInsurance = this.contractProfessionalMedicalInsuranceService.professionalContractMedicalInsurance;
    this.contractProfessionalMedicalInsuranceService.contractId = this.professionalContractMedicalInsurance.numint;
    this.createForm();
  }

  loadForm() {
    this.getMedicalInsuranceContract();
    this.loadMedicalInsurances();
  }

  loadMedicalInsurances() {
    this.commonService.getMedicalInsurancesWithContract().subscribe(
      response => {
        this.medicalInsurances = response.model || [];
        this.loadInosPractices(this.professionalContractMedicalInsurance.medicalInsuranceNumber);
      },
      () => this.toastyService.showErrorMessagge("No se pudo obtener las obras sociales")
    )
  }

  loadInosPractices(medicalInsuranceId: any) {
    this.loadingPracticeIAC = true;
    this.commonService.getInosPracticesByMedicalInsurance(medicalInsuranceId)
      .finally(() => { this.loadingPracticeIAC = false; })
      .subscribe(
        response => {
          this.inosPractices = response.model || [];
          this.form.patchValue({ practiceName: this.professionalContractMedicalInsurance.practiceName, practiceNumber: this.professionalContractMedicalInsurance.practiceNumber });
        },
        () => this.toastyService.showErrorMessagge("No se pudo obtener las practicas inos")
      )
  }

  onAgree() {
    this.actionClick.emit({ action: 'cancelar' })
  }

  onCancelButton(): void {
    this.openModalSubject.next();
  }

  onSubmitMedicalInsurance() {

    const professionalContractMedicalInsurance: ProfessionalContractMedicalInsurance = Object.assign({}, this.professionalContractMedicalInsurance, this.form.value);
    const actionName = 'edicion';
      this.contractProfessionalMedicalInsuranceService.save(professionalContractMedicalInsurance).subscribe(() => {
        this.toastyService.showSuccessMessagge("Se guardaron los cambios");
        this.isNew = false;
        this.actionClick.emit({ action: actionName });
      },
        () => {
          this.toastyService.showErrorMessagge("Ocurrio un error al guardar los datos");
        });
  }

  validateRepeatedPractice() {
    let repeatedPractice = false
    for (let i = 0; i < this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances.length; i++ ) {
      //TODO Revisar validacion
      if(this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances[i].medicalInsuranceNumber 
        === this.professionalContractMedicalInsurance.medicalInsuranceNumber &&  this.contractProfessionalMedicalInsuranceService.itemIndexToEdit != i ){
        this.toastyService.showSuccessMessagge("Ya se encuentra la practica en el listado");
          repeatedPractice = true;
          return
      }
    }
    return repeatedPractice;
  }

  selectedPractice(practice: any): void {
    if (practice != null) {
      this.professionalContractMedicalInsurance.practiceNumber = practice.number;
      this.professionalContractMedicalInsurance.practiceName = practice.name;
    }
  }

  selectedMedicalInsurance(medicalInsurance: any): void {
    if (medicalInsurance != null) {
      this.professionalContractMedicalInsurance.medicalInsuranceNumber = medicalInsurance.number;
      this.contractProfessionalMedicalInsuranceService.osId = medicalInsurance.number;
      this.contractProfessionalMedicalInsuranceService.practicesSelected = new Array<any>();
      this.loadInosPractices(medicalInsurance.number);
    } else {
      this.inosPractices = [];
    }
  }

  onChangeOfSelection() {
    this.isAnyPracticeSelected = true;
  }
}