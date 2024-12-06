// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomieComponent } from './homie/homie.component';


export const routes: Routes = [
  {path : 'homie' , component : HomieComponent},
  { path: '', redirectTo: '/homie', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
