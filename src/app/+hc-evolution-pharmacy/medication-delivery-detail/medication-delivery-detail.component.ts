import { forEach } from '@angular/router/src/utils/collection';
import { Component, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { MedicationDeliveryDetailService } from '../medication-delivery-detail.service';
import { InternmentSelectedService } from '../internment-selected.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { UtilityService } from '../../+core/services/utility.service';
import { InternmentSelected } from '../../models/internment-selected.model';
import { PharmacySchemeItemService } from '../pharmacy-scheme-item.service';
import { HcEvolutionPharmacyService } from '../hc-evolution-pharmacy.service';
import { PharmacyScheme } from '../../models/pharmacy-scheme.model';
import { Subject } from '../../../../node_modules/rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'medication-delivery-detail',
  templateUrl: './medication-delivery-detail.component.html',
  styleUrls: ['./medication-delivery-detail.component.scss']
})
export class MedicationDeliveryDetailComponent implements OnInit {

  showMedicationSchemeForm = false;
  selectedPatients: Array<any> = [];
  isLoading = false;
  reloadingSchemeItems = false;
  showDetailScheme = false;
  activeTab = 'selectedItems';
  pharmacyScheme: PharmacyScheme;
  articleCode: string;
  deleteModalSubject: Subject<any> = new Subject();
  reloadingData: boolean = false;
  reloadResultMedication: boolean = false;
  validDelivery = false;
  paginator: any = {
    hasNextPage: true,
    hasPreviousPage: true
  };
  daysScheme: Array<any> = [];
  
  scheme: any = {};
  public datePickerOptions: any;
  public selectedDate: any;
  pharmacySchemes: Array<any> = [];
  pharmacySchemesAux: any = {};
  selectedDateToString:any;
  pharmacySchemeQuantity: any = {};

  constructor(
    public medicationDeliveryDetailService: MedicationDeliveryDetailService,
    private toastyMessageService: ToastyMessageService,
    private utilityService: UtilityService,
    public pharmacySchemeItemService: PharmacySchemeItemService,
    public internmentSelectedService: InternmentSelectedService,
    public hcEvolutionPharmacyService: HcEvolutionPharmacyService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.medicationDeliveryDetailService.selectedInternments = new Array<InternmentSelected>();
    //this.loadMedicationDeliveryDetail();


    this.datePickerOptions = this.utilityService.getDatePickerOptions();
    this.datePickerOptions.formatSubmit = 'dd/mm/yyyy';
    this.loadForm();
  }

  loadForm(){
      if (!this.internmentSelectedService.patMovId) this.utilityService.navigateToBack();
      this.loadScheme();
  }

  loadScheme() {
    this.medicationDeliveryDetailService.getScheme()
      .subscribe((response: any) => {
        this.scheme = response.model;
        this.scheme.patientName = this.internmentSelectedService.patMovId.patientName;
        this.scheme.professionalName = this.internmentSelectedService.patMovId.professionalName;

        const selectDate: HTMLInputElement = this.renderer.selectRootElement('#selectedDate');

        this.scheme.dateIni = moment(this.scheme.dateIni);
        this.scheme.dateEnd = moment(this.scheme.dateEnd);
        
        $(selectDate).pickadate('picker').set('min', this.scheme.dateIni.toDate()).set('max', this.scheme.dateEnd.toDate());
        this.scheme.selectDate = moment(new Date()).format("DD/MM/YYYY");
        $(selectDate).pickadate('picker').set('select', moment(new Date()).format("DD/MM/YYYY"));
      },
      error => {
        this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al cargar el esquema');
      })
  }

  previousDate() {
    if (this.paginator.hasPreviousPage) {
      if (this.selectedDate) {
        var newDate = this.selectedDate.subtract(1, 'days');
        this.paginator.hasPreviousPage = newDate.isAfter(this.scheme.dateIni);
        this.paginator.hasNextPage = newDate.isBefore(this.scheme.dateEnd);
        this.selectedDate = moment(newDate.toDate());
      } else {
        this.selectedDate = moment(this.scheme.dateEnd.toDate());
        this.paginator.hasPreviousPage = this.selectedDate.isAfter(this.scheme.dateIni);
        this.paginator.hasNextPage = this.selectedDate.isBefore(this.scheme.dateEnd)
      }

      var selectDate: HTMLInputElement = this.renderer.selectRootElement('#selectedDate');
      
      $(selectDate).pickadate('picker').set('select', this.selectedDate.toDate());
    }
  }

  nextDate() {
    if (this.paginator.hasNextPage) {
      if (this.selectedDate) {
        var newDate = this.selectedDate.add(1, 'days');
        this.paginator.hasNextPage = newDate.isBefore(this.scheme.dateEnd);
        this.paginator.hasPreviousPage = newDate.isAfter(this.scheme.dateIni);
        this.selectedDate = moment(newDate.toDate());
      } else {
        this.selectedDate = moment(this.scheme.dateIni.toDate());
        this.paginator.hasNextPage = this.selectedDate.isBefore(this.scheme.dateEnd);
        this.paginator.hasPreviousPage = this.selectedDate.isAfter(this.scheme.dateIni);
      }

      var selectDate: HTMLInputElement = this.renderer.selectRootElement('#selectedDate');
      
      $(selectDate).pickadate('picker').set('select', this.selectedDate.toDate());
    }
  }

