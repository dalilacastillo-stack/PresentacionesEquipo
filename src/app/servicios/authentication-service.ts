import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment.development";


@Injectable({
    providedIn: 'root'
})
  

export class AutheticationService{
    constructor(
        private router : Router
    ) {
    }

    

  //Vamos a armar una lista primero que nos va ayudar con los perfiles asi vos podes testear con varios perfiles en local 
   
  sitios = [
    { // los perfiles
      perfil    :"Administrador", 
      idPerfil  : 1,
      defecto   : true,
      user      : "dalila"  
    },
    {  
      perfil    :"medico",      
      idPerfil  : 3    ,
      defecto   : false,
      user      :  117911 // 118002 // matricula del equipo que lo integra 
    },
    { 
       perfil   :"equipo",
       idPerfil :39,
       defecto  : false,
       user     : 995449 // N° de equipo con el que accederia
    } 
  ]
  //este seria el usuario logeado del login si da el caso de que exista sino es null
  usuario = JSON.parse(localStorage.getItem("currentUser"));

  Validar(){
    if(this.usuario != null){
        // - Verificamos que em los sistemas habilitados de usuario se encuentre el nuestro
      let sistema = this.usuario.Sistemas.filter((item) => {
        item.Id == environment.idSistema
      });
      if(sistema.length > 0){ // se encontro
        //Redireccionas al home
        location.href = "/home"
      }else{
        this.CerrarSesion()
      }
    }else{
      this.CerrarSesion()
    }
  }
  CerrarSesion(){
    //Lo usaremos para que el login tenga el token que sera este json
    if(environment.production){
        const json  : any = {
          idSistema : environment.idSistema,
          volver    : btoa(environment.returnUrl),
          ver       : false,
          sistema   : "Carga y Procesamiento de Archivos de Equipo"
        };
        //Borramos todo lo que este en el localStorage en caso de que tengas mas las agregas aca
        localStorage.removeItem("currentUser");
        localStorage.removeItem("rcmUser");

        //Redireccionamos al login 
        location.href = `${environment.logout}?token=${btoa(JSON.stringify(json))}`
    }
    else{
      if(this.usuario == null){
        this.CrearSesionLocal();
        location.reload();
      }
    }
  }

  
  CrearSesionLocal(){
    console.log("PASO POR ACA")
    if(!environment.production){
      this.usuario = JSON.parse(localStorage.getItem("currentUser"))
      if(this.usuario == null){
        var perfilDefault = this.sitios.filter(item=>item.defecto==true) 
        console.log("Perfil=>"+perfilDefault)
        if(perfilDefault.length > 0){
          var user =  {
            "IdUsuario" :"10687", // aca si habria que poder algun id por si tenes validacion x usuario aunque sea de mentira para que veas que funciona si total no importa mucho a menos que si o si valides x usuario lo que si no se como haces lo de las matriculas entra con matricula y la mandas o solo tomaba las del archivo?
            "usuario"   : perfilDefault[0].user, // podes poner uno de ejemplo sino ese
            "Nombre"    : perfilDefault[0].perfil,
            "Sistemas"  : [
              {
                "Id"           : environment.idSistema,
                "Nombre"       : "Carga y Procesamiento de Archivos de Equipo",
                "IdPerfil"     : perfilDefault[0].idPerfil,
                "NombrePerfil" : perfilDefault[0].perfil,
                "Url"          : "",
                "Image"        : ""
              }
            ],
            "token":""
          };
          localStorage.setItem("currentUser", JSON.stringify(user));
          location.reload()
        }
      }
      
    }
  }
//antes que nada el navbar te lo creo en layout? como otro componente del layout o como lo pensaste vos a la arquitectura? si lo cree como otro componente
//donde tengo el menu cuando se logue se muestra ese componente..de alli se redireccionan los diferentes componentes que hacen a la funcionalidad del sistema 
  CambiarPefil(perfil : string){
    console.log(perfil)
    this.sitios.forEach(item => {
      if(item.perfil == perfil){
        item.defecto = true;
      }else{
        item.defecto = false;
      }
    });
    console.log(this.sitios)
    localStorage.removeItem("currentUser");
    this.CrearSesionLocal();
    //location.reload()  
  }
}