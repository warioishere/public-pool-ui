import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SplashComponent } from './components/splash/splash.component';
import { WorkerGroupComponent } from './components/worker-group/worker-group.component';
import { WorkerComponent } from './components/worker/worker.component';
import { MiningHashrateGraphComponent } from './components/mining-hashrate-graph/mining-hashrate-graph.component';
import { BlockHitCalcComponent } from './components/block-hit-calc/block-hit-calc.component';
import { DifficultyAdjustmentComponent } from './components/difficulty-adjustment/difficulty-adjustment.component';
import { CurrentBlockRewardComponent } from './components/current-block-reward/current-block-reward.component';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
  {
    path: '',
    component: SplashComponent
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      {
        path: ':address',
        children: [
          {
            path: 'settings',
            component: SettingsComponent
          },
          {
            path: 'hashrate',
            component: MiningHashrateGraphComponent
          },
          {
            path: 'difficulty-adjustment',
            component: DifficultyAdjustmentComponent
          },
          {
            path: 'block-reward',
            component: CurrentBlockRewardComponent
          },
          {
            path: 'block-hit-calc',
            component: BlockHitCalcComponent
          },
          {
            path: '',
            component: DashboardComponent,
          },
          {
            path: ':workerName',
            children: [

              {
                path: '',
                component: WorkerGroupComponent
              },
              {
                path: ':workerId',
                component: WorkerComponent
              }
            ]
          },


        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
