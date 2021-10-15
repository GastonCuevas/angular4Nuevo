import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';
import { BedCard } from '../../models/bed-card.model';

@Component({
    selector: 'bed-card',
    templateUrl: './bed-card.component.html',
    styleUrls: ['./bed-card.component.scss']
})
export class BedCardComponent implements OnInit {

    @Input() bed: BedCard;
    bedId: any;

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {
    }

    ngOnInit() {
    }

    onViewDetail(id: any) {
        this.router.navigate([`camas/movimientos/${this.bed.id}`]);
    }

}
