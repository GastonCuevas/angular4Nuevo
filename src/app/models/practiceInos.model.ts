export class PracticeInos {
    number?: number;
    practiceTypeNumber?: number;
    practiceTypeName?: string;
    code?: string;
    description?: string;
    disabled?: boolean;

    constructor(number?: number, practiceTypeNumber?: number, practiceTypeName?: string, code?: string, description?: string, disabled?: boolean) {
        this.number = number;
        this.practiceTypeNumber = practiceTypeNumber;
        this.practiceTypeName = practiceTypeName;
        this.code = code;
        this.description = description;
        this.disabled = true;
    }
}