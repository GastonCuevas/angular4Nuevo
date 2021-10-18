import { Injectable } from '@angular/core';
import { Navbar } from '../../models/navbar/navbar.model';
import { Item } from '../../models/navbar/item.model';
import { RequestService } from './request.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class NavBarService {
  private behaviorSubject: BehaviorSubject<Array<Navbar>>;

  constructor(private requestService: RequestService) {
    this.behaviorSubject = new BehaviorSubject(new Array<Navbar>());
  }

  public setNavbars(navbars: Array<Navbar>) {
    this.behaviorSubject.next(navbars);
  }

  public getNavbars(): BehaviorSubject<Array<Navbar>> {
    return this.behaviorSubject;
  }

  public getMenu(userId: number): Observable<any> {
    return this.requestService.get(`/api/user/menu/${userId}`);
  }

  public findItem(url: any, code: any): any {
    url = url || '';
    code = code || '';
    const array = this.behaviorSubject.value;
    if (!array.length) return null;
    return this.findLeave(array, url.trim().toLowerCase(), code);
  }

  private findLeave(array: Array<any>, url: string, code: string): any {
    for (let d of array) {
      if (d.hasOwnProperty('leaves')) {
        const result =
          this.findLeave(d.leaves, url, code) ||
          this.findLeave(d.children, url, code);
        if (!!result) return result;
        continue;
      }
      if (
        (!!url && url.includes(d.webmnu.trim().toLowerCase())) ||
        (!!code && code === d.codigo)
      )
        return d;
    }
    return null;
  }
}
