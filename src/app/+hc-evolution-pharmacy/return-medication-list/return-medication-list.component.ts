import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastyMessageService, UtilityService } from '../../+core/services/index';
import { ReturnMedicationService } from '../return-medication.service';
import { IColumn } from '../../+shared/util/index';
import { Router, ActivatedRoute } from '@angular/router';
import { PharmacyScheme } from '../../models/pharmacy-scheme.model';

@Component({
  selector: 'app-return-medication-list',
  templateUrl: './return-medication-list.component.html',
  styleUrls: ['./return-medication-list.component.scss']
})
export class ReturnMedicationListComponent implements OnInit {

  showReturnMedicationForm = false;
  deleteModalSubject: Subject<any> = new Subject();
  reloadingData: boolean = false;
  articleCode: string;
  internmentId: any;
  columns: Array<IColumn> = [
    { header: 'Codigo', property: 'articleCode', disableSorting: true },
    { header: 'Nombre', property: 'articleName', disableSorting: true },
    { header: 'Cantidad', property: 'quantity', disableSorting: true },
    { header: 'Observacion', property: 'observation', disableSorting: true }
  ];
  pharmacySchemeItem: PharmacyScheme;
  
  constructor(
    public returnMedicationService: ReturnMedicationService,
    private toastyMessageService: ToastyMessageService,
    private router: Router,
    private route: ActivatedRoute,
    private utilityService: UtilityService
  ) { 
    this.internmentId = this.route.snapshot.paramMap.get('internmentId');
    this.returnMedicationService.internmentId = this.internmentId ? this.internmentId : 0;
  }

  ngOnInit() {
    this.returnMedicationService.isFirstTime = true;
  }

  onActionClick(event: any) {
    switch (event.action) {
      case 'new':
        break;
      case 'edit':
        this.showReturnMedicationForm = true;
        this.articleCode = event.item.articleCode;
        this.pharmacySchemeItem = event.item;
        break;
      case 'delete':
      this.articleCode = event.item.articleCode;
      if (!!this.articleCode) this.deleteModalSubject.next();
        break;
      case 'detail':
        break;
      default:
        break;
    }
  }

  onDeleteConfirm(event: any) {
    const result = this.returnMedicationService.delete(this.articleCode);
    let message: string;
    if (result) {
        this.articleCode = '';
        this.toastyMessageService.showSuccessMessagge('Se elimino el medicamento correctamente');
        
    } else 
      this.toastyMessageService.showErrorMessagge("No se pudo eliminar el medicamento");
  }

  returnMedication() {
    let devolutionMedicaments = this.returnMedicationService.schemesList;
    devolutionMedicaments.forEach(e => {
      e.quantity = -(e.quantity);
      e.id = 0;
    });
    this.returnMedicationService.insert({medicaments: devolutionMedicaments}).subscribe(response => {
      this.toastyMessageService.showSuccessMessagge("Devoluion exitosa de Medicamentos");
      this.utilityService.navigate("historiaclinica/consumo");
      //this.router.navigate([`historiaclinica/consumo`]);
    },
      error => {
        this.toastyMessageService.showErrorMessagge("Ocurrió un error al devolver medicamentos");
      })
  }

  viewBack() {
    this.utilityService.navigate("historiaclinica/consumo");
  }

  updateReloadingData(event: any) {
    this.reloadingData = event.value;
  }

  closeFormArticle() {
    this.showReturnMedicationForm = false;
  }
}
