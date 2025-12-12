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

registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    AppComponent,
    PresentacionEquipoComponent,
    PresentacionEquipoListadoComponent,
    HomeComponent,
    HeaderComponent,
    MainLayoutComponent,
    PresentacionEquipoProcComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AutheticationService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

