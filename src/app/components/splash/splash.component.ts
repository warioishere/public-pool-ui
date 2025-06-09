import { AfterViewInit, ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';

import { environment } from '../../../environments/environment';
import { HashSuffixPipe } from '../../pipes/hash-suffix.pipe';
import { AppService } from '../../services/app.service';
import { bitcoinAddressValidator } from '../../validators/bitcoin-address.validator';
import { AverageTimeToBlockPipe } from 'src/app/pipes/average-time-to-block.pipe';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit, AfterViewInit {

  public address: FormControl;

  public chartData$: Observable<any>;
  public blockData$: Observable<any>;
  public userAgents$: Observable<any>;
  public highScores$: Observable<any>;
  public uptime$: Observable<string>;

  public chartOptions: any;

  public stratumURL = '';

  public currentDifficulty: string = 'Lade...';
  public currentHashrate: number | string = 'Lade...';
  public difficultyChange: string = 'Lade...';
  public estimatedDaysUntilAdjustment: string = 'Lade...';

  public commitInfo: string = 'Loading...';

  private info$: Observable<any>;
  private networkInfo: any;

  public selectedCurrency: string = 'CHF';

  public averageHashrates: { period: string; value: number }[] = [];

  onCurrencyChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCurrency = target.value;
  }

  constructor(
    private appService: AppService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private http: HttpClient
  ) {
    this.info$ = this.appService.getInfo().pipe(shareReplay({ refCount: true, bufferSize: 1 }));

    if (environment.STRATUM_URL.length > 1) {
      this.stratumURL = environment.STRATUM_URL;
    } else {
      this.stratumURL = window.location.hostname + ':3333';
    }

    this.blockData$ = this.info$.pipe(map(info => info.blockData));
    this.userAgents$ = this.info$.pipe(map(info => info.userAgents));
    this.highScores$ = this.info$.pipe(map(info => info.highScores));
    this.uptime$ = this.info$.pipe(map(info => info.uptime));

    this.chartData$ = combineLatest([
      this.appService.getInfoChart(),
      this.appService.getInfoChart('1m'),
      this.appService.getNetworkInfo()
    ]).pipe(
      map(([data1d, data1m, networkInfo]) => {
        this.networkInfo = networkInfo;
        this.calculateAverageHashrates(data1d, data1m);
        const documentStyle = getComputedStyle(document.documentElement);
        return {
          labels: data1d.map((d: any) => d.label),
          datasets: [
            {
              label: 'Public-Pool Hashrate',
              data: data1d.map((d: any) => d.data),
              fill: false,
              backgroundColor: documentStyle.getPropertyValue('--primary-color'),
              borderColor: documentStyle.getPropertyValue('--primary-color'),
              tension: .4,
              pointRadius: 1,
              borderWidth: 1
            }
          ]
        }
      })
    );

    this.address = new FormControl(null, bitcoinAddressValidator());

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.chartOptions = {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'day'
          },
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
            display: true
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: (value: number) => {
              return HashSuffixPipe.transform(value) + " - " + AverageTimeToBlockPipe.transform(value, this.networkInfo.difficulty);
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          },
          type: 'logarithmic',
        }
      }
    };
  }

  ngOnInit(): void {
    this.fetchPoolStats();
    this.fetchDifficultyAdjustment();
    this.fetchCommitInfo();
  }

  ngAfterViewInit(): void {
    this.setupBTCPayControls();
  }

  private setupBTCPayControls(): void {
    const minusButtons = document.querySelectorAll(".btcpay-form .plus-minus");
    minusButtons.forEach(el => {
      if (!el.getAttribute('data-initialized')) {
        el.addEventListener('click', (event) => {
          event.preventDefault();
          const root = (el as HTMLElement).closest('.btcpay-form');
          const input = root?.querySelector('.btcpay-input-price') as HTMLInputElement;
          const step = parseInt(el.getAttribute('data-step') || '1');
          const min = parseInt(el.getAttribute('data-min') || '1');
          const max = parseInt(el.getAttribute('data-max') || '20');
          const type = el.getAttribute('data-type');
          const price = parseInt(input.value) || min;

          if (type === '-') {
            input.value = String(Math.max(price - step, min));
          } else if (type === '+') {
            input.value = String(Math.min(price + step, max));
          }
        });
        el.setAttribute('data-initialized', 'true');
      }
    });

    const priceInputs = document.querySelectorAll(".btcpay-form .btcpay-input-price");
    priceInputs.forEach(el => {
      if (!el.getAttribute('data-initialized')) {
        el.addEventListener('input', (event) => {
          const input = event.target as HTMLInputElement;
          const min = parseInt(input.getAttribute('min') || '1');
          const max = parseInt(input.getAttribute('max') || '20');
          let val = parseInt(input.value);
          if (isNaN(val)) val = min;
          input.value = String(Math.max(min, Math.min(max, val)));
        });
        el.setAttribute('data-initialized', 'true');
      }
    });

    // Workaround für "input type=image" -> form submit erzwingen
    const submitImage = document.querySelector('.btcpay-form input[type="image"]') as HTMLInputElement;
    if (submitImage && !submitImage.hasAttribute('data-initialized')) {
      submitImage.addEventListener('click', (event) => {
        event.preventDefault();
        const form = submitImage.closest('form') as HTMLFormElement;
        if (form) {
          form.setAttribute('target', '_blank');
          form.submit();
        }
      });
      submitImage.setAttribute('data-initialized', 'true');
    }
  }

  private calculateAverageHashrates(data1d: any[], data1m: any[]): void {
    const parseData = (arr: any[]) => arr.map(d => ({ time: new Date(d.label).getTime(), value: Number(d.data) }));

    const d1 = parseData(data1d);
    const d1m = parseData(data1m);

    const now = Date.now();

    const averageSince = (data: { time: number; value: number }[], hours: number) => {
      const start = now - hours * 3600 * 1000;
      const relevant = data.filter(v => v.time >= start);
      return relevant.length ? relevant.reduce((s, v) => s + v.value, 0) / relevant.length : 0;
    };

    const averageLast = (data: { value: number }[], count: number) => {
      const slice = data.slice(-count);
      return slice.length ? slice.reduce((s, v) => s + v.value, 0) / slice.length : 0;
    };

    this.averageHashrates = [
      // For the most recent 10 min take the last reported value instead of
      // averaging a short interval which may contain no datapoints.
      { period: '10Min', value: d1[d1.length - 1]?.value ?? 0 },
      { period: '30Min', value: averageLast(d1, 3) },
      { period: '1HR', value: averageLast(d1, 6) },
      { period: '4HR', value: averageSince(d1, 4) },
      { period: '12HR', value: averageSince(d1, 12) },
      { period: '1D', value: averageSince(d1, 24) },
      { period: '14D', value: averageSince(d1m, 14 * 24) },
      { period: '1M', value: averageSince(d1m, 30 * 24) }
    ];
  }

  async fetchPoolStats() {
    try {
      const response = await fetch("https://mempool.space/api/v1/mining/hashrate/3d");
      const data = await response.json();

      this.ngZone.run(() => {
        this.currentDifficulty = (data.currentDifficulty / 1e12).toFixed(2);
        this.currentHashrate = data.currentHashrate;
      });

    } catch (error) {
      console.error("Fehler beim Abrufen der Pool-Statistiken:", error);
      this.ngZone.run(() => {
        this.currentDifficulty = "Fehler";
        this.currentHashrate = "Fehler";
      });
    }
    this.cdr.detectChanges();
  }

  async fetchDifficultyAdjustment() {
    try {
      const response = await fetch("https://mempool.space/api/v1/difficulty-adjustment");
      const data = await response.json();

      this.ngZone.run(() => {
        this.difficultyChange = data.difficultyChange.toFixed(2);
        const daysUntilAdjustment = data.remainingTime / (1000 * 60 * 60 * 24);
        this.estimatedDaysUntilAdjustment = daysUntilAdjustment.toFixed(2);
      });

    } catch (error) {
      console.error("Fehler beim Abrufen der Schwierigkeitsanpassungsdaten:", error);
      this.ngZone.run(() => {
        this.difficultyChange = "Fehler";
        this.estimatedDaysUntilAdjustment = "Fehler";
      });
    }
    this.cdr.detectChanges();
  }

  fetchCommitInfo(): void {
     const timestamp = Date.now();
     this.http.get(`/commit.txt?t=${timestamp}`, { responseType: 'text' }).subscribe({
       next: (data) => {
         this.commitInfo = data;
         this.cdr.detectChanges();
       },
       error: () => {
         this.commitInfo = 'Version info unavailable';
         this.cdr.detectChanges();
       }
     });
   }
}
