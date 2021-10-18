export class Holiday {
  date: Date | string;
  description?: string;
  number?: number = 0;

  constructor(date: Date | string, description?: string, number?: number) {
    this.date = date;
    this.description = description;
    this.number = number;
  }
}
