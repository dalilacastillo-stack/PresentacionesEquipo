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
import * as moment from 'moment';
import { MatSort } from '@angular/material/sort';





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
  displayedColumns: string[] = [ 'NroPres','NombrePresentacion', 'Equipo', 'Periodo', 'Cantidad','FechaCarga', 'Usuario', 'Estado', 'BonosAceptados', 'BonosRechazados', 'Acciones' ];
  //dataSource : any = new MatTableDataSource();//new MatTableDataSource<listaProf>(); --this.listaProf
  
  
  dataSource = new MatTableDataSource<any>([]);

  lotesArray: string[];

  sortActivo = '';
  direccionSort = '';
 

  @ViewChild('paginator', { read: MatPaginator }) paginator: MatPaginator;
  @ViewChild('confirmarEliminarDialog') confirmarEliminarDialog: TemplateRef<any>;
  @ViewChild('mensajeEliminadoDialog') mensajeEliminadoDialog: TemplateRef<any>;
  @ViewChild('mostrarLotesDialog') mostrarLotesDialog: TemplateRef<any>;
  @ViewChild(MatSort) sort: MatSort;

 
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

/*
    this.dataSource.sortingDataAccessor = (item, property) => {
    switch (property) {
      case 'NroPres': return item.id;
      case 'Equipo': return item.equipo;
      case 'Periodo': return item.periodo;
      case 'Cantidad': return item.cantidadRegistros;
      case 'FechaCarga': return item.fechaCarga;
      case 'Usuario': return item.usuarioCarga;
      case 'Estado': return item.estado;
      default: return item[property];
    }
  };
  */
     this.dataSource.sortingDataAccessor = (item, property) => {
  switch (property) {
    case 'NroPres':
      return Number(item.id);

    case 'Equipo':
      return (item.equipo || '').toString().trim().toLowerCase();

    case 'Periodo':
      return Number(item.periodo);

    case 'Cantidad':
      return Number(item.cantidadRegistros);

    case 'FechaCarga':
      return new Date(item.fechaCarga);

    case 'Usuario':
      return (item.usuarioCarga || '').toString().trim().toLowerCase();

    case 'Estado':
      return (item.estado || '').toString().trim().toLowerCase();

    // 👇 NUEVO
    case 'BonosAceptados':
      return Number(item.aceptados);

    // 👇 NUEVO
    case 'BonosRechazados':
      return Number(item.rechazados);

    default:
      return item[property];
  }
};


     this.listadoHeadersProformas();

    
  }

  ngAfterViewInit() {
      this.dataSource.paginator = this.paginator; // ahora sí funciona
      this.dataSource.sort = this.sort; 

      this.sort.sortChange.subscribe(sort => {
      this.sortActivo = sort.active;
      this.direccionSort = sort.direction;
       });
  }

  listadoHeadersProformas(){
    let matricula= this.user.usuario;
    console.log("MATRICULA DE SESSION",matricula);
  
    this.dataSource.data = []; 
  //  this.dataSource._updateChangeSubscription();
       
      var sistema = this.user.Sistemas.filter(d => d.Id==environment.idSistema);
      console.log(sistema[0])
      //if (sistema.length > 0)  
      let idPerfil = sistema[0].IdPerfil;  //3 medico //1 admin 
     // let idPerfil = sistema[0].IdPerfil==1;  //3 medico //1 admin 
  
     this.service.getHeadersProformas(matricula,idPerfil).subscribe(
        data => {
                   /* let dataTable = data != null ? data: []; 
                    this.dataSource.data = dataTable as any[];
                    */
                     const dataTable = (data || []) as any[];

                    /*determina porque columnas se filtrara*/
                    this.dataSource.filterPredicate = (data: any, filter: string) => {
                      const dataStr = `
                        ${data.id}
                        ${data.nombrePresentacion}
                        ${data.equipo}
                        ${data.periodo}
                        ${data.cantidadRegistros}
                        ${data.fechaCarga}
                        ${data.usuarioCarga}
                        ${data.estado}
                        ${data.aceptados}
                        ${data.rechazados}
                      `.toLowerCase();

                      return dataStr.includes(filter);
                    };


                     
                     this.dataSource.data = dataTable;



                    // CLAVE
                   this.dataSource.paginator = this.paginator;
                   this.dataSource.sort = this.sort;  
                    this.paginator.firstPage();
   
                    },
        error => {
                    if (error.status != 0) {  
                      console.log('Ocurrió un error al obtener los datos de las proformas');
                    // toastr.error('Ocurrió un error al obtener los datos históricos', 'Atención: ');
                    }
                  
        }
      );
     
    
  }
  


    getEstadoClass(estado: string): string {
          switch (estado) {
            case 'Cargado':
              return 'badge-cargado';
            case 'En Proceso':
              return 'badge-enProceso';
            case 'Procesado':
              return 'badge-procesado';
            case 'Eliminado':
              return 'badge-eliminado';
            case 'Pendiente de IOMA-AMP':
              return 'badge-pendiente';
            default:
              return '';
          }
    }


      getNombreColumna(col: string): string {
        const map = {
          NroPres: 'Nro. de Presentación',
          Equipo: 'Equipo',
          Periodo: 'Periodo',
          Cantidad: 'Cantidad de Bonos',
          FechaCarga: 'Fecha de Carga',
          Usuario: 'Usuario',
          Estado: 'Estado',
          BonosAceptados: 'Bonos Aceptados',
          BonosRechazados: 'Bonos Rechazados'
        };

        return map[col] || col;
      }

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
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
        estadoId: 4,
        periodo:data.periodo,
        equipo: data.equipo,
        fechaDeleted: moment().format("YYYY-MM-DD HH:mm:ss"),
        usuarioDeleted: this.user.usuario,
        usuarioCarga:data.usuarioCarga,
        idPerfil: this.idPerfil
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
