import * as moment from 'moment';

export class SelectedFilter {
    practice: number;
    practiceName: string;
    specialty: number;
    specialtyName: string;
    professional: number;
    professionalName: string;
    medicalOffice: number;
    type: string;
    date: moment.Moment;
    time: string;
    weekday: number;
    idTurn: any;
    uponTurn: boolean;

    constructor() {}
}
