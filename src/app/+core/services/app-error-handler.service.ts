import { Injectable, Inject, Injector, ErrorHandler } from '@angular/core';
import { Router } from '@angular/router';
import { ToastyMessageService, LoadingGlobalService } from '.';

@Injectable()
export class AppErrorHandlerService extends ErrorHandler {
  constructor(
    private injector: Injector,
    private toastyMessageService: ToastyMessageService,
    private loadingGlobalService: LoadingGlobalService
  ) {
    super();
  }

  public get router(): Router {
    //this creates router property on your service.
    return this.injector.get(Router);
  }

  handleError(error: Error) {
    const copy_error = `Nombre: ${error.name} - Mensaje: ${
      error.message
    } - Stack: ${error.stack || 'sin stack'}  `;
    console.error(copy_error);
    if (
      this.router.url == '/camas/internaciones' ||
      this.router.url == '/historiaclinica/listado' ||
      this.router.url == '/liquidacion/profesionales' ||
      this.router.url == '/liquidacion/os' ||
      this.router.url == '/liquidacion/os/cobro'
    ) {
      this.loadingGlobalService.hideLoading();
      this.router.navigate(['']);
      this.toastyMessageService.showErrorMessagge(
        'Reporte con errores: ' + error.message
      );
    }
  }
}
