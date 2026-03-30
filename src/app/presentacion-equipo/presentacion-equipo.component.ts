
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators ,} from '@angular/forms';
import * as moment from 'moment';

import {Moment} from 'moment';
moment.locale('es');

import * as XLSX from 'xlsx';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';



import { EquiposService } from '../servicios/equipos.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { environment } from 'src/environments/environment';
import { PrefixNot } from '@angular/compiler';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';



interface ExcelRow {
  Bono: any;
  Codigo: any;
  Matricula: any;
  _errors?: {
    Bono?: boolean;
    Codigo?: boolean;
    Matricula?: boolean;
  };
}


declare var $:any;
const HEADERS_MAP = new Map();
HEADERS_MAP.set(0, "Bono");
HEADERS_MAP.set(1, "Codigo");
HEADERS_MAP.set(2, "Matricula");
HEADERS_MAP.set(3, "Equipo");


export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



@Component({
  selector: 'app-presentacion-equipo',
  templateUrl: './presentacion-equipo.component.html',
  styleUrls: ['./presentacion-equipo.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
       {
          provide: DateAdapter,
          useClass: MomentDateAdapter ,
          deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
       {
          provide: MAT_DATE_FORMATS,
          useValue: MY_FORMATS
        },
               ],

               changeDetection: ChangeDetectionStrategy.OnPush,

animations: [
    trigger('animarIcono', [
      state('pendiente', style({ transform: 'scale(1)' })),
      state('valido', style({ transform: 'scale(1.2)' })),
      state('invalido', style({ transform: 'scale(1.2)' })),
      transition('* => valido', animate('200ms ease-in')),
      transition('* => invalido', animate('200ms ease-in')),
      transition('* => pendiente', animate('150ms ease-out'))
    ]),

  /* 🔹 NUEVA ANIMACIÓN PARA LA TARJETA */
   // Animación del ícono para dar feedback
    trigger('iconPulse', [
      transition(':enter', [
        style({ transform: 'scale(0.8)', opacity: 0 }),
        animate('250ms ease-out',
          style({ transform: 'scale(1)', opacity: 1 })
        )
      ])
    ]),

    // Animación de apertura/cierre de la tarjeta
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        )
      ]),
      transition(':leave', [
        animate('250ms ease-in',
          style({ opacity: 0, transform: 'translateY(-10px)' })
        )
      ])
    ])
 


]



    })
  
    export class PresentacionEquipoComponent implements OnInit {


      

   

    showInfoCard = true;

  // Estado para tu animación del icono
//  iconState: 'pendiente' | 'valido' | 'invalido' = 'pendiente';

  toggleCard() {
    this.showInfoCard = !this.showInfoCard;
  }

 
    //*****************para validacion del boton del equipo********************************* */
    validado = false;

 estadoValidacion: 'pendiente' | 'valido' | 'invalido' = 'pendiente';
  tieneTexto = false;

  get icono(): string {
    if (this.estadoValidacion === 'valido') return 'check_circle';
    if (this.estadoValidacion === 'invalido') return 'error';
    return 'hourglass_empty'; // pendiente
  }

  get colorIcono(): string {
    if (this.estadoValidacion === 'valido') return 'green';
    if (this.estadoValidacion === 'invalido') return 'red';
    return 'gray';
  }

  get tooltipText(): string {
    if (this.estadoValidacion === 'valido') return 'Validado correctamente';
    if (this.estadoValidacion === 'invalido') return 'El valor ingresado no corresponde con un Nro. de Equipo';
    return 'Pendiente de validación';
  }
//**************************************************************** */

    numEquipo:number = -1;
    periodoTexto!: string;
    cantidadRegistros:number =0;
    
    usuario   = JSON.parse(localStorage.getItem("currentUser"))
    matricula = this.usuario.usuario;
    idPerfil  =  this.usuario.Sistemas.filter(d => d.Id==environment.idSistema)[0].IdPerfil
  


    perfilUsu = (this.idPerfil == 1);

    presentacionForm: FormGroup;

    excelData: ExcelRow[] = [];

     cantidadBonos: number;
     errors: any[] = [];
     user: any;
     maxDate = new Date();
     minDate = new Date();
     maxDateCierre = new Date();
     minDateCierre = new Date();
     generarCierreHabilitado: boolean = false;
   
     //equipos: any;
     equipos:any[]  = [];
     filasConError: Set<number> = new Set();
     totalErroresExcel = 0;

     //*******************Corresponde con la grilla***************
   
     displayedColumns: string[] = [ 'index','Bono', 'Codigo', 'Matricula'];
    
     dataSource = new MatTableDataSource<any>(this.excelData);
    //**************************************************************

     
     equipoValido= false;
     archivoSeleccionado : File | null = null;
     nombreArchivo: string | null = null;

     mensajeInformativo= "";

dialogData!: {
  ID: number;
  Equipo:number;
  Periodo: string;
  cantidad: number;
};



     @ViewChild('loaderDialogEnviar') loaderDialogEnviar: TemplateRef<any>;
     @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;    
     @ViewChild('confirmarPresentacionDialog') confirmarPresentacionDialog: TemplateRef<any>;
     @ViewChild('mensajeExitosoDialog') mensajeExitosoDialog: TemplateRef<any>;
     @ViewChild(MatPaginator) paginator!: MatPaginator;
     

          
    constructor(private service: EquiposService,
                private formBuilder : FormBuilder,
                public dialog: MatDialog, 
              
       
                private cdr: ChangeDetectorRef
                ) { 
     
        this.user = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')) : '' ;
    }

   ngOnInit() {  
    console.log("usuarioo ",this.usuario);

    console.log("PERFIL ACTUAL   idPerfil-->",this.idPerfil);
    console.log("PERFIL ACTUAL perfilUsu-->",this.perfilUsu);
    //valida si es un equipo
    //const esEquipo = /^[0-9]{6}$/.test(this.matricula.trim()) && this.matricula.trim().startsWith("995");

   // if ((this.idPerfil == 3 ) && (esEquipo == true)) {
    //  this.equipos =  //getInfoEquipo    */
    
    if (this.idPerfil == 1 ){
      this.getInfoEquipo();
            
    }else{ 
      this.getEquipos() ;
    }
  


    this.presentacionForm = this.formBuilder.group({
 
       numeroEquipoText: ['', [Validators.required, Validators.pattern(/^\d{1,6}$/)]],
       periodo: [{ value: null, disabled: true }, Validators.required],
       numeroEquipo:[],
       archivo:[{ value: '', disabled: true }, Validators.required]
       
    })
     
    this.maxDate.setMonth(this.maxDate.getMonth() - 1);
    this.minDate.setMonth(this.minDate.getMonth() - 3);

         
   

 this.presentacionForm.get('numeroEquipoText')?.valueChanges.subscribe(valor => {
      this.tieneTexto = valor && valor.trim().length > 0;

      // Si el usuario escribe → vuelve a pendiente
      this.estadoValidacion = 'pendiente';
    });

     }
   

// SOLUCIÓN: obtener tamaño correcto incluso antes de tener filteredData
  getLength(): number {
    return this.dataSource?.filteredData?.length ?? this.dataSource.data.length;
  }
 
getInfoEquipo(){

  console.log("this.usuario.usuario", this.usuario.usuario)   ;
     this.service.getInformacionEquipo(this.usuario.usuario)
  .subscribe((result : any)=>{ 
     // if(result.length >0) {
       const equipoAdaptado = {
                                 Matricula: result.IdEquipo,
                                 NombreEquipo: result.Nombre
                               };

                             
          console.log("equipoAdaptado", equipoAdaptado)                     

       this.equipos.push(equipoAdaptado);
      //}
  })

}


 getEquipos(){
  this.service.getEquipos(this.usuario.usuario)
  .subscribe((result : any)=>{ 
     if (result.length > 0 ) { 
      console.log("Equipos:",result) 
          this.equipos = result;
      }
  })
 }




 soloNumeros(event: KeyboardEvent) {
    const tecla = event.key;
    if (!/^\d$/.test(tecla)) {
      event.preventDefault();
    }
  }

  limpiarEntrada() {
    const valor = this.presentacionForm.get('numeroEquipoText')?.value || '';
    const soloDigitos = valor.toString().replace(/\D/g, '').slice(0, 6);
    this.presentacionForm.get('numeroEquipoText')?.setValue(soloDigitos, { emitEvent: false });
  }

  // Validar campo individual (onBlur, onFocusout, Enter)
  validarCampo(campo: string) {
    const control = this.presentacionForm.get(campo);
    if (control && control.invalid) {
      control.markAsTouched();
    }
  }

//************************************************************************************************* */

 onBlurNombre() {
    const nombre = this.presentacionForm.get('numeroEquipoText')?.value;
    console.log('numeroEquipoText blur:', nombre);
 
    if (nombre) {
      this.presentacionForm.get('periodo')?.enable();
      
    }
  }



      onFechaSeleccionada2() {
        const fecha = this.presentacionForm.get('periodo')?.value;

        if (fecha && this.equipoValido) {
          this.presentacionForm.get('archivo')?.enable();
          console.log('fecha', fecha);
        } else {
          this.presentacionForm.get('archivo')?.disable(); 
        }
      }







//*************************************Corresponde con la grilla************************************************************/

validarYEnviar() {// cambiar el enviar y llamar al Confirmar
    let fecha= this.presentacionForm.controls.periodo.value;
    /*----------quitar para cuando se implemente el tema del perfil---------------------*/
               if(this.idPerfil == 1) {
                        this.numEquipo = this.presentacionForm.controls.numeroEquipoText.value;
                 }else {this.numEquipo = this.presentacionForm.controls.numeroEquipo.value}
    /*------------------------------------------------------------------------------------*/
  
    if (!this.archivoSeleccionado) { this.mensajeInformativo='Seleccione un archivo válido.'; return; }
    if (fecha == null ) { this.mensajeInformativo='Ingrese una fecha válida.'; return; }
    if (this.numEquipo == null  || this.numEquipo == 0 ) { this.mensajeInformativo='Ingrese un número de equipo válido.'; return; }
   
    console.log("this.archivoSeleccionado", this.archivoSeleccionado);
    console.log("fecha", fecha);
    console.log("this.numEquipo", this.numEquipo);
    this.guardarInformacion();
     
}



  onArchivoSeleccionado(event: any) {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
       this.archivoSeleccionado = file;
       this.nombreArchivo = file.name;
       this.presentacionForm.get('archivo')?.reset();
       this.errors = []; //limpio lista de errores...
       this.excelData = null; //limpio grilla
       this.dataSource.data = [];
       this.cantidadBonos = 0;   

       this.LeerExcel(event)
       this.cdr.detectChanges();
       //para actualizar nuevamente el archivo subido
       this.fileInput.nativeElement.value = null;
    } else {
      this.archivoSeleccionado = null;
      this.nombreArchivo = null;
    //  this.mensajeInformativo = '❌ Solo archivos Excel (.xlsx/.xls).';
    }
  }


