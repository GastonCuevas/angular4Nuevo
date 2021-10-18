import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    setItem(key: string, value: any) {
        try {
            if (value === null || value === undefined) value = '';
            if (typeof value !== 'string') value = JSON.stringify(value);
            localStorage.setItem(`HIS-${key}`, value);
        } catch (e) {
            console.error(e);
        }
    }

    getItem(key: string) {
        try {
            const value = localStorage.getItem(`HIS-${key}`);
            if (!value) return value;
            try {
                return JSON.parse(value);
            } catch (ex) {
                return value;
            }
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    removeItem(key: string) {
        localStorage.removeItem(key);
    }

    clear() {
        try {
            const keys: string[] = [];
            for (var i = 0, len = localStorage.length; i < len; ++i) {
                const key = localStorage.key(i) || '';
                if (key.includes('HIS-')) keys.push(key);
            }
            keys.forEach(x => localStorage.removeItem(x));
        } catch (e) {
            console.error(e);
        }
    }
}
