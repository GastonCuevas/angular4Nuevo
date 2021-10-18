import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { RequestService } from '.';
import { LookAndFeel, LookAndFeelConfig } from './../../models';
import { Sort, Paginator } from '../../+shared/util';

@Injectable()
export class LookAndFeelService {
  public baseUrl = 'api/lookAndFeel';
  lookConfig = new LookAndFeelConfig();

  constructor(private requestService: RequestService) {}

  getAll(paginator: Paginator, filterBy: any, sort: Sort): Observable<any> {
    let url = `${this.baseUrl}?pageSize=${paginator.pageSize}&pageNumber=${paginator.currentPage}`;
    if (filterBy) url += `&filterBy=${filterBy}`;
    if (sort) url += `&orderBy=${sort.sortBy}&ascending=${sort.ascending}`;
    return this.requestService.get(url);
  }

  get(code: string): Observable<any> {
    return this.requestService.get(`${this.baseUrl}/${code}`);
  }

  save(lookAndFeel: any): Observable<any> {
    return lookAndFeel.accountNumber != 0
      ? this.update(lookAndFeel)
      : this.insert(lookAndFeel);
  }

  update(lookAndFeel: LookAndFeel): Observable<any> {
    return this.requestService.put(
      `${this.baseUrl}/${lookAndFeel.code}`,
      lookAndFeel
    );
  }

  insert(lookAndFeel: LookAndFeel): Observable<any> {
    return this.requestService.post(`${this.baseUrl}`, lookAndFeel);
  }

  uploadImage(code: any, data: any): Observable<any> {
    return this.requestService.upFileServer(
      `api/image/config/upload/${code}`,
      data
    );
  }

  getLookAndFeel(): Observable<LookAndFeelConfig> {
    return this.requestService.get(`api/lookandfeel/config`).map((response) => {
      const newResponse: LookAndFeelConfig =
        response.model || new LookAndFeelConfig();
      if (newResponse.imageLogo)
        newResponse.imageLogo = `data:image/jpeg;base64,${newResponse.imageLogo}`;
      if (newResponse.imageLogin)
        newResponse.imageLogin = `data:image/jpeg;base64,${newResponse.imageLogin}`;
      return newResponse;
    });
  }
}
