import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private LANGUAGE_KEY = 'LANGUAGE';
  private _language$ = new BehaviorSubject<string>(this.getStoredLanguage());
  public language$ = this._language$.asObservable();

  private translations: Record<string, Record<string, string>> = {
    en: {
      login_title: 'Login',
      address_placeholder: 'Address (bc1...)',
      my_workers: 'My Workers',
      current_network_stats: 'Current Mining Network Stats',
      current_network_difficulty: 'Current Network Difficulty:',
      current_hashrate: 'Current Hashrate:',
      difficulty_change: 'Difficulty Change:',
      days_until_adjustment: 'Days Until Adjustment:',
      average_pool_hashrate: 'Average Pool Hashrate',
      online_devices: 'Online Devices',
      device: 'Device',
      currently_working: 'Currently Working',
      total_hash_rate: 'Total Hash Rate',
      best_difficulty: 'Best Difficulty',
      high_scores: 'High Scores',
      rank: 'Rank',
      difficulty: 'Difficulty',
      when: 'When',
      found_blocks: 'Found Blocks',
      height: 'Height',
      address: 'Address',
      worker: 'Worker',
      session: 'Session',
      your_best_difficulty: 'Your Best Difficulty',
      total_shares: 'Total Shares',
      network_difficulty: 'Network Difficulty',
      network_hash_rate: 'Network Hash Rate',
      block_height: 'Block Height',
      weight: 'Weight:',
      uptime: 'Uptime',
      last_seen: 'Last Seen',
      home_intro_welcome: 'Welcome to the public solomining pool of yourdevice.ch! Together with Plebs from Switzerland, and anyone that would like to join, our goal is to hit a Block in Switzerland. Would you like to help us achive our mission? Join our Pool and help us dezentralize bitcoin mining even further. Together Strong! Together independent!',
      home_intro_donate: 'Running and maintaining such a server costs money and a lot of time. If you consider a donation for running this service, see donation button below!',
      home_login_statistics: 'login for your statistics: <your BTC address>',
      home_open_source_pool: 'Open Source Solo Mining Pool from Switzerland',
      home_no_fees: 'No fees',
      home_join_telegram: 'Join our Telegram group:',
      home_join_matrix: 'Join our Matrix Room:',
      home_ntfy_alerts: 'Or get notified via ntfy:',
      home_blocktemplates: 'We provide new blocktemplates every 30s!'
    },
    de: {
      login_title: 'Anmelden',
      address_placeholder: 'Adresse (bc1...)',
      my_workers: 'Meine Worker',
      current_network_stats: 'Aktuelle Mining-Netzwerkstatistiken',
      current_network_difficulty: 'Aktuelle Netzwerk-Schwierigkeit:',
      current_hashrate: 'Aktuelle Hashrate:',
      difficulty_change: 'Schwierigkeitsänderung:',
      days_until_adjustment: 'Tage bis Anpassung:',
      average_pool_hashrate: 'Durchschnittliche Pool-Hashrate',
      online_devices: 'Online-Geräte',
      device: 'Gerät',
      currently_working: 'Aktiv',
      total_hash_rate: 'Gesamte Hashrate',
      best_difficulty: 'Beste Schwierigkeit',
      high_scores: 'Bestwerte',
      rank: 'Rang',
      difficulty: 'Schwierigkeit',
      when: 'Wann',
      found_blocks: 'Gefundene Blöcke',
      height: 'Höhe',
      address: 'Adresse',
      worker: 'Worker',
      session: 'Sitzung',
      your_best_difficulty: 'Beste Schwierigkeit',
      total_shares: 'Gesamte Shares',
      network_difficulty: 'Netzwerk-Schwierigkeit',
      network_hash_rate: 'Netzwerk-Hashrate',
      block_height: 'Blockhöhe',
      weight: 'Gewicht:',
      uptime: 'Betriebszeit',
      last_seen: 'Zuletzt gesehen',
      home_intro_welcome: 'Willkommen beim öffentlichen Solomining Pool von yourdevice.ch! Zusammen mit Plebs aus der Schweiz und allen, die mitmachen möchten, ist unser Ziel, einen Block in der Schweiz zu finden. Möchtest du uns bei unserer Mission unterstützen? Tritt unserem Pool bei und hilf uns, das Bitcoin-Mining weiter zu dezentralisieren. Gemeinsam stark! Gemeinsam unabhängig!',
      home_intro_donate: 'Der Betrieb und die Wartung eines solchen Servers kostet Geld und viel Zeit. Wenn du eine Spende in Erwägung ziehst, findest du den Spenden-Button weiter unten!',
      home_login_statistics: 'Login für deine Statistiken: <deine BTC-Adresse>',
      home_open_source_pool: 'Open Source Solo-Mining Pool aus der Schweiz',
      home_no_fees: 'Keine Gebühren',
      home_join_telegram: 'Tritt unserer Telegram-Gruppe bei:',
      home_join_matrix: 'Tritt unserem Matrix-Raum bei:',
      home_ntfy_alerts: 'Oder über ntfy benachrichtigen lassen:',
      home_blocktemplates: 'Wir stellen alle 30 Sekunden neue Blocktemplates bereit!'
    }
  };

  private getStoredLanguage(): string {
    return localStorage.getItem(this.LANGUAGE_KEY) || 'en';
  }

  public setLanguage(lang: string): void {
    localStorage.setItem(this.LANGUAGE_KEY, lang);
    this._language$.next(lang);
  }

  public translate(key: string): string {
    const lang = this._language$.value;
    return this.translations[lang][key] || this.translations['en'][key] || key;
  }
}
