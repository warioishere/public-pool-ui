import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AppService } from '../../services/app.service';
import { ClientService } from '../../services/client.service';

@Component({
  selector: 'app-block-hit-calc',
  templateUrl: './block-hit-calc.component.html',
  styleUrls: ['./block-hit-calc.component.scss']
})
export class BlockHitCalcComponent implements OnInit, OnDestroy {

  public avgHashrate1d: number = 0;
  public difficulty: number = 0;

  public customHashrate: number = 0; // TH/s

  public probabilities: { period: string, probability: number }[] = [];
  public customProbabilities: { period: string, probability: number }[] = [];

  private destroy$ = new Subject<void>();

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
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([chartData, networkInfo]) => {
        const rawHashrate = chartData.map((d: any) => Number(d.data));
        const entriesPerDay = 24 * 6; // 10 minute samples
        const slice = rawHashrate.slice(-entriesPerDay);
        const sum = slice.reduce((s, v) => s + v, 0);
        this.avgHashrate1d = slice.length ? sum / slice.length : 0;
        this.difficulty = networkInfo.difficulty;
        this.probabilities = this.calculateProbabilities(this.avgHashrate1d);
        this.updateCustomProbabilities();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
