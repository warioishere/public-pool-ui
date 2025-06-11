import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HalvingService {
  private readonly HALVING_INTERVAL = 210000;
  private readonly SECONDS_PER_BLOCK = 600;

  constructor(private http: HttpClient) {}

  async getHalvingEstimate(): Promise<{ blocksRemaining: number; eta: string }> {
    const heightRes: any = await firstValueFrom(
      this.http.get('https://mempool.space/api/blocks/tip/height')
    );
    const currentHeight = parseInt(heightRes, 10);

    const nextHalvingHeight =
      Math.ceil(currentHeight / this.HALVING_INTERVAL) * this.HALVING_INTERVAL;
    const blocksRemaining = nextHalvingHeight - currentHeight;
    const secondsRemaining = blocksRemaining * this.SECONDS_PER_BLOCK;

    const etaDate = new Date(Date.now() + secondsRemaining * 1000);
    return {
      blocksRemaining,
      eta: etaDate.toLocaleString('de-CH'),
    };
  }
}
