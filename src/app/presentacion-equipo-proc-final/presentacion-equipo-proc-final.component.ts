import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { EquiposService } from '../servicios/equipos.service';
import { MatDialog } from '@angular/material/dialog';


/*
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EquiposService } from '../servicios/equipos.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import {Moment} from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
*/





@Component({
  selector: 'app-presentacion-equipo-proc-final',
  templateUrl: './presentacion-equipo-proc-final.component.html',
  styleUrls: ['./presentacion-equipo-proc-final.component.scss']
})
export class PresentacionEquipoProcFinalComponent implements OnInit {




       
        user: any;
      
        dataSourceProc: any = new MatTableDataSource();
        //dataSourceACerrar = new MatTableDataSource<any>([]);
        displayedColumnsAProcesar: string[] = [  'ID', 'Equipo','Periodo',  'Cantidad', 'FechaCarga', 'Usuario', 'Estado' ,'FechaCierre', 'UsuCierre',];


        usuario   = JSON.parse(localStorage.getItem("currentUser"))
        idPerfil  =  this.usuario.Sistemas.filter(d => d.Id==environment.idSistema)[0].IdPerfil
        perfilUsu = (this.idPerfil == 1);
       
     
       @ViewChild('loaderDialog') loaderDialog: TemplateRef<any>;
       @ViewChild('confirmarProcesarDialog') confirmarProcesarDialog: TemplateRef<any>;
       @ViewChild('mensajeExitosoProcesarDialog') mensajeExitosoProcesarDialog: TemplateRef<any>;
       @ViewChild('paginator', { read: MatPaginator }) paginator: MatPaginator;

        constructor(private service: EquiposService ,
             
              public dialog: MatDialog
           //   private _snackBar: MatSnackBar /*,
             //   private cdr: ChangeDetectorRef*/
                ) { 
        //  this.user = JSON.parse(localStorage.getItem('rcmUser')) ? JSON.parse(localStorage.getItem('rcmUser')) : '' ;
        this.user = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')) : '' ;
        }

       ngOnInit() {  

       console.log("PERFIL",this.idPerfil);
       console.log(this.perfilUsu);
   
       
          this.proformasAProcesar();

       } 

 


/*
openSnackBar1(mensaje:string) {
  this._snackBar.open(mensaje, 'Aceptar', {
  });
 }

*/


   procesar(){
        const dialogRef2 =  this.dialog.open(this.confirmarProcesarDialog, {
        disableClose: true,
        autoFocus: true ,
        maxWidth: '50vw',
        minWidth: "45vw",
        // data: data
        });

        dialogRef2.afterClosed().subscribe(result => {
              if (result) {  
                  // ABRIR LOADER
                  const loader = this.dialog.open(this.loaderDialog, {
                   disableClose: true,
                   panelClass: 'no-padding-dialog'
                   });  
                   var infoProc  = {  
                       userLog : this.user.usuario,
                       perfil : this.idPerfil
                    }
                  this.service.procesar(infoProc).subscribe({
                         next: (data)=>{
                              this.proformasAProcesar();
                               loader.close();         //  CERRAR LOADER
                               console.log("OK procesados");
                               this.mostrarMensajeExitoProcesar(data);
                        }, error: () =>{
                                  loader.close();     // CERRAR LOADER
                                  console.error("error al procesar los registros");
                        }
                    });
               }
         })
          /* }else{
           let msj2 = 'Debe seleccionar la fecha de cierre';
           this.openSnackBar1(msj2);
          }*/
      }
    




    mostrarMensajeExitoProcesar(resp){
      const dialogRef2 =  this.dialog.open(this.mensajeExitosoProcesarDialog, {
        disableClose: true,
        autoFocus: true ,
        data: resp
      });
    }




proformasAProcesar(){
    let matricula= this.user.usuario;
    console.log("MATRICULA DE SESSION",matricula);

    let dataTable: any[] = [];
    this.dataSourceProc.data = []; 
    this.dataSourceProc._updateChangeSubscription();
    
   
     // this.service.getLotes(matricula, moment(desde).format('DD/MM/YYYY'), moment(hasta).format('DD/MM/YYYY')).subscribe(
      var sistema = this.user.Sistemas.filter(d => d.Id==environment.idSistema);
      console.log(sistema[0])
      //if (sistema.length > 0)  
      let idPerfil = sistema[0].IdPerfil;  //3 medico //1 admin 
     // let idPerfil = sistema[0].IdPerfil==1;  //3 medico //1 admin 
     this.service.listadoProformasAProcesar(matricula,idPerfil).subscribe(
        data => {
        console.log("dataaaaa:" + JSON.stringify(data));
        
        let dataTable = data != null ? data: []; 
        this.dataSourceProc.data = dataTable;
       // this.isLoading = false;
        //this.resetInMemoryFilter();
        this.dataSourceProc._updateChangeSubscription();
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








}
