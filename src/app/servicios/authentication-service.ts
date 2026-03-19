import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";


@Injectable({
    providedIn: 'root'
})
  

export class AutheticationService{
  
    
usuario: any = null;

constructor(private router: Router) {
  const rawUser = localStorage.getItem('currentUser');
  this.usuario = rawUser ? JSON.parse(rawUser) : null;
}


   
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
      user      : 118141//117911 //118141 // 118002 // matricula del equipo que lo integra 
    },
    { 
       perfil   :"equipo",
       idPerfil :39,
       defecto  : false,
       user     : 995449 // N° de equipo con el que accederia
    } 
  ]
  //este seria el usuario  login si no existe es null



Validar() {
  if(environment.production){ // este
    if (!this.usuario) {
      console.log('NO HAY USUARIO → LOGOUT'); // NO cuenta porque para el local no te creara el login por eso el if inicial
      this.CerrarSesion();
      return;
    }
  }else{
    this.CrearSesionLocal();
  }
  const sistema = this.usuario.Sistemas?.find(
    item => item.Id === environment.idSistema
  );
  if (sistema) {
      console.log('OK → HOME');
    this.router.navigate(['/home']);
  } else {
    console.log('NO TIENE SISTEMA → LOGOUT');
    this.CerrarSesion();
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
        console.log(json)
        this.usuario = null;
        localStorage.removeItem("currentUser");
        localStorage.removeItem("rcmUser");
        //Redireccionamos al login 
        location.href = `${environment.logout}?token=${btoa(JSON.stringify(json))}`
    }
    else{ 
      if(this.usuario == null){
        this.CrearSesionLocal();
      }
    }
  }

  
  CrearSesionLocal(){
    if(!environment.production){
      if(this.usuario == null){
        var perfilDefault = this.sitios.filter(item=>item.defecto==true) 
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
          localStorage.setItem("rcmUser", JSON.stringify(user));
          location.reload();
        }
      }
    }
  }
//antes que nada el navbar te lo creo en layout? como otro componente del layout o como lo pensaste vos a la arquitectura?   -si lo cree como otro componente
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
    this.usuario = null
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rcmUser")
    this.CrearSesionLocal();
    //location.reload()  
  }
}