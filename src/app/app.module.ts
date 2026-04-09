import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PresentacionEquipoComponent } from './presentacion-equipo/presentacion-equipo.component';
import { PresentacionEquipoListadoComponent } from './presentacion-equipo-listado/presentacion-equipo-listado.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutheticationService } from './servicios/authentication-service';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import{MaterialModule} from './material'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './header/header.component';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeEsAr from '@angular/common/locales/es-AR';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { PresentacionEquipoProcComponent } from './presentacion-equipo-proc/presentacion-equipo-proc.component';
import { PresentacionEquipoRechazosComponent } from './presentacion-equipo-rechazos/presentacion-equipo-rechazos.component';
import { PresentacionEquipoDetalleRechazosComponent } from './presentacion-equipo-detalle-rechazos/presentacion-equipo-detalle-rechazos.component';
import { PresentacionEquipoProcFinalComponent } from './presentacion-equipo-proc-final/presentacion-equipo-proc-final.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import {NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import { MatSortModule } from '@angular/material/sort';
import { PresentacionEquipoPendientesComponent } from './presentacion-equipo-pendientes/presentacion-equipo-pendientes.component';
registerLocaleData(localeEsAr, 'es-Ar');
//Ahora lo vemos
@NgModule({
  declarations: [
    AppComponent,
    PresentacionEquipoComponent,
    PresentacionEquipoListadoComponent,
    HomeComponent,
    HeaderComponent,
    MainLayoutComponent,
    PresentacionEquipoProcComponent,
    PresentacionEquipoRechazosComponent,
    PresentacionEquipoDetalleRechazosComponent,
    PresentacionEquipoProcFinalComponent,
    NavbarComponent,
    PresentacionEquipoPendientesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    MatSortModule
  ],
  providers: [
    AutheticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

