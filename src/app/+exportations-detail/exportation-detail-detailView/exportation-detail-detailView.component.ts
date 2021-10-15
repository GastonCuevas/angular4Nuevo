import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ExportationDetailService } from './../../+exportations-detail/exportation-detail.service';
import { ExportationDetail } from './../../models/exportationDetail.model';
import { UtilityService } from '../../+core/services/utility.service';

import { ConfigCKEditor } from '../config-ckeditor';
import * as jquery from 'jquery';

@Component({
    selector: 'selector-name',
    templateUrl: 'exportation-detail-detailView.component.html',
    styleUrls: ['./exportation-detail-detailView.component.css']
})

export class ExportationDetailDetailViewComponent implements OnInit, AfterViewChecked {
    exportationDetail: ExportationDetail;
    isLoad: boolean = false;
    expedientNumber: number = 0;
    tipos: Array<any> = new Array<any>();
    typeName: string = "";
    type: number = 0;
    isCsv: boolean = false;

    config = ConfigCKEditor.CONFIG_VIEW;

    constructor(
        private exportationDetailService: ExportationDetailService,
        private route: ActivatedRoute,
        private router: Router,
        private utilityService: UtilityService
    ) {

    }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.expedientNumber = this.exportationDetailService.expedientNumber;
        this.getTypes();
        this.getExportationDetail(id);
        // this.checkCsv();
    }

    ngAfterViewChecked(){
        $('#textarea1').trigger('autoresize');
    }
    
    getTypes() {
        this.exportationDetailService.getDetailType().subscribe(response => {
            this.tipos = response;
        })
    }

    getExportationDetail(id: any) {
        this.exportationDetailService.get(id).subscribe(result => {
            this.exportationDetail = result.model;
            this.isLoad = true;
            for (let i = 0; i < this.tipos.length; i++) {
                if (this.tipos[i].number != null) {
                    if (this.exportationDetail.type == this.tipos[i].number) {
                        this.typeName = this.tipos[i].name;
                    }
                }
            }
            this.checkCsv();
        })
    }

    checkCsv() {
        if(this.exportationDetail.type == "2") {
            this.isCsv = true;
        } else {
            this.isCsv = false;
        }
    }
}