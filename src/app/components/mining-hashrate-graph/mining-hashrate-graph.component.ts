import { Component, OnInit } from '@angular/core';
import { MempoolService } from '../../services/mempool.service';

@Component({
  selector: 'app-mining-hashrate-graph',
  templateUrl: './mining-hashrate-graph.component.html',
  styleUrls: ['./mining-hashrate-graph.component.scss']
})
export class MiningHashrateGraphComponent implements OnInit {

  public chartData: any;
  public chartOptions: any;

  constructor(private mempoolService: MempoolService) { }

  ngOnInit(): void {
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
            drawBorder: false
          }
        },
        y: {
          ticks: {
            color: textColorSecondary,
            callback: (value: number) => {
              return (value / 1e18).toFixed(2) + ' EH/s';
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        },
        y1: {
          position: 'right',
          ticks: {
            color: textColorSecondary,
            callback: (value: number) => {
              return (value / 1e12).toFixed(0) + ' T';
            }
          },
          grid: {
            drawOnChartArea: false
          }
        }
      }
    };

    this.mempoolService.getHashrateData('1y').subscribe((data: any) => {
      const documentStyle = getComputedStyle(document.documentElement);

      const labels = data.hashrates.map((h: any) => new Date(h.timestamp * 1000));
      const rawHashrate = data.hashrates.map((h: any) => h.avgHashrate);

      const avg14dHashrate = rawHashrate.map((_: any, idx: number, arr: number[]) => {
        const start = Math.max(0, idx - 13);
        const slice = arr.slice(start, idx + 1);
        const sum = slice.reduce((s, v) => s + v, 0);
        return sum / slice.length;
      });

      const difficultyHistory = data.difficulty
        .map((d: any) => ({
          timestamp: d.timestamp ?? d.time,
          difficulty: d.difficulty
        }))
        .sort((a: any, b: any) => a.timestamp - b.timestamp);

      difficultyHistory.push({
        timestamp: Math.floor(labels[labels.length - 1].getTime() / 1000),
        difficulty: data.currentDifficulty
      });
      let diffIdx = 0;
      const difficulty = labels.map((label: Date) => {
        const ts = label.getTime() / 1000;
        while (diffIdx + 1 < difficultyHistory.length && ts >= difficultyHistory[diffIdx + 1].timestamp) {
          diffIdx++;
        }
        return difficultyHistory[diffIdx].difficulty;
      });

      const currentHashrate = rawHashrate;

      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Average Hashrate (14d)',
            data: avg14dHashrate,
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--primary-color'),
            borderColor: documentStyle.getPropertyValue('--primary-color'),
            tension: .4,
            pointRadius: 1,
            borderWidth: 1
          },
          {
            label: 'Difficulty',
            data: difficulty,
            yAxisID: 'y1',
            fill: false,
            backgroundColor: documentStyle.getPropertyValue('--yellow-600'),
            borderColor: documentStyle.getPropertyValue('--yellow-600'),
            tension: .4,
            pointRadius: 1,
            borderWidth: 1
          },
          {
            label: 'Current Hashrate',
            data: currentHashrate,
            fill: false,
            borderDash: [5,5],
            borderColor: documentStyle.getPropertyValue('--red-500'),
            tension: 0,
            pointRadius: 0,
            borderWidth: 1
          }
        ]
      };
    });
  }
}
