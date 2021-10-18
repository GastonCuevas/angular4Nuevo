import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Paginator } from '../../util';

@Component({
    selector: 'app-paginator',
    templateUrl: './paginator.component.html',
    styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

    @Input() show: boolean = true;
    @Input() pageSize: number = 10;
    @Input() pageSizes: Array<number> = [10, 20, 50, 100];
    @Input() textNotFound: string = 'No se encontraron resultados.';

    @Output() pageChange: EventEmitter<any> = new EventEmitter<any>();

    paginator: Paginator = new Paginator();
    pages: Array<number> = new Array<number>();
    adjacentPagesCount = 2;

    constructor() {}

    ngOnInit() {
        this.paginator.pageSize = this.pageSize;
    }

    loadPaginator(totalItems: number) {
        this.paginator.totalItems = totalItems;
        this.calculatePages();
    }

    private calculatePages() {
        const pagesCount = Math.ceil(this.paginator.totalItems / this.paginator.pageSize);
        this.pages = [];
        for (let i = 1; i <= pagesCount; i++) this.pages.push(i);
    }

    previousPage() {
        if (this.paginator.currentPage == 1)
            return;
        this.paginator.currentPage--;
        this.emitChange();
    }

    nextPage() {
        if (this.paginator.currentPage == this.pages.length)
            return;
        this.paginator.currentPage++;
        this.emitChange();
    }

    selectPage(page: number) {
        if (this.paginator.currentPage == page)
            return;
        this.paginator.currentPage = page;
        this.emitChange();
    }

    selectPageSize() {
        this.paginator.currentPage = 1;
        this.emitChange();
    }

    private emitChange() {
        this.pageChange.emit();
    }

}
