import { ActionTable } from "../../+shared/util";

export class TurnModelForList {
    numInt: number;
    pacient: string;
    professional: string;
    specialty: string;
    specialtyId: number;
    practice: string;
    medicalInsurance: string;
    date: string;
    time: string;
    turnState: string;
    uponTurn: boolean;
    uponTurnText: String;
    chargedTurn: boolean;
    initialRowText: string;
    allowUponTurn: boolean;
    //others
    disableBtnAssist: boolean;
    action = new ActionTable();
    hideBtns?: boolean;
    observation: string;
}