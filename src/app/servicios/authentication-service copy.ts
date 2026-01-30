import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
  

export class AutheticationServicwe{
    constructor(
        private router : Router
    ) {
      // router.events.subscribe((url:any) => {
      //   this.Redireccionar(url.url)
      // });
    }
    usuario = JSON.parse(localStorage.getItem("currentUser"));
    loguado = (JSON.parse(localStorage.getItem("currentUser")) != null);

    sitios = {
        // administrador
        "1" : {
          path : "/",
          defecto :true,//false :  cambiar a true para que acceda como admin  y false en cc
          url :  environment.returnUrl,
          currentUser :{"IdUsuario":"10687","usuario":"101010","Nombre":"CASTILLO DALILA","Sistemas":[
            {"Id":31,"Nombre":"Carga y Procesamiento de Archivos de Equipo","IdPerfil":1,"NombrePerfil":"Administrador","Url":"","Image":"image-default.jpg"},
            {"Id":33,"Nombre":"Inscripción Cursos","IdPerfil":1,"NombrePerfil":"Administrador","Url":"cursos","Image":"image-default.jpg"},
            {"Id":38,"Nombre":"CUOTAS","IdPerfil":24,"NombrePerfil":"SECRETARIA","Url":"cuotas","Image":"image-default.jpg"},
            {"Id":48,"Nombre":"Documentación A.M.P.","IdPerfil":33,"NombrePerfil":"Procesamiento IOMA","Url":"documentacion","Image":"image-default.jpg"},
            {"Id":55,"Nombre":"Secretaría Administrativa Virtual","IdPerfil":1,"NombrePerfil":"Administrador","Url":"sav/login","Image":"image-default.jpg"}]
            ,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkNBU1RJTExPIERBTElMQSIsIm5hbWVpZCI6ImRhbGlsYSIsIlVzZXJJZCI6IjEwNjg3Iiwicm9sZSI6Ilt7XCJJZFwiOjMxLFwiTm9tYnJlXCI6XCJDYXJnYSB5IFByb2Nlc2FtaWVudG8gZGUgQXJjaGl2b3MgZGUgRXF1aXBvXCIsXCJJZFBlcmZpbFwiOjEsXCJOb21icmVQZXJmaWxcIjpcIkFkbWluaXN0cmFkb3JcIixcIlVybFwiOlwiXCIsXCJJbWFnZVwiOlwiaW1hZ2UtZGVmYXVsdC5qcGdcIn0se1wiSWRcIjozMyxcIk5vbWJyZVwiOlwiSW5zY3JpcGNpw7NuIEN1cnNvc1wiLFwiSWRQZXJmaWxcIjoxLFwiTm9tYnJlUGVyZmlsXCI6XCJBZG1pbmlzdHJhZG9yXCIsXCJVcmxcIjpcImN1cnNvc1wiLFwiSW1hZ2VcIjpcImltYWdlLWRlZmF1bHQuanBnXCJ9LHtcIklkXCI6MzgsXCJOb21icmVcIjpcIkNVT1RBU1wiLFwiSWRQZXJmaWxcIjoyNCxcIk5vbWJyZVBlcmZpbFwiOlwiU0VDUkVUQVJJQVwiLFwiVXJsXCI6XCJjdW90YXNcIixcIkltYWdlXCI6XCJpbWFnZS1kZWZhdWx0LmpwZ1wifSx7XCJJZFwiOjQ4LFwiTm9tYnJlXCI6XCJEb2N1bWVudGFjacOzbiBBLk0uUC5cIixcIklkUGVyZmlsXCI6MzMsXCJOb21icmVQZXJmaWxcIjpcIlByb2Nlc2FtaWVudG8gSU9NQVwiLFwiVXJsXCI6XCJkb2N1bWVudGFjaW9uXCIsXCJJbWFnZVwiOlwiaW1hZ2UtZGVmYXVsdC5qcGdcIn0se1wiSWRcIjo1NSxcIk5vbWJyZVwiOlwiU2VjcmV0YXLDrWEgQWRtaW5pc3RyYXRpdmEgVmlydHVhbFwiLFwiSWRQZXJmaWxcIjoxLFwiTm9tYnJlUGVyZmlsXCI6XCJBZG1pbmlzdHJhZG9yXCIsXCJVcmxcIjpcInNhdi9sb2dpblwiLFwiSW1hZ2VcIjpcImltYWdlLWRlZmF1bHQuanBnXCJ9XSIsImVzdGFibGVjaW1pZW50byI6IntcIk5vbWJyZVwiOlwiQS5NLlAuXCIsXCJJZFwiOjB9IiwibmJmIjoxNzI5NzczNDk4LCJleHAiOjE3Mjk4NjM0OTgsImlhdCI6MTcyOTc3MzQ5OH0.mOJH35d53mtcXC9uTiwTMVYREsSlr0ZvE76F9X2nA2I"},
          currentUserMedico2 : {"IdUsuario":"4061","usuario":"15976","Nombre":"ARREGUI VICTOR","Sistemas":[{"Id":1,"Nombre":"Carga de Prestaciones Ambulatorias","IdPerfil":3,"NombrePerfil":"MEDICO","Url":"rcm","Image":"image-default.jpg"}],"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkFSUkVHVUkgVklDVE9SIiwibmFtZWlkIjoiMTU5NzYiLCJVc2VySWQiOiI0MDYxIiwicm9sZSI6IntcIklkXCI6MSxcIk5vbWJyZVwiOlwiQ2FyZ2EgZGUgUHJlc3RhY2lvbmVzIEFtYnVsYXRvcmlhc1wiLFwiSWRQZXJmaWxcIjozLFwiTm9tYnJlUGVyZmlsXCI6XCJNRURJQ09cIixcIlVybFwiOlwicmNtXCIsXCJJbWFnZVwiOlwiaW1hZ2UtZGVmYXVsdC5qcGdcIn0iLCJlc3RhYmxlY2ltaWVudG8iOiJ7XCJOb21icmVcIjpcIkEuTS5QLlwiLFwiSWRcIjowfSIsIm5iZiI6MTcyOTc3Mjk1MSwiZXhwIjoxNzI5ODYyOTUxLCJpYXQiOjE3Mjk3NzI5NTF9.J8TIxSMHRoMOjJnHmJYmpGY_fuY-iSADR7za8zUF1Eo"},
          medicoSeleccionado:true// podriamos usar el tuyo como admin

        },
        //medico
     
     "3" : {
          path : "/",
          defecto : false, //cambiar a false para q acceda como medico  y true en cc
          url : environment.returnUrl,
          currentUser : {"IdUsuario":"5572","usuario":"117911 ","Nombre":"GOMEZ MATIAS","Sistemas":[
            {"Id":31,"Nombre":"Carga y Procesamiento de Archivos de Equipo","IdPerfil":3,"NombrePerfil":"MEDICO","Url":"","Image":"image-default.jpg"},
            {"Id":1,"Nombre":"Carga de Prestaciones Ambulatorias","IdPerfil":3,"NombrePerfil":"MEDICO","Url":"rcm","Image":"image-default.jpg"}]
            ,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdPTUVaIE1BVElBUyIsIm5hbWVpZCI6IjExNzkxMSAiLCJVc2VySWQiOiI1NTcyIiwicm9sZSI6IntcIklkXCI6MSxcIk5vbWJyZVwiOlwiQ2FyZ2EgZGUgUHJlc3RhY2lvbmVzIEFtYnVsYXRvcmlhc1wiLFwiSWRQZXJmaWxcIjozLFwiTm9tYnJlUGVyZmlsXCI6XCJNRURJQ09cIixcIlVybFwiOlwicmNtXCIsXCJJbWFnZVwiOlwiaW1hZ2UtZGVmYXVsdC5qcGdcIn0iLCJlc3RhYmxlY2ltaWVudG8iOiJ7XCJOb21icmVcIjpcIkEuTS5QLlwiLFwiSWRcIjowfSIsIm5iZiI6MTcyOTcwOTY5MCwiZXhwIjoxNzI5Nzk5NjkwLCJpYXQiOjE3Mjk3MDk2OTB9.ibMt-dN250cKXorEokSyHjdHu6tjhrTCzwU7Hr-Htc4"},
          currentUserMedico2 : {"IdUsuario":"4061","usuario":"15976","Nombre":"ARREGUI VICTOR","Sistemas":[{"Id":31,"Nombre":"Carga y Procesamiento de Archivos de Equipo","IdPerfil":3,"NombrePerfil":"MEDICO","Url":"","Image":"image-default.jpg"},{"Id":1,"Nombre":"Carga de Prestaciones Ambulatorias","IdPerfil":3,"NombrePerfil":"MEDICO","Url":"rcm","Image":"image-default.jpg"}],"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkFSUkVHVUkgVklDVE9SIiwibmFtZWlkIjoiMTU5NzYiLCJVc2VySWQiOiI0MDYxIiwicm9sZSI6IntcIklkXCI6MSxcIk5vbWJyZVwiOlwiQ2FyZ2EgZGUgUHJlc3RhY2lvbmVzIEFtYnVsYXRvcmlhc1wiLFwiSWRQZXJmaWxcIjozLFwiTm9tYnJlUGVyZmlsXCI6XCJNRURJQ09cIixcIlVybFwiOlwicmNtXCIsXCJJbWFnZVwiOlwiaW1hZ2UtZGVmYXVsdC5qcGdcIn0iLCJlc3RhYmxlY2ltaWVudG8iOiJ7XCJOb21icmVcIjpcIkEuTS5QLlwiLFwiSWRcIjowfSIsIm5iZiI6MTcyOTc3Mjk1MSwiZXhwIjoxNzI5ODYyOTUxLCJpYXQiOjE3Mjk3NzI5NTF9.J8TIxSMHRoMOjJnHmJYmpGY_fuY-iSADR7za8zUF1Eo"},
          medicoSeleccionado:true // cambiar entre medicos
        },


//EQUIPO
/*
        "3" : {
          path : "/",
          defecto : true, //cambiar a false para q acceda como medico  y true en cc
          url : environment.returnUrl,
          currentUser : {"IdUsuario":"12025","usuario":"995449 ","Nombre":"ACLP","Sistemas":[
            {"Id":31,"Nombre":"Carga y Procesamiento de Archivos de Equipo","IdPerfil":3,"NombrePerfil":"MEDICO","Url":"","Image":"image-default.jpg"},
            {"Id":1,"Nombre":"Carga de Prestaciones Ambulatorias","IdPerfil":3,"NombrePerfil":"MEDICO","Url":"rcm","Image":"image-default.jpg"}]
            ,"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkdPTUVaIE1BVElBUyIsIm5hbWVpZCI6IjExNzkxMSAiLCJVc2VySWQiOiI1NTcyIiwicm9sZSI6IntcIklkXCI6MSxcIk5vbWJyZVwiOlwiQ2FyZ2EgZGUgUHJlc3RhY2lvbmVzIEFtYnVsYXRvcmlhc1wiLFwiSWRQZXJmaWxcIjozLFwiTm9tYnJlUGVyZmlsXCI6XCJNRURJQ09cIixcIlVybFwiOlwicmNtXCIsXCJJbWFnZVwiOlwiaW1hZ2UtZGVmYXVsdC5qcGdcIn0iLCJlc3RhYmxlY2ltaWVudG8iOiJ7XCJOb21icmVcIjpcIkEuTS5QLlwiLFwiSWRcIjowfSIsIm5iZiI6MTcyOTcwOTY5MCwiZXhwIjoxNzI5Nzk5NjkwLCJpYXQiOjE3Mjk3MDk2OTB9.ibMt-dN250cKXorEokSyHjdHu6tjhrTCzwU7Hr-Htc4"},
          currentUserMedico2 : {"IdUsuario":"4061","usuario":"15976","Nombre":"ARREGUI VICTOR","Sistemas":[{"Id":31,"Nombre":"Carga y Procesamiento de Archivos de Equipo","IdPerfil":3,"NombrePerfil":"MEDICO","Url":"","Image":"image-default.jpg"},{"Id":1,"Nombre":"Carga de Prestaciones Ambulatorias","IdPerfil":3,"NombrePerfil":"MEDICO","Url":"rcm","Image":"image-default.jpg"}],"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IkFSUkVHVUkgVklDVE9SIiwibmFtZWlkIjoiMTU5NzYiLCJVc2VySWQiOiI0MDYxIiwicm9sZSI6IntcIklkXCI6MSxcIk5vbWJyZVwiOlwiQ2FyZ2EgZGUgUHJlc3RhY2lvbmVzIEFtYnVsYXRvcmlhc1wiLFwiSWRQZXJmaWxcIjozLFwiTm9tYnJlUGVyZmlsXCI6XCJNRURJQ09cIixcIlVybFwiOlwicmNtXCIsXCJJbWFnZVwiOlwiaW1hZ2UtZGVmYXVsdC5qcGdcIn0iLCJlc3RhYmxlY2ltaWVudG8iOiJ7XCJOb21icmVcIjpcIkEuTS5QLlwiLFwiSWRcIjowfSIsIm5iZiI6MTcyOTc3Mjk1MSwiZXhwIjoxNzI5ODYyOTUxLCJpYXQiOjE3Mjk3NzI5NTF9.J8TIxSMHRoMOjJnHmJYmpGY_fuY-iSADR7za8zUF1Eo"},
          medicoSeleccionado:true // cambiar entre medicos
        },


*/

    }


  //Verifica si la aplicación NO está en producción  
  //Busca un usuario por defecto configurado en "sitios"
  //Si no hay usuario logueado: guarda un usuario falso en localStorage
  //y deja el sistema como si estuviera logueado, o sea Si estoy en desarrollo
  // y todavía no hay sesión, creame una automáticamente

    CrearLogin(){
      console.log(environment.production) 
      if(!environment.production){ 
        var sistema : any = Object.values(this.sitios).find( (item : any) => {
          return item.defecto == true
       });
       
       if(this.usuario == null){
         if(sistema.medicoSeleccionado){
          localStorage.setItem("currentUser",JSON.stringify(sistema.currentUser))
         }else{
          localStorage.setItem("currentUser",JSON.stringify(sistema.currentUserMedico2))
         }
        
         this.usuario = sistema.currentUser;
       }
      }
    }
    
      //Se asegura de que exista un usuario (llama al CrearLogin)
      //Verifica que no estés ya en la URL principal
      //Evalúa si existe usuario y si el usuario tiene permiso para este sistema
      //Cada vez que entro al sistema, verifico si este usuario puede estar acá
      //tener en cuenta que un usuario puede estar logueado,
      // pero no autorizado para este modulo
      Redireccionar(){
      this.CrearLogin();
      if(environment.returnUrl + "/" != document.location.href){
        if(this.usuario!=null){
          if(!this.BuscarSistema()){
            location.href = this.CerrarSession();
          }
        }else{
          // mandar a login
          location.href = this.CerrarSession();
        }
      }
    }

    BuscarSistema(){
      var valido = false;
      this.usuario.Sistemas.forEach(element => {
        if(element.Id == environment.idSistema){
            valido = true;
        }
      });
      return valido;
    }
    
       // Arma información del sistema actual
        //Construye una URL de logout
       // Borra el usuario del localStorage
       // Devuelve la URL para redireccionar

    CerrarSession(){
      var returnUrl = btoa(environment.returnUrl);
      var json = {"idSistema":environment.idSistema,"volver":returnUrl,"ver":false,"sistema":"Proforma de Equipos"}
      var url = environment.logout+"?token="+btoa(JSON.stringify(json));
      localStorage.removeItem("currentUser");
      return url;
    }

}