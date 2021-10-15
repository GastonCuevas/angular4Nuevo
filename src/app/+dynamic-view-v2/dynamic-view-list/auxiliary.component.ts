import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'auxiliary-view',
    template: '',
    styleUrls: []
})
export class AuxiliaryComponent implements OnInit {

    private codigo: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.codigo = this.activatedRoute.snapshot.paramMap.get('codigo');
        this.router.navigate([`vista-dinamica/${this.codigo}`]);
    }
}