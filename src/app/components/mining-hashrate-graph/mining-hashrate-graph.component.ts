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
              return (value / 1e12).toFixed(2) + ' TH';
            }
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };

    this.mempoolService.getHashrateData('1y').subscribe((data: any) => {
      const documentStyle = getComputedStyle(document.documentElement);
      const labels = data.hashrates.map((h: any) => new Date(h.timestamp * 1000));
      const avgHashrate = data.hashrates.map((h: any) => h.avgHashrate);
      const difficulty = data.difficulty.map((d: any) => d.difficulty);
      const currentHashrate = data.hashrates.map(() => data.currentHashrate);

      this.chartData = {
        labels,
        datasets: [
          {
            label: 'Average Hashrate',
            data: avgHashrate,
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
            borderColor: documentStyle.getPropertyValue('--green-500'),
            tension: 0,
            pointRadius: 0,
            borderWidth: 1
          }
        ]
      };
    });
  }
}
