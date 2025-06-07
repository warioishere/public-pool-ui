import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
    private httpClient: HttpClient
  ) { }

  public getClientInfo(address: string) {
    return this.httpClient.get(`${environment.API_URL}/api/client/${address}`);
  }
  public getClientInfoChart(address: string) {
    return this.httpClient.get(`${environment.API_URL}/api/client/${address}/chart`) as Observable<any[]>;
  }

  public getTotalShares(address: string) {
    return this.httpClient.get(`${environment.API_URL}/api/client/${address}/shares`) as Observable<{ totalShares: number }>;
  }

  public getWorkerShares(address: string) {
    return this.httpClient.get(`${environment.API_URL}/api/client/${address}/worker-shares`) as Observable<{ workerName: string, totalShares: number }[]>;
  }
}
