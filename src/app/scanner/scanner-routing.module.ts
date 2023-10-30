import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScannerPage } from './scanner.page';

//import { ScannerPage } from './ScannerPage';

const routes: Routes = [
  {
    path: '',
    component: ScannerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScannerPageRoutingModule {}
