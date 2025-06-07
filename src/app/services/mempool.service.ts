import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MempoolService {
  private baseUrl = 'https://mempool.space/api/v1/mining/hashrate';

  constructor(private httpClient: HttpClient) {}

  public getHashrateData(period: string = '1y'): Observable<any> {
    return this.httpClient.get(`${this.baseUrl}/${period}`);
  }
}
