import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-difficulty-adjustment',
  templateUrl: './difficulty-adjustment.component.html',
  styleUrls: ['./difficulty-adjustment.component.scss']
})
export class DifficultyAdjustmentComponent implements OnInit {

  public currentDifficulty: string = 'Loading...';
  public currentHashrate: number | string = 'Loading...';
  public difficultyChange: string = 'Loading...';
  public estimatedDaysUntilAdjustment: string = 'Loading...';

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.fetchPoolStats();
    this.fetchDifficultyAdjustment();
  }

  async fetchPoolStats() {
    try {
      const response = await fetch('https://mempool.space/api/v1/mining/hashrate/3d');
      const data = await response.json();
      this.ngZone.run(() => {
        this.currentDifficulty = (data.currentDifficulty / 1e12).toFixed(2);
        this.currentHashrate = data.currentHashrate;
      });
    } catch (error) {
      console.error('Error fetching pool stats:', error);
      this.ngZone.run(() => {
        this.currentDifficulty = 'Error';
        this.currentHashrate = 'Error';
      });
    }
    this.cdr.detectChanges();
  }

  async fetchDifficultyAdjustment() {
    try {
      const response = await fetch('https://mempool.space/api/v1/difficulty-adjustment');
      const data = await response.json();
      this.ngZone.run(() => {
        this.difficultyChange = data.difficultyChange.toFixed(2);
        const days = data.remainingTime / (1000 * 60 * 60 * 24);
        this.estimatedDaysUntilAdjustment = days.toFixed(2);
      });
    } catch (error) {
      console.error('Error fetching difficulty adjustment:', error);
      this.ngZone.run(() => {
        this.difficultyChange = 'Error';
        this.estimatedDaysUntilAdjustment = 'Error';
      });
    }
    this.cdr.detectChanges();
  }
}

