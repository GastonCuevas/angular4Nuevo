export class ProfessionalContractSchedule {
    numint = 0;
    contractNumber: number;
    specialtyNumber: number;
    specialtyName: string;
    weekday: number;
    weekdayName: string;
    weekdayFrom: number;
    weekdayTo: number;
    hourFrom: string;
    hourTo: string;
    time: number;
    consultingRoom?: number;
    order: number;
    index: number;
    withTurns = false;
}