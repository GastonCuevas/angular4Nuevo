import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
// import { Subject } from 'rxjs';

import { ToastyMessageService, UtilityService, CommonService, NavBarService } from '../../+core/services';
import { ClinicHistoryService } from '../clinic-history.service';
import { PaginatorComponent, GenericControl, IntelligentReportComponent } from '../../+shared';
import { ClinicHistoryList, ClinicHistory, DiagnosticMovement } from '../../models';
import { Patient } from '../../models/patient.model';
import { PatientService } from '../../+patient/patient.service';
import { ClinicHistoryPharmacySchemeService } from '../pharmacy-scheme';
import { PharmacyScheme } from '../../models/pharmacy-scheme.model';
import * as moment from 'moment';
import { window } from 'rxjs/operator/window';

@Component({
    selector: 'app-clinic-history-list',
    templateUrl: './clinic-history-list.component.html',
    styleUrls: ['./clinic-history-list.component.scss']
})
export class ClinicHistoryListComponent implements OnInit {

    isLoading: boolean = true;
    isLoadingResum: boolean = true;
    disableButtonFloating: false;
    dataSource = new Array<ClinicHistoryList>();
    patientId: number;

    readonlyCH: boolean;
    private item: any;
    private filterBy: string = '';
    sort = {
        sortBy: 'date',
        ascending: true
    }

    @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;
    @ViewChild('iReport') iReport: IntelligentReportComponent;

    constructor(
        private activatedRoute: ActivatedRoute,
        private toastyMessageService: ToastyMessageService,
        private utilityService: UtilityService,
        private commonService: CommonService,
        private navBarService: NavBarService,
        private router: Router,
        public clinicHistoryService: ClinicHistoryService,
        private patientService: PatientService,
        public chPharmacySchemeService: ClinicHistoryPharmacySchemeService
    ) {
        this.patientId = Number(this.activatedRoute.snapshot.paramMap.get('patientId'));
        this.clinicHistoryService.patientId = this.patientId;
    }

    ngOnInit() {
        if (this.patientId) this.getPatientAndInitValues();
        this.navBarService.getNavbars().subscribe(
            (res) => {
                this.item = this.navBarService.findItem(this.router.url, null);
            }
            
        );

    }
    ngOnDestroy() {
        scrollTo(0, 0);
    }

    private getPatientAndInitValues() {
        if (this.clinicHistoryService.patientName) return;
        this.clinicHistoryService.setCustomFilters();
        this.patientService.get(this.patientId)
            // .finally(() => this.isLoading = false)
            .subscribe(response => {
                let patient: Patient = response.model;
                this.clinicHistoryService.patientName = patient.account.name;
            }, error => {
                this.toastyMessageService.showToastyError(error, 'Ocurrio un error al obtener los datos del paciente');
            });
    }

    private loadClinicHistories() {
        this.clinicHistoryService.getAll(this.paginatorComponent.paginator, this.filterBy, this.sort)
            .finally(() => this.isLoading = false)
            .subscribe(response => {
                this.paginatorComponent.loadPaginator(response.itemsCount);
                this.dataSource = response.model;
            },
                error => {
                    this.toastyMessageService.showErrorMessagge('Ocurrio un error al obtener los datos.');
                });
    }

    onActionClick(action: string, item?: any) {
        switch (action) {
            case 'new':
                this.utilityService.navigate(`historiaclinica/formulario/nuevo/${item.numInt}`);
                this.clinicHistoryService.specialtyId = item.specialtyId;
                this.clinicHistoryService.practiceId = item.practiceId;
                break;
            case 'edit':
                this.utilityService.navigate(`historiaclinica/formulario/editar/${item!.id}`);
                this.clinicHistoryService.specialtyId = item.specialtyId;
                this.clinicHistoryService.readonly = false;
                break;
            case 'detail':
                this.utilityService.navigate(`historiaclinica/formulario/editar/${item!.id}`);
                this.clinicHistoryService.readonly = true;
                break;
            default:
                break;
        }
    }

    showOrHideEvolutions(item: any) {
        item.hiddenEvolutions = !item.hiddenEvolutions;
    }

    showOrHideMPs(item: any) {
        item.hiddenMPs = !item.hiddenMPs;
        item.hiddenDiag = false;
    }

    onFilterChange(filterBy: string) {
        this.filterBy = filterBy;
        this.paginatorComponent.paginator.currentPage = 1;
        this.loadClinicHistories();
    }

    onPageChange() {
        this.loadClinicHistories();
    }

    printReportMP(data: any) {
        let parameters = new Array<{ key: string; value: any }>();
        parameters.push({ key: 'idmovpac', value: data.numInt });
        this.iReport.generateReportWithSQL(parameters, 2000);
    }

    printReportCHE(idEvolution: number) {
        let parameters = new Array<{ key: string; value: any }>();
        parameters.push({ key: 'id', value: idEvolution });
        this.iReport.generateReportWithSQL(parameters, 2001);
    }

    onReturn() {
        this.utilityService.navigate(`/archivos/pacientes/formulario/${this.patientId}`);
    }

    getLastSchemeAndDiagnostic(clinicHistory: ClinicHistoryList) {
        clinicHistory.hiddenDiag = !clinicHistory.hiddenDiag;
        if (!clinicHistory.gettedPharmacyAndDiagnostic) {
            
            this.isLoadingResum = true;
            this.clinicHistoryService.getLastDiagnostic(clinicHistory.key.patientNumber)
                .finally(() => { 
                    this.isLoadingResum = false;
                    clinicHistory.hiddenDiag = clinicHistory.gettedPharmacyAndDiagnostic = true;
                     })
                .subscribe((list) => {
                    clinicHistory.diagnosticLast = !!list.model.id ? list.model : undefined;
                }, (error) => {
                    clinicHistory.diagnosticLast = undefined;
                });
            this.clinicHistoryService.getLastScheme(clinicHistory.key.patientNumber)
                .finally(() => { 
                    this.isLoadingResum = false;
                    clinicHistory.hiddenDiag = clinicHistory.gettedPharmacyAndDiagnostic = true;
                     })
                .subscribe((list) => {
                    clinicHistory.dateIni = moment(list.model.dateIni).format('DD/MM/YYYY');
                    clinicHistory.dateEnd = moment(list.model.dateEnd).format('DD/MM/YYYY');
                    clinicHistory.pharmacySchemeLast = !list.model.medicines.length ? [] : list.model.medicines;
                    clinicHistory.pharmacySchemeLast.forEach(med => {
                        
                        med.typeText = med.type == 1 ? 'Posologia' : med.type == 2 ? 'SOS':'-';
                    });
                }, (error) => {
            });
        }
    }

     /** Esquema de medicacion **/
     onActionScheme(event: any) {
        switch (event.action) {
        case 'detail':
            break;
        default:
            break;
        }
    }

    printHCGral(){
        if (this.item.config) {
            this.iReport.generateReportWithData(this.dataSource, this.item.config, true);
        }else{
            this.toastyMessageService.showErrorMessagge('No se encuentra id en config.');
        }
    }

}
