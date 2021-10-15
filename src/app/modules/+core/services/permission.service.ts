import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable()
export class PermissionService {

    constructor(
        private storageService: StorageService
    ) { }

    getItems(array: Array<any>) {
        return array.reduce((arr, elem) => {
            if (elem.hasOwnProperty('leaves')) arr = arr.concat(elem.leaves);
            if (elem.hasOwnProperty('children')) arr = arr.concat(this.getItems(elem.children));
            if (elem.hasOwnProperty('items')) arr = arr.concat(elem.items);
            return arr;
        }, []);
    }

    savePermissions(response: Array<any>) {
        const items = this.getItems(response);
        items.forEach((item: any) => this.storageService.setItem(item.codigo, item.actions));
    }

    getPermissions(code: string) {
        const actions: string[] = this.storageService.getItem(code) || [];
        const isRoot = this.isRoot();
        return {
            canAdd: isRoot || actions.some(x => x.toUpperCase().startsWith('ALTA')),
            canEdit: isRoot || actions.some(x => x.toUpperCase().startsWith('MODI')),
            candDelete: isRoot || actions.some(x => x.toUpperCase().startsWith('ELIM')),
            canPrint: isRoot || actions.some(x => x.toUpperCase().startsWith('IMPR'))
        };
    }

    hasPermission(code: string, action?: string): boolean {
        const actions: string[] = this.storageService.getItem(code);
        if (!actions) return false;
        if (!action) return true;
        return actions.some(x => x.toUpperCase().includes(action.toUpperCase()));
    }

    isRoot(): boolean {
        return this.storageService.getItem('isRoot') || false;
    }
}