  clearQuantity() {
    for (let prop in this.pharmacySchemesAux) {
      this.pharmacySchemesAux[prop].forEach((pharmacyScheme: any, index: number) => {
        this.pharmacySchemeQuantity[pharmacyScheme.articleCode] = 0;
      });
    }
  }

  calculateQuantity() {
    for (let prop in this.pharmacySchemesAux) {
      this.pharmacySchemesAux[prop].forEach((pharmacyScheme: any, index: number) => {
        this.pharmacySchemeQuantity[pharmacyScheme.articleCode] = this.pharmacySchemeQuantity[pharmacyScheme.articleCode] + pharmacyScheme.quantity; 
      });
    }
  }

  onSelect(event: any) {
    var selectedDate = event.currentTarget.value;
    if (selectedDate) {
      this.selectedDate = moment(selectedDate, "DD/MM/YYYY");
      this.paginator.hasNextPage = this.selectedDate.isBefore(this.scheme.dateEnd);
      this.paginator.hasPreviousPage = this.selectedDate.isAfter(this.scheme.dateIni);
      this.selectedDateToString = this.selectedDate.format('DD-MM-YYYY')

      if (!this.pharmacySchemesAux[this.selectedDateToString]) {
        this.pharmacySchemeItemService.getSchemeItems(this.scheme.id, this.selectedDate.format('YYYY-MM-DD')).subscribe((response: any) => {
          this.pharmacySchemes = response.model;
          this.pharmacySchemesAux[this.selectedDateToString] = this.pharmacySchemes;
          this.pharmacySchemesAux = Object.assign({}, this.pharmacySchemesAux)

          this.clearQuantity();
          this.calculateQuantity();

          
        });
      } else {
        this.pharmacySchemes = this.pharmacySchemesAux[this.selectedDateToString];
      }
    }
    else {
      this.selectedDate = undefined;
      this.paginator.hasPreviousPage = true;
      this.paginator.hasNextPage = true;
    }
  }

  onChangeQuantity(event: any, articleCode: any) {
    this.clearQuantity();
    this.calculateQuantity();
    // console.log("event.currentTarget.value:", event.currentTarget.value);
    // console.log("articleCode:", articleCode);
    // console.log("pharmacySchemeQuantity:", this.pharmacySchemeQuantity);
  }







  loadMedicationDeliveryDetail() {
    this.medicationDeliveryDetailService.getAllInternments()
      .subscribe((response: any) => {
        this.selectedPatients = response.selected;
      },
        error => {
          this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : 'Ocurrio un error al cargar los medicamentos');
        })
  }

  onActionSelected(item: any) {
    this.pharmacySchemeItemService.HcSchemeId = item.hcId//39;item.HcSchemeId;
    this.reloadingSchemeItems = true;
    this.showDetailScheme = true;
    this.updateReloadingSchemeItems({ value: true })
  }

  updateReloadingSchemeItems(event: any) {
    this.reloadingSchemeItems = event.value;
  }

  changeActiveTab(tab: string) {
    this.activeTab = tab;
  }

  saveHcPharmacyItems() {
      let filter = this.internmentSelectedService.filter ? this.internmentSelectedService.filter + " and DepartureDate = null" : "DepartureDate = null";
      let data: any[]=[] ;
      let keys = Object.keys(this.pharmacySchemesAux).map((key) => {
          this.pharmacySchemesAux[key].forEach((d:any) => {
              d.date = this.utilityService.formatDateBE(key);
          });
      data.push({date:key,items:this.pharmacySchemesAux[key]});
      });
      for (let dt of data) {
          dt.date = this.utilityService.formatDateBE(dt.date);
      }
      
     
    this.hcEvolutionPharmacyService.insert({items: data}).subscribe(response => {
      this.toastyMessageService.showSuccessMessagge("Se guardaron los cambios");
      this.utilityService.navigate("historiaclinica/consumo");
    },
    error => {
      this.toastyMessageService.showErrorMessagge(error.success ? error.errorMessage : "Ocurrio un error al guardar los datos");
    });
  }

  viewBack() {
    this.utilityService.navigate("historiaclinica/consumo");
  }

  onActionClick(event: any) {
    switch (event.action) {
        case 'new':

        case 'edit':
          this.showMedicationSchemeForm = true;
          this.pharmacyScheme = event.item;
          break;
        case 'delete':
        this.articleCode = event.item.id;
        if (!!this.articleCode) this.deleteModalSubject.next();
  
            break;
        default:
            break;
    }
  }

  onDeleteConfirm(event: any) {
    this.pharmacySchemeItemService.delete(this.articleCode).subscribe(
      response => {
        this.articleCode = '';
        this.reloadingSchemeItems = true;
        this.reloadResultMedication = !this.reloadResultMedication;

        this.toastyMessageService.showSuccessMessagge('Se elimino el medicamento correctamente');
      }, 
      error => this.toastyMessageService.showErrorMessagge("No se pudo eliminar el medicamento")
    );
  }

  closeFormArticle() {
    this.showMedicationSchemeForm = false;
    this.reloadResultMedication = !this.reloadResultMedication;
  }

  setValidDelivery(event: any) {
    this.validDelivery = event;
  }
}