import { Component, OnInit } from '@angular/core';
import { PracticeInosService } from './../practice-inos.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PracticeInos } from './../../models/practiceInos.model';
import { UtilityService } from '../../+core/services/utility.service';
import { CommonService } from './../../+core/services/common.service';
import { ToastyMessageService } from './../../+core/services/toasty-message.service';

@Component({
    selector: 'selector-name',
    templateUrl: 'practice-inos-detail.component.html'
})

export class PracticeInosDetailComponent implements OnInit {
    practiceInos: PracticeInos;
    isLoad: boolean = false;

    constructor(
        public practiceInosService: PracticeInosService,
        private route: ActivatedRoute,
        public commonService: CommonService,
        public toastyMessageService: ToastyMessageService
    ) { }

    ngOnInit() {
        let id = this.route.snapshot.paramMap.get('id');
        this.getPracticeInos(id);
    }

    getPracticeInos(id: any) {
        this.isLoad = true;
        this.practiceInosService.get(id)
            .finally(() => this.isLoad = false)
            .subscribe(response => {
                this.practiceInos = response.model;
            }, error => {
                this.isLoad = false;
                this.toastyMessageService.showErrorMessagge();
            })
    }
}