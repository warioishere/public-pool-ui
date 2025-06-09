import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor(
        private httpClient: HttpClient
    ) { }

    public getInfo() {
        return this.httpClient.get(`${environment.API_URL}/api/info`) as Observable<any>;
    }
    public getNetworkInfo() {
        return this.httpClient.get(`${environment.API_URL}/api/network`) as Observable<any>;
    }
    public getInfoChart(range?: '1d' | '1m' | '6m' | '12m') {
        let url = `${environment.API_URL}/api/info/chart`;
        if (range) {
            url += `?range=${range}`;
        }
        return this.httpClient.get(url) as Observable<any>;
    }
}
