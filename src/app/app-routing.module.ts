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
import { PresentacionEquipoRechazosComponent } from './presentacion-equipo-rechazos/presentacion-equipo-rechazos.component';
import { PresentacionEquipoDetalleRechazosComponent } from './presentacion-equipo-detalle-rechazos/presentacion-equipo-detalle-rechazos.component';
import { PresentacionEquipoProcFinalComponent } from './presentacion-equipo-proc-final/presentacion-equipo-proc-final.component';

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
      { path: 'equipos-procFinal', component: PresentacionEquipoProcFinalComponent },
      { path: 'equipos-rechazos', component: PresentacionEquipoRechazosComponent },
      { path: 'detalle-rechazos/:id', component: PresentacionEquipoDetalleRechazosComponent  },
      { path: '', redirectTo: 'equipos-listado', pathMatch: 'full' }
    ]
  }
];

/*

const routes: Routes = [
  {
    path: 'detalle-rechazo/:id',
    component: DetalleRechazoComponent
  }
];


*/ 






@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


