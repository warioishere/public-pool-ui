import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

import { LocalStorageService } from '../../services/local-storage.service';
import { bitcoinAddressValidator } from '../../validators/bitcoin-address.validator';

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

  public addresses$!: any;
  public newAddress!: FormControl;
  public currentAddress!: string;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.particlesValue = this.localStorageService.getParticles();
    this.showBestDifficulty = this.localStorageService.getShowBestDifficulty();
    this.showTotalShares = this.localStorageService.getShowTotalShares();
    this.showNetworkDifficulty = this.localStorageService.getShowNetworkDifficulty();
    this.showNetworkHashrate = this.localStorageService.getShowNetworkHashrate();
    this.showBlockHeight = this.localStorageService.getShowBlockHeight();
    this.addresses$ = this.localStorageService.addresses$;
    this.newAddress = new FormControl('', bitcoinAddressValidator());
    this.currentAddress = this.route.parent?.snapshot.params['address'];
    if (this.currentAddress) {
      this.localStorageService.addAddress(this.currentAddress);
    }
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

  public addAddress() {
    if (this.newAddress.valid) {
      this.localStorageService.addAddress(this.newAddress.value);
      this.newAddress.reset();
    }
  }

  public switchAddress(address: string) {
    this.router.navigate(['app', address]);
  }
}
