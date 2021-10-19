import { Store } from '@ngrx/store';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

//import { AppState } from './../../app-store';
import { AuthState } from '../../+core/auth/auth-store/auth.store';
import { AuthTokenService } from '../../+core/auth/auth-token.service';
import { LoginService } from '../../+login/login.service';
import { ToastyMessageService, LookAndFeelService } from '../../+core/services';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  authState$: Observable<AuthState>;
  permissions: Array<any>;
  group: Array<any> = [];
  isOpen = true;
  subcription = new Subscription();
  result: Observable<number> | null;

  constructor(
    authState$: Observable<AuthState>,
    permissions: Array<any>,
    result: Observable<number> | null,
    //public store: Store<AppState>,
    private tokens: AuthTokenService,
    private toasty: ToastyMessageService,
    public look: LookAndFeelService,
    private login: LoginService
  ) {
    this.authState$ = authState$;
    this.permissions = permissions;
    this.result = result;
  }

  ngOnInit(): void {
    this.setTokens();
    this.loadStyle();
    this.result = this.tokens.startupTokenRefresh();
    //this.authState$ = this.store.select((state) => state.auth);
    if (!this.result) return;
    this.refreshToken();
  }

  ngOnDestroy(): void {
    this.resetResult();
  }

  @HostListener('window:beforeunload', ['$event'])
  doSomething($event: any) {
    this.resetResult();
  }

  private setTokens() {
    this.login.response.subscribe((response) => {
      if (!response) {
        this.resetResult();
        return;
      }
      this.tokens.setTokens(response);
      if (!this.result) {
        this.result = this.tokens.getTokenExpireTime(response.token);
        this.refreshToken();
      }
    });
  }

  private refreshToken() {
    if (!this.result) return;
    this.subcription = this.result.subscribe((x) => {
      var now = new Date();
      console.log('refresh token -> ', x, ' date -> ', now.toLocaleString());
      now.setMilliseconds(240000);
      console.log('call in ->', now.toLocaleString());
      this.login
        .refreshToken()
        .subscribe(undefined, (error: any) => this.resetResult());
    });
  }

  private loadStyle() {
    this.look.getLookAndFeel().subscribe(
      (result) => (this.look.lookConfig = Object.assign({}, result)),
      (error) =>
        this.toasty.showToastyError(
          error,
          'Ocurrio un error al cargar los estilos.'
        )
    );
  }

  private resetResult() {
    this.subcription.unsubscribe();
    this.result = null;
  }

  changeStateSideBar(value: boolean) {
    this.isOpen = value;
  }
}
