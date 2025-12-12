/* VERSION ORIGINAL

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PresentacionEquipoComponent } from './presentacion-equipo/presentacion-equipo.component';
import { PresentacionEquipoListadoComponent } from './presentacion-equipo-listado/presentacion-equipo-listado.component';

const routes: Routes = [
  { path  : '', pathMatch: 'full'             , redirectTo: 'home'                        },//Por defecto redirecciona a el home

  { path: 'home', component:PresentacionEquipoListadoComponent},
  { path  : 'equipos-listado' , component :PresentacionEquipoListadoComponent   }, 
  { path  : 'equipos' , component :PresentacionEquipoComponent   }, 
  { path: '**', redirectTo: '' }

];//no lo tenes aca presentacion-equipo

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

*/


import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PresentacionEquipoComponent } from './presentacion-equipo/presentacion-equipo.component';
import { PresentacionEquipoListadoComponent } from './presentacion-equipo-listado/presentacion-equipo-listado.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PresentacionEquipoProcComponent } from './presentacion-equipo-proc/presentacion-equipo-proc.component';

/*const routes: Routes = [
  { path  : '', pathMatch: 'full'             , redirectTo: 'home'                        },//Por defecto redirecciona a el home

  { path: 'home', component:MainLayoutComponent},
  { path  : 'equipos-listado' , component :PresentacionEquipoListadoComponent   }, 
  { path  : 'equipos' , component :PresentacionEquipoComponent   }, 
  { path: '**', redirectTo: '' }

];//no lo tenes aca presentacion-equipo

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

*/
const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: 'equipos-listado', component: PresentacionEquipoListadoComponent },
      { path: 'equipos', component: PresentacionEquipoComponent },
      { path: 'equipos-procesamiento', component: PresentacionEquipoProcComponent },
      { path: '', redirectTo: 'equipos-listado', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


