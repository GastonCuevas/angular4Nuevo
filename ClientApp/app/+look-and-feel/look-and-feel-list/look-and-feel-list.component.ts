import { Component } from '@angular/core';

import { UtilityService, LookAndFeelService } from '../../+core/services';
import { IColumn } from "../../+shared/util";
import { LookAndFeel } from '../../models';

@Component({
    selector: 'app-look-and-feel-list',
    templateUrl: './look-and-feel-list.component.html',
    styleUrls: ['./look-and-feel-list.component.scss']
})
export class LookAndFeelListComponent {

    lookAndFeelCode: string;

    columns: Array<IColumn> = [
        { header: "Codigo", property: "code" },
        { header: "Seccion", property: "section", disableSorting: true },
        { header: "Color de Fuente", property: "fontColor", disableSorting: true },
        { header: "Familia de Fuente", property: "fontFamily", disableSorting: true },
        { header: "Color de fondo", property: "backgroundColor", disableSorting: true }
    ]

    constructor(
        public lookAndFeelService: LookAndFeelService,
        private utilityService: UtilityService
    ) {}

    onActionClick(event: {action: string, item: LookAndFeel}) {
        switch (event.action) {
            case 'new':
                this.utilityService.navigate('sisarchivos/lookandfeel/formulario');
                break;
            case 'edit':
                this.utilityService.navigate(`sisarchivos/lookandfeel/formulario/${event.item.companyNumber}/${event.item.code}`);
                break;

            default:
                break;
        }
    }

}
