import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { ExportationEntryService } from './../../+exportations-entry/exportation-entry.service';
import { UtilityService } from '../../+core/services/utility.service';
import { ExportationEntry } from '../../models/exportationEntry.model';

@Component({
    selector: 'selector-name',
    templateUrl: 'exportation-entry-detail.component.html'
})

export class ExportationEntryDetailComponent implements OnInit {
    exportationEntry: ExportationEntry;
    isLoad: boolean = false;
    expedientNumber: number = 0;
    tipos: Array<any> = new Array<any>();
    typeName: string = "";
    type: number = 0;
    isBuscador: boolean = false;

    constructor(
        private exportationEntryService: ExportationEntryService,
        private route: ActivatedRoute,
        private router: Router,
        private utilityService: UtilityService
    ) {

    }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.expedientNumber = this.exportationEntryService.expedientNumber;
        this.getTypes();
        this.getExportationEntry(id);
    }

    getTypes() {
        this.exportationEntryService.getEntryTypes().subscribe(response => {
            this.tipos = response;
        })
    }

    getExportationEntry(id: any) {
        this.exportationEntryService.get(id).subscribe(result => {
            this.exportationEntry = result.model;
            this.isLoad = true;
            for (let i = 0; i < this.tipos.length; i++) {
                if (this.tipos[i].number != null) {
                    if (this.exportationEntry.type == this.tipos[i].number) {
                        this.typeName = this.tipos[i].description;
                    }
                }
            }
            this.checkType();
        })
    }

    checkType() {
        if(this.exportationEntry.type == "50") {
            this.isBuscador = true;
        } else {
            this.isBuscador = false;
        }
    }
}