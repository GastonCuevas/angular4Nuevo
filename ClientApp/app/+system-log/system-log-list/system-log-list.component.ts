import { Component, OnInit, ViewChild } from '@angular/core';
import { IColumn } from '../../+shared/util';
import { CommonService, ToastyMessageService, UtilityService } from '../../+core/services';
import { SystemLogService } from '../system-log.service';
import { PaginatorComponent } from '../../+shared';

@Component({
  selector: 'app-system-log-list',
  templateUrl: './system-log-list.component.html',
  styleUrls: ['./system-log-list.component.scss']
})
export class SystemLogListComponent implements OnInit {
  isLoading = true;
  dataSource = new Array<String>();
  @ViewChild(PaginatorComponent) paginatorComponent: PaginatorComponent;
  sort = {
    sortBy: 'dateGeneration',
    ascending: true
  }

  constructor(
    public systemLogService: SystemLogService,
    public commonService: CommonService,
    private toastyMessageService: ToastyMessageService,
    private utilityService: UtilityService,
  ) { }

  ngOnInit() {
    this.paginatorComponent.paginator.currentPage = 1;
    this.loadSystemLogs();
  }

  private loadSystemLogs() {
    this.systemLogService.getSystemLogs(this.paginatorComponent.paginator, this.sort)
      .finally(() => this.isLoading = false)
      .subscribe(response => {
        this.paginatorComponent.loadPaginator(response.itemsCount);
        this.dataSource = response.model;
      },
        error => {
          this.toastyMessageService.showErrorMessagge('Ocurrio un error al obtener los datos.');
        });
  }

  actionReport(item: any) {
    let downloader = document.getElementById('downloader');
    this.systemLogService.getLogByName(item.i)
      .finally(() => this.isLoading = false)
      .subscribe(response => {
        const filename = response.model.name;
        const data = response.model.data;
        var a = document.createElement('a');
        if (navigator.msSaveBlob) { // IE10
          navigator.msSaveBlob(new Blob([data], { type: 'text/plain; encoding:utf-8' }), filename);
        } else if (URL && 'download' in a) { //html5 A[download]
          a.href = URL.createObjectURL(new Blob([data], { type: 'text/plain; encoding:utf-8' }));
          a.setAttribute('download', filename);
          let downloader = document.getElementById('downloader');
          if (downloader) {
            downloader.appendChild(a);
            a.click();
            downloader.removeChild(a);
          }
        }
      },
        error => {
          this.toastyMessageService.showErrorMessagge('Ocurrio un error al obtener los datos.');
        });
    item.e.stopPropagation();
  }

  onPageChange() {
    this.loadSystemLogs();
  }

}
