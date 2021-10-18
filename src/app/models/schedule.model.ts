import { ProfessionalContractSchedule } from './professional-contract-schedule.model';

export class Schedule {
  weekdayName: string;
  schedules: Array<ProfessionalContractSchedule>;

  constructor(
    weekdayName: string,
    schedules: Array<ProfessionalContractSchedule> = []
  ) {
    this.weekdayName = weekdayName;
    this.schedules = schedules;
  }
}