validarEquipo(){

//Valida la entrada en numeroEquipoText
//luego llama al servicio y de acuerdo al resultado realizar los siguiente:
//Si existe el equipo habilitar el resto de los inputs
//Si no existe, informarlo y bloquear el resto de los inputs
let equi = this.presentacionForm.controls.numeroEquipoText.value;
if ( equi !== null){
this.service.validarEquipo(equi).subscribe(esValido =>{ 

if (esValido) {
        this.equipoValido = true;
        this.estadoValidacion = 'valido';
        this.presentacionForm.controls.periodo.enable();
      //  this.mensajeInformativo = "✅ Equipo válido.";
      } else {
        this.equipoValido = false;
        this.estadoValidacion = 'invalido';
        this.presentacionForm.controls.periodo.disable();
        this.presentacionForm.controls.archivo.disable();
       // this.mensajeInformativo = '❌ Número de equipo no válido.';
        this.archivoSeleccionado = null;
        this.dataSource.data= []; 
        // Limpia el input y quita el nombre del archivo
        this.fileInput.nativeElement.value = null;
        this.excelData = null; //limpio grilla
        this.cantidadBonos = 0;
       // this.presentacionForm.reset();
        this.presentacionForm.get('periodo')?.reset();
        
      }
      
  })

}
}

