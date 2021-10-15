import { Component, OnInit, ElementRef, OnDestroy, ViewEncapsulation, Output, EventEmitter, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs/Rx';

import { AppState } from '../../app-store';
import { AuthState } from '../../+core/auth/auth-store/auth.store';
import { ToastyMessageService, CommonService, LookAndFeelService, NavBarService } from '../../+core/services';
import { LoginService } from './../../+login/login.service';
import { Navbar } from '../../models/navbar/navbar.model';
import { PermissionService } from '../../+core/services/permission.service';
import { AuthTokenService } from '../../+core/auth/auth-token.service';
import { ClinicHistoryService } from '../../+clinic-history/clinic-history.service';
import { DiagnosticService } from '../../+diagnostic/diagnostic.service';

declare var $: any;

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: ['./navmenu.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavMenuComponent implements OnInit, OnDestroy {
    authState$: Observable<AuthState>;
    user: any;
    groupPermissions: Array<any> = [];
    nodes: Array<any> = [];
    navbars = new Array<Navbar>();
    first: string;
    second: string;
    third: string;
    logo = 'images/navbar-logo.png';
    applicationTitle = 'HIS - Clinica Mental';
    version: string;
    subcription = new Subscription();
    openSideBar: boolean = true;
    @Output() handleSideBar: EventEmitter<any> = new EventEmitter();

    constructor(
        private store: Store<AppState>,
        private loginService: LoginService,
        private toastService: ToastyMessageService,
        private navBarService: NavBarService,
        private el: ElementRef,
        private router: Router,
        public commonService: CommonService,
        public look: LookAndFeelService,
        public _permissionService: PermissionService,
        public authService: AuthTokenService,
        private _route: ActivatedRoute,
        private _clinicHistoryService: ClinicHistoryService,
        private _diagnosticService: DiagnosticService
    ) {
    }

    ngOnInit() {
        $(this.el.nativeElement).find('.button-collapse').sideNav({
            edge: 'left',
            closeOnClick: false,
            draggable: true,
            onOpen: ((resp: any) => {
                this.handleSideBar.emit(true);
            }),
            onClose: ((resp: any) => {
                this.handleSideBar.emit(false);
            })
        });
        this.authState$ = this.store.select(state => state.auth);
        this.authState$
            .subscribe(state => {
                this.user = state.profile;
            });
        this.getPermissions();
        if (window.innerWidth > 1200) {
            $('.button-collapse').sideNav('show');
        }
        this.handleEvent();
    }

    handleEvent() {
        $(this).each(function () {
            var menu = $("#slide-out");
            menu.on("click.itemclick", "a:not(.collapsible-header)", function () {
                if (window.innerWidth <= 1200) {
                    $('.button-collapse').sideNav('hide');
                }
            });
        });
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        if (window.innerWidth <= 1200) {
            $('.button-collapse').sideNav('hide');
        }
    }


    getPermissions() {
        this.navBarService.getMenu(this.user.nameid)
            .subscribe((response: Array<any>) => {
                this._permissionService.savePermissions(response);
                this.nodes = response;
                const url = this.router.url;
                this.configBreadcrumbs(url);
                this.navbars = this.nodes;
                this.navBarService.setNavbars(this.nodes);
            },
            error => this.toastService.showErrorMessagge('Ocurrio un error al cargar el menu'));
    }

    private configBreadcrumbs(url: string) {
        if (!url) return;
        const array: string[] = [];
        if (this.getLeaves(this.nodes, url.toLowerCase(), array)) this.setBreadcrumbs(array[array.length - 1], array[array.length - 2], array[array.length - 3]);
    }

    private getLeaves(array: Array<any>, url: string, result: Array<string>): boolean {
        return array.some((elem) => {
            if (elem.hasOwnProperty('leaves')) {
                const find = this.getLeaves(elem.leaves, url, result) || this.getLeaves(elem.children, url, result);
                if (find) result.push(elem.name);
                return find;
            }
            var webmnu = this.parseUrl(elem.webmnu.toLowerCase());
            var b = url.includes(webmnu);
            if (b) result.push(elem.label);
            return b;
        });
    }

    goToHome() {
        this.setBreadcrumbs('', '');
    }

    logOut() {
        this.loginService.logout(this.user.nameid)
            .subscribe(response => { }, error => this.toastService.showErrorMessagge('Ocurrio un error al cerrar sesión'));
    }

    private isNotImpl(url: string): boolean {
        return !this.router.config.some((r: any) => {
            const path = r.path.split(':')[0];
            return path && url.indexOf(path) !== -1;
        });
    }

    private isActive(url: string): boolean {
        url = this.parseUrl(url);
        return this.router.url === url;
    }

    private parseUrl(url: string): string {
        if (url.includes('dinamica/vista')) {
            url = url.replace('dinamica/vista', 'dynamic-view');
        } else if (url.includes('vista-dinamica-v2-aux')) {
            url = url.replace('vista-dinamica-v2-aux', 'vista-dinamica');
        } else if (url.includes('router-to-dynamic')) {
            url = url.replace('router-to-dynamic', 'vista-dinamica');
        }
        if (url[0] !== '/') url = `/${url}`;
        return url;
    }

    private changePage(first: string, second: string, third?: string) {
        this._clinicHistoryService.reset();
        this._diagnosticService.reset();
        this.setBreadcrumbs(first, second, third);
    }

    private setBreadcrumbs(first: string, second: string, third?: string) {
        this.first = first;
        this.second = second;
        this.third = third || '';
    }

    ngOnDestroy(): void {
        this.subcription.unsubscribe();
    }
}