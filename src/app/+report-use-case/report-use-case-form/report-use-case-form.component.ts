import { Component, OnInit } from '@angular/core';
import { ReportUseCaseService } from './../report-use-case.service';
import { IntellReportUserService } from '../../+intellReport-finalUser/intellReport-finalUser.service';
import { ToastyMessageService } from '../../+core/services/toasty-message.service';
import { Subject } from 'rxjs';
import { UtilityService } from '../../+core/services/utility.service';
import { CommonService } from '../../+core/services/common.service';
import { Item } from '../../models/navbar/item.model';
import { NavBarService } from '../../+core/services/navbar.service';
import { Navbar } from '../../models/navbar/navbar.model';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportUseCase } from './../../models/report-use-case.model';
import { ExportationDetailService } from '../../+exportations-detail/exportation-detail.service';
import { ExportationDetail } from '../../models/exportationDetail.model';

@Component({
    selector: 'selector-name',
    templateUrl: 'report-use-case-form.component.html'
})

export class ReportUseCaseFormComponent implements OnInit {
    typeReports: Array<any> = new Array<any>();
    exportationDetails: Array<any> = new Array<any>();
    reportSelectValue: any;
    subReportSelectValue: any;
    title: string = 'Editar Reporte';
    openModalSubject: Subject<any> = new Subject();
    isLoading: boolean = false;
    item: Item;
    codigo: any;
    reportUseCase: ReportUseCase = new ReportUseCase();
    form: FormGroup;
    exportDetail: ExportationDetail;

    constructor( 
        public reportUseCaseService: ReportUseCaseService,
        public intellReportUserService: IntellReportUserService,
        public toastyService: ToastyMessageService,
        public utilityService: UtilityService,
        public commonService: CommonService,
        public navBarService: NavBarService,
        public activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        public exportDetailService: ExportationDetailService
    ) { }

    ngOnInit() { 
        this.loadTypesReport();
        this.loadForm();
    }

    loadForm() {
        const code = this.activatedRoute.snapshot.paramMap.get('code');
        if(code != null) {
            this.getReportUseCase(code);
            this.createForm();
        }
    }

    createForm() {
        this.form = this.fb.group({
            description: [this.reportUseCase.description, null],
        })
    }

    getReportUseCase(code: string) {
        this.isLoading = true;
        this.reportUseCaseService.get(code).finally(() => this.isLoading = false).subscribe(response => {
            this.reportUseCase = response.model;
            if(this.reportUseCase.config != null) {
                this.getExportationDetail(this.reportUseCase.config);      
            }
        },
        error => {
            this.toastyService.showErrorMessagge("Ocurrio un error al obtener los datos del reporte del caso de uso");
        })
        
                
    }

    getExportationDetail(id: any) {
        this.exportDetailService.get(id).subscribe(res => {
            this.exportDetail = res.model;
            if(this.exportDetail != null) {
                this.reportSelectValue = this.exportDetail.expedientNumber;
                const typeReport = this.typeReports.find(i=>i.number == this.reportSelectValue);
                this.exportationDetails = typeReport.exportationDetails;
                this.subReportSelectValue = this.exportDetail.number;    
            }
        },
        error => {
            this.toastyService.showErrorMessagge("Ocurrio un error al obtener los datos de detalle de exportación");
        })
    }

    loadTypesReport() {
        this.isLoading = true;
        this.intellReportUserService.getAllTypesReport().subscribe(
            response => {
                this.typeReports = response.model;
            },
            error => {
                this.toastyService.showErrorMessagge("Ocurrio un error al cargar el combo");
            });
    }

    loadSubreport(value: any) {
        const typeReport = this.typeReports.find(i=>i.number == value);
        if (typeReport) {
            this.exportationDetails = typeReport.exportationDetails;
            this.subReportSelectValue = 0;
        }
    }

    updateUseCase(){
        this.reportUseCaseService.update(this.subReportSelectValue, this.reportUseCase.code).subscribe(
            response => {
                this.reportUseCase.config = this.subReportSelectValue;
                this.toastyService.showSuccessMessagge("Se guardaron los cambios");
                this.utilityService.navigate("sistema/reportUsec");
                this.toastyService.showSuccessMessagge("Debe recargar la pagina para persistir cambios");
            },
            error => {
                this.toastyService.showErrorMessagge(error || "Ocurrió un error al guardar los cambios");
            }
        )
    }

    onCancelButton(): void {
        this.openModalSubject.next();
    }

    onAgree() {
        this.utilityService.navigate("sistema/reportUsec");
    }
}