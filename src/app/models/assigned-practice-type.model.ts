export class AssignedPracticeType {
  practiceTypeNumber: number;
  practiceTypeName: string;
  itemPracticeName: string;
  itemPracticeNumber?: number;

  constructor(
    practiceTypeNumber: number,
    practiceTypeName: string,
    itemPracticeName: string,
    itemPracticeNumber?: number
  ) {
    this.practiceTypeNumber = practiceTypeNumber;
    this.practiceTypeName = practiceTypeName;
    this.itemPracticeName = itemPracticeName;
    this.itemPracticeNumber = itemPracticeNumber;
  }
}
