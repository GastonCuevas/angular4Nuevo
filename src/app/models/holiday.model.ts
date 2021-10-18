export class Holiday {
  number: number;
  date: Date | string;
  description?: string;

  constructor(number: number = 0, date: Date | string, description?: string) {
    this.number = number;
    this.date = date;
    this.description = description;
  }
}
