import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter, map, mergeMap, Observable, startWith } from 'rxjs';

import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    private params$!: Observable<any>;
    public model$!: Observable<any[]>;

    constructor(public layoutService: LayoutService, private router: Router, private activatedRoute: ActivatedRoute) { }

    ngOnInit() {

        const rootRoute = this.activatedRoute.root;
        const initialParams = this.extractRouteParams(rootRoute.snapshot);

        this.params$ = this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                map(() => this.activatedRoute),
                map((route) => {
                    while (route.firstChild) {
                        route = route.firstChild;
                    }
                    return route;
                }),
                filter((route) => route.outlet === 'primary'), // Adjust the outlet name if necessary
                mergeMap((route) => route.params),
                startWith(initialParams)
            );

        this.model$ = this.params$.pipe(map(params => {

            return [
                {
                    label: 'Dashboard',
                    items: [
                        { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [params.address] },
                        { label: 'Mining Hashrate Graph', icon: 'pi pi-chart-line', routerLink: [params.address, 'hashrate'] },
                        { label: 'Next Difficulty Adj', icon: 'pi pi-clock', routerLink: [params.address, 'difficulty-adjustment'] },
                        { label: 'Current Blockreward', icon: 'pi pi-bitcoin', routerLink: [params.address, 'block-reward'] },
                        { label: 'Block Hit Calc', icon: 'pi pi-calculator', routerLink: [params.address, 'block-hit-calc'] },
                        { label: 'Settings', icon: 'pi pi-fw pi-cog', routerLink: [params.address, 'settings'] }
                    ]
                }

            ];

        }))


    }

    private extractRouteParams(routeSnapshot: ActivatedRouteSnapshot): any {
        let route = routeSnapshot;
        let params = {};

        while (route.firstChild) {
            route = route.firstChild;
        }

        if (route && route.params) {
            params = route.params;
        }

        return params;
    }


}
