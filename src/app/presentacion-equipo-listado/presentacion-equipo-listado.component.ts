/*import { Component } from '@angular/core';

@Component({
  selector: 'app-presentacion-equipo-listado',
  templateUrl: './presentacion-equipo-listado.component.html',
  styleUrls: ['./presentacion-equipo-listado.component.scss']
})
export class PresentacionEquipoListadoComponent {

}
*/
import { MatTableDataSource } from '@angular/material/table';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EquiposService } from '../servicios/equipos.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-presentacion-equipo-listado',
  templateUrl: './presentacion-equipo-listado.component.html',
  styleUrls: ['./presentacion-equipo-listado.component.scss']
})
export class PresentacionEquipoListadoComponent implements OnInit , AfterViewInit{


    usuario   = JSON.parse(localStorage.getItem("currentUser"))
    matricula = this.usuario.usuario;
    idPerfil  =  this.usuario.Sistemas.filter(d => d.Id==environment.idSistema)[0].IdPerfil
  
    perfilUsu = (this.idPerfil == 1);



  filterForm:FormGroup;
  user:any;
  displayedColumns: string[] = [ 'NombrePresentacion', 'Equipo', 'Periodo', 'Cantidad','FechaCarga', 'Usuario', 'Estado', 'Acciones' ];
  dataSource : any = new MatTableDataSource();//new MatTableDataSource<listaProf>(); --this.listaProf
 //dataSource = new MatTableDataSource<any>([]);
  lotesArray: string[];
 

  @ViewChild('paginator', { read: MatPaginator }) paginator: MatPaginator;
  @ViewChild('confirmarEliminarDialog') confirmarEliminarDialog: TemplateRef<any>;
  @ViewChild('mensajeEliminadoDialog') mensajeEliminadoDialog: TemplateRef<any>;
  @ViewChild('mostrarLotesDialog') mostrarLotesDialog: TemplateRef<any>;

 
  constructor(private service: EquiposService, public dialog: MatDialog,  private _snackBar: MatSnackBar, ) {
    //this.user = JSON.parse(localStorage.getItem('rcmUser')) ? JSON.parse(localStorage.getItem('rcmUser')) : '' ;
    this.user = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')) : '' ;
    //usuario   = JSON.parse(localStorage.getItem("currentUser"))
     
  }

     // this.matricula = this.user.usuario;
   //   idPerfil  =  this.user.Sistemas.filter(d => d.Id==environment.idSistema)[0].IdPerfil


  
  ngOnInit() {
      this.filterForm = new FormGroup({
      usuarioSesion: new FormControl({ value: '', disabled: false }, [Validators.required]),
     // equipoSeleccionado:new FormControl({value:''},[Validators.required] ),
        });
     this.listadoHeadersProformas();

    
  }

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator; // ahora sí funciona
  }

  listadoHeadersProformas(){
    let matricula= this.user.usuario;
    console.log("MATRICULA DE SESSION",matricula);
    //this.isLoading = true;
    let dataTable: any[] = [];
    this.dataSource.data = []; 
    this.dataSource._updateChangeSubscription();
    
     // let desde = this.filterFormLotes.get('fechaDesde').value;
     // let hasta = this.filterFormLotes.get('fechaHasta').value;
     //console.log("desde"+ desde+ "Hasta"+ hasta + "matricula:" + matricula );
     //if (!this.filterForm.valid) {  
       // this.isLoading = false; 4
    //    return;
     // }
    
     /* if (!desde || !hasta || !matricula) {
        this.isLoading = false;
        return;
      }
    */
     // this.service.getLotes(matricula, moment(desde).format('DD/MM/YYYY'), moment(hasta).format('DD/MM/YYYY')).subscribe(
      var sistema = this.user.Sistemas.filter(d => d.Id==environment.idSistema);
      console.log(sistema[0])
      //if (sistema.length > 0)  
      let idPerfil = sistema[0].IdPerfil;  //3 medico //1 admin 
     // let idPerfil = sistema[0].IdPerfil==1;  //3 medico //1 admin 
     this.service.getHeadersProformas(matricula,idPerfil).subscribe(
        data => {
        console.log("data:" + JSON.stringify(data));
        
        let dataTable = data != null ? data: []; //---------------agregue el let----------------------
        this.dataSource.data = dataTable;
       // this.isLoading = false;
        //this.resetInMemoryFilter();
        this.dataSource._updateChangeSubscription();
         // this.updateGoto();
         // this.jumpToPage(1);    
        },
        error => {
          if (error.status != 0) {  
            console.log('Ocurrió un error al obtener los datos de las proformas');
           // toastr.error('Ocurrió un error al obtener los datos históricos', 'Atención: ');
          }
          //this.isLoading = false;
        }
      );
     
    
  }
  

