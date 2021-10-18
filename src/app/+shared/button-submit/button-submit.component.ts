import { Component, Input, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { LoadingGlobalService } from '../../+core/services';

@Component({
    selector: 'button-submit',
    templateUrl: './button-submit.component.html',
})
export class ButtonSubmitComponent implements OnChanges, OnDestroy {

    @Input() isLoading = false;
    @Input() loadingGlobal = false;
    @Input() btntext = 'Guardar';
    @Input() btntextLoading = '';
    @Input() btnDisabled: boolean;
    @Input() btnType = 'button';
    @Input() color = 'blue';
    @Output() formSubmit = new EventEmitter();

    constructor(private loadingGlobalService : LoadingGlobalService) {}

    ngOnChanges(changes: SimpleChanges) {
        const isLoading: SimpleChange = changes.isLoading;
        if(isLoading && !isLoading.firstChange && !isLoading.currentValue)
            this.loadingGlobalService.hideLoading();
    }

    ngOnDestroy() {
        if(this.loadingGlobal ) this.loadingGlobalService.hideLoading();
    }

    onSubmit() {
        if (this.loadingGlobal) this.loadingGlobalService.showLoading(this.btntextLoading);
        if (this.btnType == 'button') this.formSubmit.emit();
    }
}
