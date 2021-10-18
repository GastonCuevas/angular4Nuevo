export class Cube {
  number: number;
  code: string;
  name: string;
  query: string;
  dateFrom: string;
  dateTo: string;
  col: string;
  row: string;

  constructor(
    number: number,
    code: string,
    name: string,
    query: string,
    dateFrom: string,
    dateTo: string,
    col: string,
    row: string
  ) {
    this.number = number;
    this.code = code;
    this.name = name;
    this.query = query;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
    this.col = col;
    this.row = row;
  }
}
