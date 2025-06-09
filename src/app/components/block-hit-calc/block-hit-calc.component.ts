import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';
import { AppService } from '../../services/app.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-block-hit-calc',
  templateUrl: './block-hit-calc.component.html',
  styleUrls: ['./block-hit-calc.component.scss']
})
export class BlockHitCalcComponent implements OnInit {

  public avgHashrate14d: number = 0;
  public difficulty: number = 0;

  public customHashrate: number = 0; // TH/s

  public probabilities: { period: string, probability: number }[] = [];
  public customProbabilities: { period: string, probability: number }[] = [];

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    const address = this.route.snapshot.params['address'];
    combineLatest([
      this.clientService.getClientInfoChart(address),
      this.appService.getNetworkInfo()
    ]).subscribe(([chartData, networkInfo]) => {
      const rawHashrate = chartData.map((d: any) => Number(d.data));
      const avg14dHashrate = rawHashrate.map((_: any, idx: number, arr: number[]) => {
        const start = Math.max(0, idx - 13);
        const slice = arr.slice(start, idx + 1);
        const sum = slice.reduce((s, v) => s + v, 0);
        return sum / slice.length;
      });
      this.avgHashrate14d = avg14dHashrate[avg14dHashrate.length - 1];
      this.difficulty = networkInfo.difficulty;
      this.probabilities = this.calculateProbabilities(this.avgHashrate14d);
      this.updateCustomProbabilities();
    });
  }

  public updateCustomProbabilities(): void {
    if (this.customHashrate > 0 && this.difficulty > 0) {
      // convert TH/s to H/s
      this.customProbabilities = this.calculateProbabilities(this.customHashrate * 1e12);
    } else {
      this.customProbabilities = [];
    }
  }

  private calculateProbabilities(hashrate: number): { period: string, probability: number }[] {
    if (!this.difficulty) return [];
    const hashesPerDifficulty = Math.pow(2, 32);
    const blockTime = (this.difficulty * hashesPerDifficulty) / hashrate; // seconds

    const periods = [
      { label: 'Day', seconds: 86400 },
      { label: 'Week', seconds: 86400 * 7 },
      { label: 'Month', seconds: 86400 * 30 },
      { label: 'Year', seconds: 86400 * 365 }
    ];

    return periods.map(p => ({
      period: p.label,
      probability: 1 - Math.exp(-p.seconds / blockTime)
    }));
  }
}
