import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private PARTICLES = 'PARTICLES';
  private SHOW_BEST_DIFFICULTY = 'SHOW_BEST_DIFFICULTY';
  private SHOW_TOTAL_SHARES = 'SHOW_TOTAL_SHARES';
  private SHOW_NETWORK_DIFFICULTY = 'SHOW_NETWORK_DIFFICULTY';
  private SHOW_NETWORK_HASHRATE = 'SHOW_NETWORK_HASHRATE';
  private SHOW_BLOCK_HEIGHT = 'SHOW_BLOCK_HEIGHT';

  private _particles$: BehaviorSubject<boolean>;
  public particles$: Observable<boolean>;
  private _showBestDifficulty$: BehaviorSubject<boolean>;
  public showBestDifficulty$: Observable<boolean>;
  private _showTotalShares$: BehaviorSubject<boolean>;
  public showTotalShares$: Observable<boolean>;
  private _showNetworkDifficulty$: BehaviorSubject<boolean>;
  public showNetworkDifficulty$: Observable<boolean>;
  private _showNetworkHashrate$: BehaviorSubject<boolean>;
  public showNetworkHashrate$: Observable<boolean>;
  private _showBlockHeight$: BehaviorSubject<boolean>;
  public showBlockHeight$: Observable<boolean>;

  constructor() {
    this._particles$ = new BehaviorSubject<boolean>(this.getParticles());
    this.particles$ = this._particles$.asObservable().pipe(shareReplay({ refCount: true, bufferSize: 1 }));

    this._showBestDifficulty$ = new BehaviorSubject<boolean>(this.getShowBestDifficulty());
    this.showBestDifficulty$ = this._showBestDifficulty$.asObservable().pipe(shareReplay({ refCount: true, bufferSize: 1 }));

    this._showTotalShares$ = new BehaviorSubject<boolean>(this.getShowTotalShares());
    this.showTotalShares$ = this._showTotalShares$.asObservable().pipe(shareReplay({ refCount: true, bufferSize: 1 }));

    this._showNetworkDifficulty$ = new BehaviorSubject<boolean>(this.getShowNetworkDifficulty());
    this.showNetworkDifficulty$ = this._showNetworkDifficulty$.asObservable().pipe(shareReplay({ refCount: true, bufferSize: 1 }));

    this._showNetworkHashrate$ = new BehaviorSubject<boolean>(this.getShowNetworkHashrate());
    this.showNetworkHashrate$ = this._showNetworkHashrate$.asObservable().pipe(shareReplay({ refCount: true, bufferSize: 1 }));

    this._showBlockHeight$ = new BehaviorSubject<boolean>(this.getShowBlockHeight());
    this.showBlockHeight$ = this._showBlockHeight$.asObservable().pipe(shareReplay({ refCount: true, bufferSize: 1 }));
  }

  private get(key: string): string | null {
    return localStorage.getItem(key);
  }

  private set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  private remove(key: string): void {
    localStorage.removeItem(key);
  }


  public getParticles(): boolean {
    const result = this.get(this.PARTICLES);
    return result == null || JSON.parse(result)?.particles === true;
  }

  public setParticles(particles: boolean) {
    this.set(this.PARTICLES, JSON.stringify({ particles }));
    this._particles$.next(particles);

  }

  public getShowBestDifficulty(): boolean {
    const result = this.get(this.SHOW_BEST_DIFFICULTY);
    return result == null || JSON.parse(result)?.showBestDifficulty !== false;
  }

  public setShowBestDifficulty(value: boolean) {
    this.set(this.SHOW_BEST_DIFFICULTY, JSON.stringify({ showBestDifficulty: value }));
    this._showBestDifficulty$.next(value);
  }

  public getShowTotalShares(): boolean {
    const result = this.get(this.SHOW_TOTAL_SHARES);
    return result == null || JSON.parse(result)?.showTotalShares !== false;
  }

  public setShowTotalShares(value: boolean) {
    this.set(this.SHOW_TOTAL_SHARES, JSON.stringify({ showTotalShares: value }));
    this._showTotalShares$.next(value);
  }

  public getShowNetworkDifficulty(): boolean {
    const result = this.get(this.SHOW_NETWORK_DIFFICULTY);
    return result == null || JSON.parse(result)?.showNetworkDifficulty !== false;
  }

  public setShowNetworkDifficulty(value: boolean) {
    this.set(this.SHOW_NETWORK_DIFFICULTY, JSON.stringify({ showNetworkDifficulty: value }));
    this._showNetworkDifficulty$.next(value);
  }

  public getShowNetworkHashrate(): boolean {
    const result = this.get(this.SHOW_NETWORK_HASHRATE);
    return result == null || JSON.parse(result)?.showNetworkHashrate !== false;
  }

  public setShowNetworkHashrate(value: boolean) {
    this.set(this.SHOW_NETWORK_HASHRATE, JSON.stringify({ showNetworkHashrate: value }));
    this._showNetworkHashrate$.next(value);
  }

  public getShowBlockHeight(): boolean {
    const result = this.get(this.SHOW_BLOCK_HEIGHT);
    return result == null || JSON.parse(result)?.showBlockHeight !== false;
  }

  public setShowBlockHeight(value: boolean) {
    this.set(this.SHOW_BLOCK_HEIGHT, JSON.stringify({ showBlockHeight: value }));
    this._showBlockHeight$.next(value);
  }


}
