import { Component } from '@angular/core';

import { LocalStorageService } from '../../services/local-storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  public stateOptions: any[] = [{ label: 'On', value: true }, { label: 'Off', value: false },];

  public particlesValue: boolean = true;
  public showBestDifficulty: boolean = true;
  public showTotalShares: boolean = true;
  public showNetworkDifficulty: boolean = true;
  public showNetworkHashrate: boolean = true;
  public showBlockHeight: boolean = true;

  constructor(private localStorageService: LocalStorageService) {
    this.particlesValue = this.localStorageService.getParticles();
    this.showBestDifficulty = this.localStorageService.getShowBestDifficulty();
    this.showTotalShares = this.localStorageService.getShowTotalShares();
    this.showNetworkDifficulty = this.localStorageService.getShowNetworkDifficulty();
    this.showNetworkHashrate = this.localStorageService.getShowNetworkHashrate();
    this.showBlockHeight = this.localStorageService.getShowBlockHeight();
  }

  public particlesChanged(newVal: boolean) {
    this.localStorageService.setParticles(newVal);
    this.particlesValue = newVal;
  }

  public showBestDifficultyChanged(newVal: boolean) {
    this.localStorageService.setShowBestDifficulty(newVal);
    this.showBestDifficulty = newVal;
  }

  public showTotalSharesChanged(newVal: boolean) {
    this.localStorageService.setShowTotalShares(newVal);
    this.showTotalShares = newVal;
  }

  public showNetworkDifficultyChanged(newVal: boolean) {
    this.localStorageService.setShowNetworkDifficulty(newVal);
    this.showNetworkDifficulty = newVal;
  }

  public showNetworkHashrateChanged(newVal: boolean) {
    this.localStorageService.setShowNetworkHashrate(newVal);
    this.showNetworkHashrate = newVal;
  }

  public showBlockHeightChanged(newVal: boolean) {
    this.localStorageService.setShowBlockHeight(newVal);
    this.showBlockHeight = newVal;
  }
}
