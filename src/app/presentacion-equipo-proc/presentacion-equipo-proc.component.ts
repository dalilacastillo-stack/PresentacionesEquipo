import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EquiposService } from '../servicios/equipos.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import {Moment} from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-presentacion-equipo-proc',
  templateUrl: './presentacion-equipo-proc.component.html',
  styleUrls: ['./presentacion-equipo-proc.component.scss']
})
export class PresentacionEquipoProcComponent implements OnInit {

        adminForm: FormGroup;
        user: any;
      //  loading = false;
        usuario   = JSON.parse(localStorage.getItem("currentUser"))
        idPerfil  =  this.usuario.Sistemas.filter(d => d.Id==environment.idSistema)[0].IdPerfil
        perfilUsu = (this.idPerfil == 1);

       @ViewChild('loaderDialog') loaderDialog: TemplateRef<any>;
       @ViewChild('confirmarCierreDialog') confirmarCierreDialog: TemplateRef<any>;
       @ViewChild('mensajeExitosoCierreDialog') mensajeExitosoCierreDialog: TemplateRef<any>;
       @ViewChild('confirmarProcesarDialog') confirmarProcesarDialog: TemplateRef<any>;
       @ViewChild('mensajeExitosoProcesarDialog') mensajeExitosoProcesarDialog: TemplateRef<any>;



        constructor(private service: EquiposService ,
              private formBuilder : FormBuilder,
              public dialog: MatDialog,
              private _snackBar: MatSnackBar /*,
                private cdr: ChangeDetectorRef*/
                ) { 
        //  this.user = JSON.parse(localStorage.getItem('rcmUser')) ? JSON.parse(localStorage.getItem('rcmUser')) : '' ;
        this.user = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')) : '' ;
        }

       ngOnInit() {  

       console.log("PERFIL",this.idPerfil);
       console.log(this.perfilUsu);
   
        this.adminForm = this.formBuilder.group({
           fechaCierre:[ ]
         })

       } // ngOnInit


 


  generarCierre(){
     if( this.adminForm.controls.fechaCierre.value !== null){
        // this.loading = true;
        const dialogRef =  this.dialog.open(this.confirmarCierreDialog, {
        disableClose: true,
        autoFocus: true ,
        maxWidth: '50vw',
        minWidth: "45vw",
        // data: data
        });
            dialogRef.afterClosed().subscribe(result => {
               if (result) {
                         // ABRIR LOADER
                        const loader = this.dialog.open(this.loaderDialog, {
                        disableClose: true,
                        panelClass: 'no-padding-dialog'
                         });
                       const fechaCierre = this.adminForm.controls.fechaCierre.value;
                       const fechaFormateada = fechaCierre  
                              ? fechaCierre.toISOString().slice(0, 10).replace(/-/g, '/')
                              : null;
                        var jsonCierre : any = {  
                         //   fechaCierre : this.adminForm.controls.fechaCierre.value.format('YYYY/MM/DD'), 
                         //   fechaCierre: this.adminForm.controls.fechaCierre.value.format('YYYY/MM/DD'), 
                              fechaCierre: fechaFormateada,
                              userLog : this.user.usuario,
                              fechaLog :moment().format("YYYY-MM-DD HH:mm:ss"),
                              fechaCarga :moment().format("YYYY-MM-DD HH:mm:ss")     
                         };       
                       this.service.generarCierre(jsonCierre).subscribe({
                                next: (data)=>{
                                      loader.close();        //  CERRAR LOADER
                                      this.mostrarMensajeExitoCierre(data);
                                      },
                                error: () => { 
                                      loader.close();        //  CERRAR LOADER
                                       console.error("error al generar el cierre");
                                      }
                             });
                  }
             } )
      }else{
      let msj2 = 'Debe seleccionar la fecha de cierre';
      this.openSnackBar1(msj2);
       }
    }
    

openSnackBar1(mensaje:string) {
  this._snackBar.open(mensaje, 'Aceptar', {
  });
 }




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
    


      chosenYearHandler(normalizedYear: Moment) {
    if (this.adminForm.controls.fechaCierre.value != null) {
      const ctrlValue =  this.adminForm.controls.fechaCierre.value;
      ctrlValue.year(normalizedYear.year());
      this.adminForm.controls.fechaCierre.setValue(ctrlValue);
    }
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    if ( this.adminForm.controls.fechaCierre.value != null) {
      const ctrlValue =  this.adminForm.controls.fechaCierre.value;
    //  ctrlValue.month(normalizedMonth.month());
      this.adminForm.controls.fechaCierre.setValue(ctrlValue);
      datepicker.close();
    }
  }


  mostrarMensajeExitoCierre(resp){
        const dialogRef =  this.dialog.open(this.mensajeExitosoCierreDialog, {
        disableClose: true,
        autoFocus: true ,
        data: resp
      });
    }

    mostrarMensajeExitoProcesar(resp){
      const dialogRef2 =  this.dialog.open(this.mensajeExitosoProcesarDialog, {
        disableClose: true,
        autoFocus: true ,
        data: resp
      });
    }


}