//*************metodo que se dispara al seleccionar un item del mat select*/

onEquipoSeleccionado(event: MatSelectChange): void {
  const valorSeleccionado = event.value;
  console.log ("valorSeleccionado", valorSeleccionado)

if (valorSeleccionado !== 0) {
        this.equipoValido = true;
        this.estadoValidacion = 'valido';
        this.presentacionForm.controls.periodo.enable();
      //  this.mensajeInformativo = "✅ Equipo válido.";
      } else {
        this.equipoValido = false;
        this.estadoValidacion = 'invalido';
        this.presentacionForm.controls.periodo.disable();
        this.presentacionForm.controls.archivo.disable();
       // this.mensajeInformativo = '❌ Número de equipo no válido.';
       this.presentacionForm.reset();
        this.archivoSeleccionado = null;
        this.dataSource.data= []; 
        // Limpia el input y quita el nombre del archivo
        this.fileInput.nativeElement.value = null;
        this.excelData = null; //limpio grilla
        this.cantidadBonos = 0;
      } 
 
}



/* VERSION ORIGINAL
validarEquipo(){

//debe validar el valor que ingreso en numeroEquipoText
//llamar al servicio y de acuerdo al resultado realizar los siguiente:
//Si existe el equipo habilitar el resto de los inputs
//Si no existe, informarlo y bloquear el resto de los inputs
let equi = this.presentacionForm.controls.numeroEquipoText.value;
if ( equi !== null){
this.service.validarEquipo(equi).subscribe((result : any)=>{ 

  console.log('EQUIPo: '+ result)  ;
   //if (result.length > 0 ) {  
         
    //  this.equipos = result;
      
  })

}
}*/



    
    guardarInformacion(){

    /*----------quitar para cuando se implemente el tema del perfil---------------------*/
           if(this.idPerfil == 1) {
                 this.numEquipo = this.presentacionForm.controls.numeroEquipoText.value;
                }else {
                  this.numEquipo = this.presentacionForm.controls.numeroEquipo.value
                }
    /*---------------------------------------------------------------------------------*/
 



  const periodoMoment = this.presentacionForm.controls.periodo.value;
 
  this.periodoTexto = periodoMoment.locale('es').format('MMMM YYYY').replace(/^./, c => c.toUpperCase());

  this.cantidadRegistros = this.cantidadBonos;

       console.log("Equipo:" + this.numEquipo);
       console.log("periodo:" + this.periodoTexto);
       console.log("cantidadBonos:" + this.cantidadBonos);

        const dialogRef =  this.dialog.open(this.confirmarPresentacionDialog, {
        disableClose: true,
        autoFocus: true 
        });
        
        dialogRef.afterClosed().subscribe(result => {
          console.log("resultado Excel---->:" + JSON.stringify(result));
          if (result) {    
                        // ABRIR LOADER
                        const loaderEnvio = this.dialog.open(this.loaderDialogEnviar, {
                        disableClose: true,
                        panelClass: 'no-padding-dialog'
                         });
                          
                           var json : any = {
                                       id : 0,
                                       idEstado: 1,
                                       excelData : this.excelData,
                                       cantidadRegistros : this.cantidadBonos,
                                       userLog : this.user.usuario, 
                                       equipo: this.numEquipo,
                                       fechaLog : moment().format("YYYY-MM-DD HH:mm:ss"),
                                       fechaCarga : moment().format("YYYY-MM-DD HH:mm:ss"),
                                       periodo : this.presentacionForm.controls.periodo.value.format('YYYYMM'), // campo del formulario
                                       nombrePresentacion:"Presentacion"+"-"+this.numEquipo+"-"+ moment().format("YYYY-MM-DD HH:mm:ss")+".xlsx",
                                       fechaCierre : moment().format("YYYY-MM-DD HH:mm:ss"),
                                       usuarioCierre : null,
                                       fechaProcess : moment().format("YYYY-MM-DD HH:mm:ss"),
                                       usuarioProcess : null
                                     }
                              this.service.guardar(json).subscribe({
                                 next: (data)=>{
                                      loaderEnvio.close();        //  CERRAR LOADER
                                      console.log("OK guardarDatos", data);
                                      this.errors = []; //limpio lista de errores...
                                      this.presentacionForm.reset();
                                      this.presentacionForm.get('periodo')?.disable();
                                      this.presentacionForm.get('archivo')?.disable();
                                      this.equipoValido = false;
                                      // Limpia tu variable también
                                      this.archivoSeleccionado = null;
                                     // Limpia el input y quita el nombre del archivo
                                      this.fileInput.nativeElement.value = null;
                                       this.excelData = null; //limpio grilla
                                      this.dataSource.data = [];
                                      this.cantidadBonos = 0;
                                      let resp = data;
                                       this.mostrarMensajeExito(resp);         
                                      },
                                error: () => { 
                                       loaderEnvio.close();        //  CERRAR LOADER
                                    
                                      }
                             });
                 }else{  

                         this.presentacionForm.reset();
                         this.presentacionForm.get('periodo')?.disable();
                         this.presentacionForm.get('archivo')?.disable();
                         this.equipoValido = false;
                         this.mensajeInformativo = '';
                 
                         this.archivoSeleccionado = null;
                         this.nombreArchivo = null;
                          //  Limpio el input y quita el nombre del archivo
                         this.fileInput.nativeElement.value = null;
                         this.excelData = null; //limpio grilla
                         this.cantidadBonos = 0;
                          this.dataSource.data = [];
                       }  
        })
           
     }





