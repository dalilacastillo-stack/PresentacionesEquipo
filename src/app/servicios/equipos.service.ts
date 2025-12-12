import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap, catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EquiposService {

  constructor(
    private http : HttpClient
  ) { }

  apiUrl = environment.apiUrl; //ambiente de desarrollo
  


//REVISARRRRRRRRRRRRRR
  /*getHttpOptions() {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json', 
        'Access-Control-Allow-Origin': '*', 
        'x-api-key': "75DE299CBE8CDDA4CFF2C979344FA456"
       })
    };
  }
*/
  /*llamadaServicio() {
    const url = "https://servicios.amp.com/referencias_rest/profesional/115945/equipos"
    return this.http.get<any[]>(url, this.getHttpOptions())
   
  }
*/



/*version ANTO modificada
getEquiposPrueba(matricula: number): Observable<any> {
  console.log("matriculaaaaaa",matricula)
  //const url = `${environment.apiUrl}api/documentacion/getEquiposByMatricula/${matricula}`;
  //const url = `https://localhost:44349/equipo-listado/getHeadersProformas/getEquiposByMatricula`;
  const url = `https://localhost:44349/equipo/getEquiposByMatricula/`;
  return this.http.get<any>(url, this.getHttpOptions())
      .pipe(
        tap(() => console.log('getEquipos'))
        //,
        //catchError(this.handleError('getEquipos', []))
      );
}
*/

getEquipos(usuario:any) {
 // console.log("usuariosesion+++++++++++ --->",usuario);
 // usuario = 115598;
 // usuario = 115945;
  
  return this.http.get(`${this.apiUrl}equipo/GetEquipoByMatricula/${usuario}/`)
  
}



getInformacionEquipo(usuario:any) {
 // console.log("usuariosesion+++++++++++ --->",usuario);
 // usuario = 115598;
 // usuario = 115945;
  
  return this.http.get(`${this.apiUrl}equipo/GetInformacionEquipo/${usuario}/`)
  
}

validarEquipo(equipo:any){

   return this.http.get(`${this.apiUrl}equipo/validarEquipo/${equipo}/`)
}
/*
Version  MIA:

 getHeadersProformas(matricula): Observable<any[]> {
   // var usu = JSON.parse(localStorage.getItem('currentUser'))
   console.log("matriculaaaaaa",matricula)
     
       
    return this.http.get(url, this.getHttpOptions())
    .pipe(
     tap(() => this.log('getHeadersProformas')),
      catchError(this.handleError<any>('-----'))
    );  
  }
*/


/* ********Version que funcionaria*******

  getEquipos(usuario,userlogin)
  {  console.log("getEquipos2222");
    const url = "https://servicios.amp.com/referencias_rest/profesional/115945/equipos"
    return this.http.get<any[]>(url, this.getHttpOptions())
   
  }

  */

obtener(){
  return this.http.get(`${this.apiUrl}equipo/obtener`)
  //return this.http.get("https://localhost:/equipo/obtener")
}

obtenerTodos(){
  return this.http.get(`${this.apiUrl}equipo/obtenerTodos`)

  // return this.http.get("https://localhost:44349/equipo/obtenerTodos")
}

/*
guardarDatos(data, cantidadBonos, usuarioSesion,periodo) {
  // const url = this.getBaseURL() + environment.apiPrescripciones + `api/presentacion/practicas/${_numEstado}`;
    const url =  `https://localhost:44349/equipo/guardarDatos/${cantidadBonos}/${usuarioSesion}/${periodo}`;
   
    console.log("metodo guardarDatos SERVICIO: ",data);
   return this.http.post<any[]>(url, data, this.getHttpOptions())
    .pipe(
     tap(() => this.log('guardardatosss')),
      catchError(this.handleError<any>('-----'))
    );

  }*/

guardar(json : any) {

  console.log("json--->",json);

  
  return this.http.post(`${this.apiUrl}equipo/guardar`,json,{ 
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  });




  // console.log("json--->",json);
  // // const url = this.getBaseURL() + environment.apiPrescripciones + `api/presentacion/practicas/${_numEstado}`;
  //   const url =  `https://localhost:44349/equipo/guardar/`;
   
  //   console.log("metodo guardarDatos SERVICIO: ",json);
  //  return this.http.post<any[]>(url, json, this.getHttpOptions())
  //   .pipe(
  //    tap(() => this.log('guardardatosss')),
  //     catchError(this.handleError<any>('-----'))
  //   );
 
  }
 


  procesar(infoProc: any) {
    
      // const url = this.getBaseURL() + environment.apiPrescripciones + `api/presentacion/practicas/${_numEstado}`;
    /*  const url =  `https://localhost:44349/equipo/procesar/`;
    
      return this.http.post<any[]>(url,  this.getHttpOptions())
      .pipe(
       tap(() => this.log('update info')),
        catchError(this.handleError<any>('-----'))
      );*/

      return this.http.post(`${this.apiUrl}equipo/procesar`,infoProc,{ 
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      });

   }

   generarCierre(jsonCierre:any){
    console.log("servicio - envio de cierre: --->", jsonCierre);
   /*
    const url =  `https://localhost:44349/equipo/generarCierre/`;
  
   return this.http.post<any[]>(url,jsonCierre,  this.getHttpOptions())
    .pipe(
     tap(() => this.log('generarCierre')),
      catchError(this.handleError<any>('-----'))
    );   */
    
    return this.http.post(`${this.apiUrl}equipo/generarCierre`,jsonCierre,{ 
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });


   }
/*
   getHeadersProformas(matricula): Observable<any[]> {
   // var usu = JSON.parse(localStorage.getItem('currentUser'))
   console.log("matriculaaaaaa",matricula)
      const url = `https://localhost:44349/equipo-listado/getHeadersProformas/${matricula}`;
       
    return this.http.get(url, this.getHttpOptions())
    .pipe(
     tap(() => this.log('getHeadersProformas')),
      catchError(this.handleError<any>('-----'))
    );  
  }
*/
  getHeadersProformas(matricula:any, idPerfil:Number) {
    console.log("usuariosesion --->",matricula);
  return this.http.get(`${this.apiUrl}equipo-listado/getHeadersProformas/${matricula}/${idPerfil}`)

}


  ejecutarEliminacionArchivo(archivoJson:any) {
  //ejecutarEliminacionArchivo(archivoJson:any): Observable<any[]> {
    // var usu = JSON.parse(localStorage.getItem('currentUser'))
      console.log("idProffffff", archivoJson);
   /*  const url = `https://localhost:44349/equipo-listado/ejecutarEliminacionArchivo/`;
             
      return this.http.post<any[]>(url, archivoJson, this.getHttpOptions())
       .pipe(
        tap(() => this.log('ejecutarEliminacionArchivo')),
         catchError(this.handleError<any>('-----'))
       );
   */

     
       return this.http.post(`${this.apiUrl}equipo-listado/ejecutarEliminacionArchivo`,archivoJson,{ 
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      });



  }

  

/*
  descargarExcelEquipo( downExcelJson ) {
    const url = `https://localhost:44349/equipo-listado/descargarExcelEquipo/${idArchivo}`;
    // const params = new HttpParams().set('matricula', idArchivo)
    return this.http.get(url)

  }
*/
 /* descargarExcelEquipo(downExcelJson): Observable<any[]> {
    console.log("servicio - envio pedidos de rechazos: --->", downExcelJson);
    // const url = this.getBaseURL() + environment.apiPrescripciones + `api/presentacion/practicas/${_numEstado}`;
    const url =  `https://localhost:44349/equipo-listado/descargarExcelEquipo/`;
  
   return this.http.post<any[]>(url,downExcelJson, this.getHttpOptions())
    .pipe(
     tap(() => this.log('descargarExcelEquipo')),
      catchError(this.handleError<any>('-----'))
    );    
   }*/


    descargarExcelEquipo(downExcelJson:any) {
    return this.http.post(`${this.apiUrl}equipo-listado/descargarExcelEquipo`,downExcelJson,{ 
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });
  }


/*
  descargarExcelBonosRechazados( jsonRechazo ) {
    const url = `https://localhost:44349/equipo-listado/descargarExcelBonosRechazados/${idArchivo}/${equipo}`;
    // const params = new HttpParams().set('matricula', idArchivo)
    return this.http.get(url)

  }

*/
/*
  descargarExcelBonosRechazados(jsonRechazo): Observable<any[]> {
    console.log("servicio - envio pedidos de rechazos: --->", jsonRechazo);
    // const url = this.getBaseURL() + environment.apiPrescripciones + `api/presentacion/practicas/${_numEstado}`;
    const url =  `https://localhost:44349/equipo-listado/descargarExcelBonosRechazados/`;
  
   return this.http.post<any[]>(url,jsonRechazo, this.getHttpOptions())
    .pipe(
     tap(() => this.log('Excelrechazos')),
      catchError(this.handleError<any>('-----'))
    );    
   }*/

   descargarExcelBonosRechazados(jsonRechazo) {
   return this.http.post(`${this.apiUrl}equipo-listado/descargarExcelBonosRechazados`,jsonRechazo,{ 
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  });
}


obtenerLotes(jpendiente){

  return this.http.post(`${this.apiUrl}equipo-listado/obtenerLotes`,jpendiente,{ 
    headers: new HttpHeaders({'Content-Type': 'application/json'})
  });

}

actualizarArchivo(jInfo){

   return this.http.post(`${this.apiUrl}equipo/actualizarArchivo`,jInfo,{ 
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    });


}



//guardarDatos(data:any, cantidadBonos,periodo, usuarioSesion) {
  // const url = this.getBaseURL() + environment.apiPrescripciones + `api/presentacion/practicas/${_numEstado}`;
////    const url =  `https://localhost:44316/api/presentacion/equipos/guardarDatos2`;
  /* const url =  `https://localhost:44349/equipo/guardarDatos/${cantidadBonos}/${usuarioSesion}/${periodo}`;
   console.log("metodo guardarDatos SERVICIO: ",data);
     return this.http.post(url,data,{ 
      headers: new HttpHeaders({'Content-Type': 'application/json'})
   });*/
// console.log(data);
      //  return this.http.get(url);
  /* return this.http.post<any[]>(url, data, this.getHttpOptions())
    .pipe(
     tap(() => this.log('guardarDatos')),
      catchError(this.handleError<any>('-----'))
    );*/     
 //}
 

}
