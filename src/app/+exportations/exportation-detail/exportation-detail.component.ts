import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ExportationService } from './../../+exportations/exportation.service';
import { Exportation } from './../../models/exportation.model';
import { UtilityService } from '../../+core/services/utility.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'exportation-detail.component.html'
})

export class ExportationDetailComponent implements OnInit {
    exportation: Exportation;
    isLoad: boolean = false;
    
    constructor(
        private exportationService: ExportationService,
        private route: ActivatedRoute,
        private router: Router,
        private utilityService: UtilityService
    ) {

    }
   
    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.getExportation(id);
    }

    getExportation(id: any) {
        this.exportationService.get(id)
            .subscribe(
                result => {
                    this.exportation = result.model;
                    console.log(this.exportationService);
                    this.isLoad = true;

            })
    }
}