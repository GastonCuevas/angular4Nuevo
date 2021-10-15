import { ProfessionalContractSchedule } from "../../models/professional-contract-schedule.model";

export class Schedule
{   weekday: number;
    weekdayName: string;
    schedules: Array<ProfessionalContractSchedule> = [];
    withSchedules: boolean;
}