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
        private _route: ActivatedRoute,
        private _router: Router
    ) {
    }

    ngOnInit() {
        this.codigo = this._route.snapshot.paramMap.get('codigo');
        this._router.navigate([`dynamic-view/` + this.codigo]);
    }
}