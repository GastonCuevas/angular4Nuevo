import { Injectable } from "@angular/core";
import { ToastyService, ToastOptions } from "ng2-toasty";
import { StorageService } from './storage.service';

type toastType = 'default' | 'info' | 'success' | 'wait' | 'error' | 'warning'

@Injectable()
export class ToastyMessageService {

    constructor(private toastyService: ToastyService, private storageService: StorageService) { }

    public showMessageToast(title: string, message: string, type: toastType, timeout: number = 5000) {
        let seconds = timeout / 1000;

        let toastOptions: ToastOptions = {
            title: title,
            msg: message,
            showClose: true,
            theme: 'material',
            timeout: timeout,
        };
        switch (type) {
            case 'default': this.toastyService.default(toastOptions); break;
            case 'info': this.toastyService.info(toastOptions); break;
            case 'success': this.toastyService.success(toastOptions); break;
            case 'wait': this.toastyService.wait(toastOptions); break;
            case 'error': this.toastyService.error(toastOptions); break;
            case 'warning': this.toastyService.warning(toastOptions); break;
            default: this.toastyService.default(toastOptions); break;
        }
    }

    public showErrorMessagge(msg: string = '', timeout: number = 5000) {
        const authTokens = this.storageService.getItem('auth-tokens');
        if (authTokens) {
            msg = msg || 'Ocurrio un error desconocido';
            this.showMessageToast('Error', msg, 'error', timeout);
        }
    }

    public showToastyError(error: any, msg: string = '', timeout: number = 5000) {
        const authTokens = this.storageService.getItem('auth-tokens');
        if (authTokens && error) {
            msg = error.success ? error.errorMessage : msg || 'Ocurrio un error desconocido';
            this.showMessageToast('Error', msg, 'error', timeout);
        }
    }

    public showSuccessMessagge(msg = '') {
        this.showMessageToast('Exito', msg, 'success');
    }
}
