import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-block-reward',
  templateUrl: './current-block-reward.component.html',
  styleUrls: ['./current-block-reward.component.scss']
})
export class CurrentBlockRewardComponent implements OnInit {

  public blockHeight: number | string = 'Loading...';
  public avgRewards: number | string = 'Loading...';

  public priceUSD: number | string = 'Loading...';
  public priceEUR: number | string = 'Loading...';
  public priceCHF: number | string = 'Loading...';

  public rewardUSD: number | string = 'Loading...';
  public rewardEUR: number | string = 'Loading...';
  public rewardCHF: number | string = 'Loading...';

  constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.fetchBlockReward();
  }

  async fetchBlockReward() {
    try {
      const response = await fetch('https://mempool.space/api/v1/mining/blocks/rewards/24h');
      const data = await response.json();
      const last = Array.isArray(data) ? data[data.length - 1] : data;
      const rewards = last.avgRewards;
      this.ngZone.run(() => {
        this.blockHeight = last.avgHeight ?? last.height ?? 'N/A';
        this.avgRewards = rewards;
      });
      await this.fetchPrices(rewards / 1e8);
    } catch (error) {
      console.error('Error fetching block reward:', error);
      this.ngZone.run(() => {
        this.blockHeight = 'Error';
        this.avgRewards = 'Error';
      });
    }
    this.cdr.detectChanges();
  }

  async fetchPrices(rewardBtc: number) {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,chf');
      const data = await response.json();
      const price = data.bitcoin;
      this.ngZone.run(() => {
        this.priceUSD = price.usd;
        this.priceEUR = price.eur;
        this.priceCHF = price.chf;
        this.rewardUSD = rewardBtc * price.usd;
        this.rewardEUR = rewardBtc * price.eur;
        this.rewardCHF = rewardBtc * price.chf;
      });
    } catch (error) {
      console.error('Error fetching prices:', error);
      this.ngZone.run(() => {
        this.priceUSD = this.priceEUR = this.priceCHF = 'Error';
        this.rewardUSD = this.rewardEUR = this.rewardCHF = 'Error';
      });
    }
    this.cdr.detectChanges();
  }
}
