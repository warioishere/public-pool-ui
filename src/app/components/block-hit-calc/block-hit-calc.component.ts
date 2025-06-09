import { Component, OnInit } from '@angular/core';
import { MempoolService } from '../../services/mempool.service';

@Component({
  selector: 'app-block-hit-calc',
  templateUrl: './block-hit-calc.component.html',
  styleUrls: ['./block-hit-calc.component.scss']
})
export class BlockHitCalcComponent implements OnInit {

  public avgHashrate14d: number | null = null;
  public difficulty: number | null = null;

  public customHashrate: number = 0; // H/s

  public probabilities: { period: string, probability: number }[] = [];
  public customProbabilities: { period: string, probability: number }[] = [];

  constructor(private mempoolService: MempoolService) { }

  ngOnInit(): void {
    this.mempoolService.getHashrateData('1y').subscribe((data: any) => {
      const rawHashrate = data.hashrates.map((h: any) => h.avgHashrate);
      const avg14dHashrate = rawHashrate.map((_: any, idx: number, arr: number[]) => {
        const start = Math.max(0, idx - 13);
        const slice = arr.slice(start, idx + 1);
        const sum = slice.reduce((s, v) => s + v, 0);
        return sum / slice.length;
      });
      this.avgHashrate14d = avg14dHashrate[avg14dHashrate.length - 1];
      this.difficulty = data.currentDifficulty;
      this.probabilities = this.calculateProbabilities(this.avgHashrate14d);
      this.updateCustomProbabilities();
    });
  }

  public updateCustomProbabilities(): void {
    if (this.customHashrate > 0 && this.difficulty) {
      this.customProbabilities = this.calculateProbabilities(this.customHashrate);
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
