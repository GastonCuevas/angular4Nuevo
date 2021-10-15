export class ImportDataField {
    id: number;
    importId: number;
    name: string;
    from: string;
    to: string;
    formula?: string;
    key?: boolean;
    foreignKey?: boolean;
    index?: number;
    valid: boolean;
}