mostrarMensajeExito(resp: any) {
 
      this.dialogData = {
          ID: resp.ID,
          Equipo: resp.Equipo,
          Periodo: this.periodoTexto,
          cantidad: resp.cantidad
        };

        this.dialog.open(this.mensajeExitosoDialog, {
          disableClose: true,
          autoFocus: true
        });

}



    
 
    LeerExcel(event: any) {  
       
       let file = event.target.files[0];

      if (file !== undefined){
           const fileReader = new FileReader();
           fileReader.readAsArrayBuffer(file);
           fileReader.onload = (e) => {


                 // LIMPIO ESTADO PREVIO
                 this.errors = [];
                 this.filasConError.clear();
                 this.totalErroresExcel = 0;

                 const data = new Uint8Array(fileReader.result as ArrayBuffer);
                                            
                 const workbook = XLSX.read(data, { type: 'array' });

                  /* ======================================================
                    VALIDACIONES DE ESTRUCTURA DEL EXCEL
                    ====================================================== */

                  // Validar que tenga UNA sola hoja
                  if (workbook.SheetNames.length !== 1) {
                    this.errors.push("El archivo debe contener una sola hoja.");
                    this.archivoSeleccionado = null;
                    this.cdr.detectChanges();
                    return;
                  }

                  const sheetName = workbook.SheetNames[0];
                  const worksheet = workbook.Sheets[sheetName];

                  // Validar filas ocultas
                  if (worksheet['!rows']) {
                    const filasOcultas = worksheet['!rows'].some(r => r?.hidden === true);
                    if (filasOcultas) {
                      this.errors.push("El archivo no debe contener filas ocultas.");
                      this.archivoSeleccionado = null;
                      this.cdr.detectChanges();
                      return;
                    }
                  }

                  // Validar celdas combinadas
                  if (worksheet['!merges'] && worksheet['!merges'].length > 0) {
                    this.errors.push("El archivo no debe contener celdas combinadas.");
                    this.archivoSeleccionado = null;
                    this.cdr.detectChanges();
                    return;
                  }

                  //  Validar que no existan fórmulas
                  for (const cellAddress in worksheet) {
                    if (cellAddress.startsWith('!')) continue;

                    const cell = worksheet[cellAddress];
                    if (cell?.f) {
                      this.errors.push("El archivo no debe contener fórmulas. Solo valores fijos.");
                      this.archivoSeleccionado = null;
                      this.cdr.detectChanges();
                      return;
                    }
                  }

                  console.log("worksheet-->" + JSON.stringify(worksheet));
                  const headers = ['Bono', 'Codigo', 'Matricula'];
                 
                 //VALIDAR CANTIDAD DE COLUMNAS
                  if (!this.isValidCantidadDeColumnas(worksheet, headers)){
                          this.archivoSeleccionado = null;
                          console.log("isValidCantidadDeColumnas");
                          this.cdr.detectChanges();
                          return ;
                     }

                    // CONVERTIR EXCEL A JSON
                  this.excelData = XLSX.utils.sheet_to_json(worksheet, {
                                   header: headers,
                                   raw: false,
                                   defval: '',
                                   blankrows: false
                                  });

                  this.cantidadBonos = this.excelData.length - 1;
         
                  // ElIMINO FILA DE ENCABEZADO
                   this.excelData.splice(0, 1);

                  // INICIALIZO FLAGS DE ERROR POR CELDA
              
                  this.excelData = this.excelData.map(row => {
                  const matriculaNormalizada = String(row.Matricula ?? '')
                    .replace(/^'/, '')          // apóstrofo invisible
                    .replace(/\s+/g, '')        // TODOS los espacios (incluye invisibles)
                    .replace(/[^\d]/g, '')      // solo números
                    .trim();

                  return {
                    ...row,
                    Matricula: matriculaNormalizada,
                    _errors: {}
                  };
                });


                  //CARGO LA TABLA
                  this.dataSource.data = this.excelData;
                  this.dataSource.paginator = this.paginator;   // Asigno el paginator si no se hizo antes
                  this.paginator.firstPage();   // Reseteo a la primera página
   
                 //  VALIDACIONES DEL CONTENIDO DEL ARCHIVO (TODAS)
                  const okCantidad = this.validarCantidadRegistros(this.excelData);
                  const okLongitud = this.validarLongitudDatos(this.excelData);
                  const okTipo = this.validarTipoDeDatos(this.excelData);

                  // SI HAY ERRORES → PROCESO Y CORTO
                  if (!okCantidad || !okLongitud || !okTipo) {
                    this.procesarErroresExcel();
                    this.archivoSeleccionado = null;
                    this.cdr.detectChanges();
                    return;
                  }

                  // TODO OK → ACEPTO ARCHIVO
                 this.presentacionForm.get('archivo')?.setValue(file);
                  this.fileInput.nativeElement.value = '';
                 this.cdr.detectChanges();
                }
            
         
              }else{       }
  }


    validarCantidadRegistros(excelData:any):boolean{
          if(this.excelData.length <= 0){
             const msj = "El archivo se encuentra vacio. Asegúrese que contenga una sola hoja";
             //  this.mensajeInformativo = "El archivo se encuentra vacio. Por favor, revise el mismo. Asegúrese de que solo contenga una hoja";
            this.errors.push(msj);
               return false
           } else{return true}
          }


isValidCantidadDeColumnas(worksheet, headers): boolean {

  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (!data || data.length === 0) {
    this.errors.push("El archivo no contiene encabezados.");
    return false;
  }

  const hData = data[0] as Array<any>; // primera fila del excel
  console.log("hData", hData);
  console.log("headers.length ", headers.length );
  console.log("hData.length", hData.length);

    //  1) VALIDAR CAMPOS VACÍOS 
 if ( hData.length < 3) {

  this.errors.push(
      "En la primera fila de cada columna debe completarse con la descripcion Bono, Codigo, Matricula en ese orden y sin acentos."
    );
    return false;
  
 }

  //  2) Validar cantidad de columnas
  if (!hData || headers.length !== hData.length) {
    this.errors.push("La cantidad de columnas del archivo debe ser 3: Bono, Codigo, Matricula.");
    return false;
  }

  
  //  3) Validar nombres exactos de encabezado
  const headersNormalizados = hData.map(h =>     String(h ?? '').trim().toUpperCase()
  );

  const headersEsperados = headers.map(h =>
    h.toUpperCase()
  );

  for (let i = 0; i < headersEsperados.length; i++) {
    if (headersNormalizados[i] !== headersEsperados[i]) {
      this.errors.push(
        "El archivo debe contener encabezados exactos: Bono, Codigo, Matricula (en ese orden y sin acentos)."
      );
      return false;
    }
  }

  return true;
}


  

validarLongitudDatos(excelData: any[]): boolean { 

   
  let hayErrores = false;
  let matriculaReferencia: string | null = null;
   console.log("excelData.length:", excelData.length);

  for (let i = 0; i < excelData.length; i++) {
      console.log("this.totalErroresExcel op2:", this.totalErroresExcel);

    // ===============================
    // ===== VALIDACIÓN BONO =====
    // ===============================
    const bonoRaw = String(excelData[i].Bono ?? '').trim();

    const tieneNotacionCientifica = /e\+|e-/i.test(bonoRaw);
    const soloNumeros = /^[0-9]+$/.test(bonoRaw);
   // const longitudValida = bonoRaw.length > 0 && bonoRaw.length < 17;
   const longitudValida = bonoRaw.length >= 1 && bonoRaw.length <= 16;

     console.log("longitudValida", !longitudValida);
     console.log("tieneNotacionCientifica", tieneNotacionCientifica);
     console.log("soloNumeros", !soloNumeros);


    if (!longitudValida || tieneNotacionCientifica || !soloNumeros) {
      console.log("entro al IF:");
      excelData[i]._errors.Bono = true;
      hayErrores = true;
      this.filasConError.add(i + 1);
      this.totalErroresExcel++;
      console.log("this.totalErroresExcel i:", this.totalErroresExcel);
    } else {
      excelData[i].Bono = bonoRaw;
    }

    // ===============================
    // ===== VALIDACIÓN CÓDIGO =====
    // ===============================
    const codigo = String(excelData[i].Codigo ?? '')
      .trim()
      .toUpperCase();

      /*
   const soloNumerosCod = /^[0-9]{6}$/;
    const alfaNum1       = /^[A-Z]{2}[0-9]{4}$/;
    const alfaNum2       = /^[0-9]{2}[A-Z]{2}[0-9]{2}$/;

    const codigoValido =
      soloNumerosCod.test(codigo) ||
      alfaNum1.test(codigo) ||
      alfaNum2.test(codigo);
      */

     const codigoValido = /^[A-Z0-9]{6}$/.test(codigo);

    if (!codigoValido) {
      excelData[i]._errors.Codigo = true;
      hayErrores = true;
      this.filasConError.add(i + 1);
      this.totalErroresExcel++;
    }

    // ===============================
    // ===== VALIDACIÓN MATRÍCULA =====
    // ===============================
    const matricula = String(excelData[i].Matricula ?? '')
      .replace(/\s+/g, '')
      .replace(/[^\d]/g, '');

    if (!/^\d{4,6}$/.test(matricula)) {
      console.log ("totalErroresExcel seccion Matricula",this.totalErroresExcel);
      excelData[i]._errors.Matricula = true;
      hayErrores = true;
      this.filasConError.add(i + 1);
      this.totalErroresExcel++;
    } else {
      excelData[i].Matricula = matricula;

      // Guardo la primera matrícula válida como referencia
      if (!matriculaReferencia) {
        matriculaReferencia = matricula;
      }
    }
  }



    if (matriculaReferencia) {

     let todasIguales = true;

  // Validar que todas las matrículas sean iguales
  for (let i = 0; i < excelData.length; i++) {
    if (excelData[i].Matricula !== matriculaReferencia) {

        if (!excelData[i]._errors.Matricula) {
              this.totalErroresExcel++;
          }
        excelData[i]._errors.Matricula = true;
        hayErrores = true;
        todasIguales = false;
        this.filasConError.add(i + 1);
  
    }
  }

  // Si no son iguales → mismo mensaje para TODOS los perfiles
  if (!todasIguales) {
    this.errors.push(
      "En la columna MATRÍCULA del archivo debe registrar la misma matricula del profesional para todos los registros."
    );
  }

  // Validación adicional SOLO para perfil != 1
  if (this.idPerfil != 1) {

    const matriculaUsuario = String(this.matricula)
      .replace(/\s+/g, '')
      .replace(/[^\d]/g, '');

    if (matriculaReferencia !== matriculaUsuario) {

      for (let i = 0; i < excelData.length; i++) {
        excelData[i]._errors.Matricula = true;
        this.filasConError.add(i + 1);
      }

      this.errors.push(
        "En la columna MATRÍCULA del archivo debe registrar la matricula del profesional que inicio sesión."
      );

      hayErrores = true;
    }
  }
 }
  return !hayErrores;
}



        validarTipoDeDatos(excelData: any[]): boolean {
          console.log("validarTipoDeDatos");
          let hayErrores = false;

          for (let i = 0; i < excelData.length; i++) {

            const matricula = excelData[i].Matricula;

            // acepta número o string numérico
            const esValida = /^[0-9]+$/.test(String(matricula));

            if (!esValida) {
              excelData[i]._errors.Matricula = true;
              hayErrores = true;
              this.filasConError.add(i + 1);
              this.totalErroresExcel++;
            }
          }

          return !hayErrores;
        }



        procesarErroresExcel() {
          const filas = Array.from(this.filasConError).sort((a, b) => a - b);

          /*
          if (this.totalErroresExcel > 3) {
            this.errors.push(
              `Se detectaron ${this.totalErroresExcel} errores en el archivo.
              Existen más de 3 errores, revise todo el archivo.`
            );
          } */
        console.log("procesarErroresExcel");
        console.log("totalErroresExcel",this.totalErroresExcel);

          if (this.totalErroresExcel > 3) {
          this.errors.push(
            `Existen más de 3 errores, revise todo el archivo.`
          );
        }
          else if (this.totalErroresExcel > 0) {
            this.errors.push(
              `Se detectaron ${this.totalErroresExcel} errores en las filas: ${filas.join(', ')}.`
            );
          }
        }



      /*
      chosenYearHandlerPer(normalizedYear: Moment) {
          const ctrlValue =  this.presentacionForm.controls.periodo.value;
          ctrlValue.year(normalizedYear.year());
          this.presentacionForm.controls.periodo.setValue(ctrlValue);
      }*/

        chosenYearHandlerPer(normalizedYear: Moment) {
           let ctrlValue = this.presentacionForm.controls.periodo.value;
           // si no hay valor, lo creo
             if (!ctrlValue) {
              ctrlValue = moment();
              }
           ctrlValue.year(normalizedYear.year());
             this.presentacionForm.controls.periodo.setValue(ctrlValue);
        }
      /*
      chosenMonthHandlerPer(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
          const ctrlValue =  this.presentacionForm.controls.periodo.value;
          ctrlValue.month(normalizedMonth.month());
          this.presentacionForm.controls.periodo.setValue(ctrlValue);
          datepicker.close();
        }
      }*/

         chosenMonthHandlerPer(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
          let ctrlValue = this.presentacionForm.controls.periodo.value;

          if (!ctrlValue) {
            ctrlValue = moment();
          }

          ctrlValue.month(normalizedMonth.month());
          this.presentacionForm.controls.periodo.setValue(ctrlValue);

       
          this.onFechaSeleccionada2();

          datepicker.close();
        }


}
