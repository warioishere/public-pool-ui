import 'chartjs-adapter-moment';

import { CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgParticlesModule } from 'ng-particles';

import { PrimeNGModule } from '../prime-ng.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BackgroundParticlesComponent } from './components/background-particles/background-particles.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SplashComponent } from './components/splash/splash.component';
import { UserAgentLinkComponent } from './components/user-agent-link/user-agent-link.component';
import { WorkerGroupComponent } from './components/worker-group/worker-group.component';
import { WorkerComponent } from './components/worker/worker.component';
import { MiningHashrateGraphComponent } from './components/mining-hashrate-graph/mining-hashrate-graph.component';
import { BlockHitCalcComponent } from './components/block-hit-calc/block-hit-calc.component';
import { DifficultyAdjustmentComponent } from './components/difficulty-adjustment/difficulty-adjustment.component';
import { CurrentBlockRewardComponent } from './components/current-block-reward/current-block-reward.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { DateAgoPipe } from './pipes/date-ago.pipe';
import { HashSuffixPipe } from './pipes/hash-suffix.pipe';
import { NumberSuffixPipe } from './pipes/number-suffix.pipe';
  import { AverageTimeToBlockPipe } from './pipes/average-time-to-block.pipe';
import { TranslatePipe } from './pipes/translate.pipe';



@NgModule({
  declarations: [
    AppComponent,
    SplashComponent,
    DashboardComponent,
    WorkerComponent,
    NumberSuffixPipe,
    DateAgoPipe,
    WorkerGroupComponent,
    BackgroundParticlesComponent,
    HashSuffixPipe,
    SettingsComponent,
    UserAgentLinkComponent,
    MiningHashrateGraphComponent,
    BlockHitCalcComponent,
    DifficultyAdjustmentComponent,
    CurrentBlockRewardComponent,
    TranslatePipe
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    PrimeNGModule,
    AppLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    NgParticlesModule
  ],
  providers: [
    { provide: LocationStrategy, useClass: HashLocationStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
