import { OnInit, Input, Component, SimpleChanges, SimpleChange, Output, EventEmitter } from "../../../../node_modules/@angular/core";
import { ToastyMessageService } from "../../+core/services";
import { InternmentSelectedService } from "../internment-selected.service";
import { HcEvolutionPharmacyService } from "../hc-evolution-pharmacy.service";

@Component({
    selector: 'medication-delivery-total',
    templateUrl: './medication-delivery-total.component.html'
  })
  export class MedicationDeliveryTotalComponent implements OnInit {
    
    @Input() selectedPatients: any = {};
    @Input() reloadResult: boolean = true;
    @Input() totalMedications: Array<any> = [];
    @Output() validDelivery = new EventEmitter<any>();
    
    oldSelectedPatients: any;

    constructor(
        private toastyMessageService: ToastyMessageService,
        public internmentSelectedService: InternmentSelectedService,
        public hcEvolutionPharmacyService: HcEvolutionPharmacyService
      ) { }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges) {
        const selectedPatients: SimpleChange = changes.selectedPatients;
        //this.getMedicationStock();
        
    }

    //getMedicationStock() {
    //    let items = this.selectedPatients.map(x => x.id);
    //     let medication = { AllSelected: this.internmentSelectedService.allSelected, Items: items }
    
    //    this.hcEvolutionPharmacyService.getMedicationWithStock(medication).subscribe(response => {
    //      this.totalMedications = response.model;
    //      let result = this.totalMedications && this.totalMedications.length > 0;
    //      this.validDelivery.emit(result);
    //     },
    //       error => {
    //        this.toastyMessageService.showToastyError(error, "Ocurrió un error al obtener los medicamentos.");
    //        this.validDelivery.emit(false);
    //     })
    //}
  }