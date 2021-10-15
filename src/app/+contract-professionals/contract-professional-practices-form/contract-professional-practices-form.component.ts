import { ContractProfessionalMedicalInsuranceService } from './../contract-professional-medical-insurance.service';
import { ProfessionalContractMedicalInsurance } from './../../models/professional-contract-medicalInsurance.model';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from '../../+core/services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';

@Component({
  selector: 'contract-professional-practices-form',
  templateUrl: './contract-professional-practices-form.component.html',
  styleUrls: ['./contract-professional-practices-form.component.scss']
})
export class ContractProfessionalPracticesFormComponent implements OnInit {

  public inosPractices: Array<any>;
  functionForMedicalInsurances = this.commonService.getMedicalInsurances();
  public auxListMedicalInsurance: Array<any> = new Array<any>();
  public form: FormGroup;
  public isLoading: boolean = false;
  public isLoadingMedicalInsurance: boolean = false;
  public isLoadingInosPractice: boolean = false;
  public professionalContractMedicalInsurance: ProfessionalContractMedicalInsurance = new ProfessionalContractMedicalInsurance();
  public medicalInsurances: Array<any>;
  public medicalInsuranceName: string = "";
  public openModalSubject: Subject<any> = new Subject();
  itemValue: number = 0;
  public contractNumber: number = 0;
  public professionalAccount: number = 0;
  index: number = 0;
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

  createForm() {
    this.form = this.fb.group({
      medicalInsuranceName: [this.professionalContractMedicalInsurance.medicalInsuranceName, Validators.required],
      factor: [this.professionalContractMedicalInsurance.factor, [Validators.required, Validators.min(0), Validators.max(100)]],
      fixed: [this.professionalContractMedicalInsurance.fixed, Validators.required],
      porcob: [this.professionalContractMedicalInsurance.porcob],
      retention: [this.professionalContractMedicalInsurance.retention, Validators.required],
      coinsurancePercentage: [this.professionalContractMedicalInsurance.coinsurancePercentage, [Validators.required, Validators.min(0), Validators.max(100)]]
    });
  }

  getMedicalInsuranceContract() {
    this.professionalContractMedicalInsurance = this.contractProfessionalMedicalInsuranceService.professionalContractMedicalInsurance;
    this.contractProfessionalMedicalInsuranceService.contractId = this.professionalContractMedicalInsurance.numint;
    this.createForm();
  }

  ngOnInit() {
    this.loadForm();
  }

  loadForm() {
    this.loadMedicalInsurances();
    this.createForm();
  }

  loadMedicalInsurances() {
    this.commonService.getMedicalInsurancesWithContract().subscribe(
      response => {
        this.medicalInsurances = response.model || [];
      },
      () => this.toastyService.showErrorMessagge("No se pudo obtener las obras sociales")
    )
  }

  onAgree() {
    this.actionClick.emit({ action: 'cancelar' })
  }

  onCancelButton(): void {
    this.openModalSubject.next();
  }

  onSubmitMedicalInsurance() {
    this.contractProfessionalMedicalInsuranceService.practicesSelected = this.contractProfessionalMedicalInsuranceService.practicesSelected
      .filter((practice: any) => practice.selected === true && practice.added == false);
    const professionalContractMedicalInsurance: ProfessionalContractMedicalInsurance = Object.assign({}, this.professionalContractMedicalInsurance, this.form.value);
    let professionalPractices: Array<any> = new Array<any>();
    this.contractProfessionalMedicalInsuranceService.practicesSelected.forEach(e => {
      let item = {
        numint: 0,
        contractNumber: this.contractNumber,
        medicalInsuranceNumber: professionalContractMedicalInsurance.medicalInsuranceNumber,
        medicalInsuranceName: professionalContractMedicalInsurance.medicalInsuranceName,
        practiceNumber: e.number,
        practiceName: e.name,
        factor: professionalContractMedicalInsurance.factor,
        porcob: professionalContractMedicalInsurance.porcob,
        fixed: professionalContractMedicalInsurance.fixed,
        retention: professionalContractMedicalInsurance.retention
      }
      professionalPractices.push(item);
    });

    this.contractProfessionalMedicalInsuranceService.addRange(professionalPractices);
    this.toastyService.showSuccessMessagge("Se guardaron los cambios");
    this.actionClick.emit({ action: 'nuevo' });
  }

  selectedMedicalInsurance(medicalInsurance: any): void {
    if (medicalInsurance != null) {
      this.professionalContractMedicalInsurance.medicalInsuranceNumber = medicalInsurance.number;
      this.contractProfessionalMedicalInsuranceService.osId = medicalInsurance.number;
      this.contractProfessionalMedicalInsuranceService.practicesSelected = new Array<any>();
    } else {
      this.inosPractices = [];
    }
  }

  onChangeOfSelection() {
    this.isAnyPracticeSelected = true;
  }

  // validateRepeatedPractice(): boolean {
  //   let validInputPractice = true;
  //   this.contractProfessionalMedicalInsuranceService.practicesSelected.forEach(professionalPractice => {
  //     for (let i = 0; i < this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances.length; i++ ) {
  //       if(this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances[i].medicalInsuranceNumber 
  //         === this.professionalContractMedicalInsurance.medicalInsuranceNumber && 
  //         this.contractProfessionalMedicalInsuranceService.contractMedicalInsurances[i].practiceNumber 
  //         === professionalPractice.number
  //        ){
  //         this.toastyService.showMessageToast("Practica existente", `Ya se encuentra la practica ${professionalPractice.name} en el listado`, "warning", 10000);
  //         validInputPractice = false;
  //         return;
  //       }
  //     }
  //   });
  //   return validInputPractice;
  // }

}