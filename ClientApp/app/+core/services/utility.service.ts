import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as moment from 'moment';

@Injectable()
export class UtilityService {

    constructor(
        private router: Router,
        private location: Location
    ) { }

    public navigate(path: string) {
        this.router.navigate([path]);
    }

    public navigateToLogin() {
        this.navigate('/login');
    }

    public navigateToError() {
        this.navigate('/error');
    }

    public navigateToHome() {
        this.navigate('');
    }

    public navigateToBack() {
        this.location.back();
    }

    public reloadPage() {
        window.location.reload();
    }

    public getDatePickerOptions() {
        return {
            format: 'dd/mm/yyyy',
            monthsFull: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            weekdaysFull: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            weekdaysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            weekdaysLetter: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
            today: 'Hoy',
            clear: 'Borrar',
            close: 'Cerrar',
            selectYears: 100,
            selectMonths: true,
            max: true,
            labelMonthNext: 'Próximo mes',
            labelMonthPrev: 'Mes anterior',
            labelMonthSelect: 'Selecciona un mes',
            labelYearSelect: 'Selecciona un año',
            closeOnSelect: true,
            formatSubmit: 'dd/mm/yyyy',
            // hiddenPrefix: 'lowDate',
            hiddenName: true
        }
    }

    public getTimePickerOptions() {
        return {
            default: 'now', // Set default time: 'now', '1:30AM', '16:30'
            fromnow: 0,       // set default time to * milliseconds from now (using with default = 'now')
            twelvehour: false, // Use AM/PM or 24-hour format
            donetext: 'OK', // text for done-button
            cleartext: 'Limpiar', // text for clear-button
            canceltext: 'Cancelar', // Text for cancel-button
            autoclose: false, // automatic close timepicker
            ampmclickable: true, // make AM PM clickable
            aftershow: function () { } //Function for after opening timepicker
        }
    }

    public formatDate(dateString: string, inputFormat?: string, outputFormat?: string): string {
        if (!dateString) return '';
        let date = !!inputFormat ? moment(dateString, inputFormat) : moment(dateString);
        return date.isValid() ? date.format(outputFormat || 'YYYY-MM-DD') : '';
    }

    public formatDateBE(dateString: string, inputFormat?: string, outputFormat?: string): string {
        if (!dateString) return '';
        let date = inputFormat ? moment(dateString, inputFormat) : moment(dateString, 'DD/MM/YYYY');
        return date.isValid() ? date.format(outputFormat || 'YYYY-MM-DD') : '';
    }

    public formatDateFE(dateString: string, inputFormat?: string, outputFormat?: string): string {
        if (!dateString) return '';
        let date = !!inputFormat ? moment(dateString, inputFormat) : moment(dateString);
        return date.isValid() ? date.format(outputFormat || 'DD/MM/YYYY') : '';
    }

    public substringDate(dateString: string): string {
        if (!dateString) return '';
        return dateString != "0" ? dateString.substr(0, 10) : "";
    }

    public substringDateFormatted(dateString: string): string {
        if (!dateString) return '';
        const day = dateString.substr(8, 2);
        const month = dateString.substr(5, 2);
        const year = dateString.substr(0, 4);
        return dateString != "0" ? day + '-' + month + '-' + year : "";
    }

    getNow(outputFormat?: string): string {
        return moment().format(outputFormat || 'DD/MM/YYYY')
    }

    getYearOld(date: string, inputFormat: string): number {
        const birthday = moment(date, inputFormat);
        return moment().diff(birthday,"years");
    }
}
