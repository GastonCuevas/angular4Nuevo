export class StringHTML {

    public static START_HTML =  `<!DOCTYPE html>
    <html>
        <head>
            <style>
                .card-title {
                    display: block;
                    line-height: 32px;
                    font-size: 24px;
                    font-weight: 400;
                    text-align: center;
                }

                .card-subtitle {
                    display: block;
                    font-size: medium;
                    margin-bottom: 1rem;
                    color: gray;
                    text-align: center;
                }

                hr {
                    border: none;
                    border-top: 2px solid #009688;
                    height: 6px;
                }

                table {
                    margin: 0 auto;
                    border-collapse: collapse;
                    width: max-content;
                }

                table.pvtTable thead tr th, table.pvtTable tbody tr th {
                    background-color: #e9ebeb;
                    border: 1px solid #000000;
                    font-size: 8pt;
                    padding: 5px;
                }

                table.pvtTable tbody tr td {
                    color: #3D3D3D;
                    padding: 5px;
                    background-color: #FFF;
                    border: 1px solid #CDCDCD;
                    vertical-align: top;
                    text-align: right;
                }
            </style>
        </head>
        <body>`;

    public static END_HTML = '</body> </html>';

}

type Parameter = {key: string; value: any};

export class Sentence {
    sql: string;
    parameters = new Array<Parameter>();
}

export class ExportDataXLSX {
    pvtTableExport: {
        xlsx: {
            data: any;
            mimeType: string;
            fileExtension: string;
            filename: string;
        }
    }
}

export class ExportDataXLSX2 {
    table: {
        xlsx: {
            data: any;
            mimeType: string;
            fileExtension: string;
            filename: string;
        }
    }
}