eliminarArchivoSeleccionado(data){
 
const dialogRef =  this.dialog.open(this.confirmarEliminarDialog, {
  disableClose: true,
  autoFocus: true ,
  maxWidth: '50vw',
  minWidth: "45vw",
  data: data
});
//console.log("data",data);
var archivoJson:any = {
        id: data.id,
        estadoId: 4
  }

dialogRef.afterClosed().subscribe(result => {
  if (result) {  

    this.service.ejecutarEliminacionArchivo(archivoJson).subscribe((data:any)=>{
    let resp = data;
    console.log(resp);

    this.mostrarMensajeDeEliminacion(resp);
    this.listadoHeadersProformas();
    },     
    error=>{
      console.error("error al efectuar la eliminación del archivo");
      console.log(error);
     
    })

  }
})


}

mostrarMensajeDeEliminacion(resp ){

  const dialogRef =  this.dialog.open(this.mensajeEliminadoDialog, {
    disableClose: true,
    autoFocus: true ,
    data: resp
  });

}


  abrirArchivo(idArchivo: number, nombrePresentacion : string, periodo: any, equipo: number, idEstado:number ){
       // alert(idArchivo);
     var downExcelJson : any = {
       id: idArchivo,
       nombrePresentacion: nombrePresentacion,
       periodo: periodo,
       equipo: equipo,
       estadoId: idEstado
     }
      this.service.descargarExcelEquipo(downExcelJson).subscribe((data:any) => {
      const downloadLink = document.createElement('a');
      downloadLink.href = data; //file;
      downloadLink.download = nombrePresentacion; // fileName;
      downloadLink.click();
     
  });
    }

    actualizarArchivo(idArchivo: number, nombrePresentacion : string, equipo: number, idEstado:number, periodo:any){
    // alert(equipo);
      var jsonRechazo : any = {  
      id : idArchivo,  
      estadoId: idEstado,    
      nombrePresentacion :nombrePresentacion,
      equipo :equipo,
      periodo: periodo
       }
        this.service.actualizarArchivo(jsonRechazo).subscribe((data:any) => {
        console.log("data----------------->"+data);
        if(data == true){
                // recargar la grilla
                this.listadoHeadersProformas();
        }
        
      },
      error=>{
      console.error("error al actulizar el archivo");
      console.log(error);
     // this.toastr.error(error.error.Message, 'Atención');
    }
    
    
    );
    }



    verRechazos(idArchivo: number, nombrePresentacion : string, equipo: number, idEstado:number, periodo:any){
    // alert(equipo);
      var jsonRechazo : any = {  
      id : idArchivo,  
      estadoId: idEstado,    
      nombrePresentacion :nombrePresentacion,
      equipo :equipo,
      periodo: periodo
       }
        this.service.descargarExcelBonosRechazados(jsonRechazo).subscribe((data:any) => {
        console.log("data----------------->"+data[0]);
        console.log("data----------------->"+data[1]);
          // validar que si no hay datos rechazados informe dichomensaje y no descargue excel vacio
        if(data[1] > 0) {      
              const downloadLink = document.createElement('a');
              downloadLink.href = data[0]; //file;
              downloadLink.download = nombrePresentacion ; // fileName;
              downloadLink.click();
        } else {
                 this.openSnackBar1("NO SE REGISTRAN BONOS RECHAZADOS");
                 console.log("NO SE REGISTRAN BONOS RECHAZADOS");
        }

      
      });
    }
  
 openSnackBar1(mensaje:string) {
  this._snackBar.open(mensaje, 'Aceptar', {
  });
 }



    consultarLotes(idArchivo: number, nombrePresentacion : string, equipo: number, idEstado:number, periodo:any){
      // alert(equipo);
        var jpendiente : any = {  
        id : idArchivo,  
        estadoId: idEstado,    
        nombrePresentacion :nombrePresentacion,
        equipo :equipo,
        periodo: periodo
         }
  
          this.service.obtenerLotes(jpendiente).subscribe((data:any) => {
         
            //this.lotesArray = data;
            //this.lotesArray = data.toString();
           //const nroLoteAsString: string = String(data.nroLote);
            //console.log (nroLoteAsString);
              
                     
           console.log("data 22222:" + JSON.stringify(data));

          // const cadenaJson: string = JSON.stringify(data);
              if(data == ""){//REVISAR SI DATA NO DEBERIA DEVOLVER UN NRO. (1) CARGADO o si  es porque ya estan facturados (3)
                   this.openSnackBar1("No existen lotes para eliminar. Revise si los bonos en cuestion no fueron facturados. Debe clickear el boton ACTUALIZAR para avanzar con el procesamiento normal del archivo. ");
                this.listadoHeadersProformas();
                  }else{  this.mostrarLotes(data); }
         
         
        });
      }
  
      mostrarLotes(info ){
        console.log("data mostrar:" + JSON.stringify(info))
        const dialogRef =  this.dialog.open(this.mostrarLotesDialog, {
          disableClose: true,
          autoFocus: true ,
          data: info,
         
        });
      
      }



  Enviar(){

  }
  Enviar2(){
    
  }

}
