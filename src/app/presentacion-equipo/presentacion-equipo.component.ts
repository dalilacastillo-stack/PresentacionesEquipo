
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators ,} from '@angular/forms';
import * as moment from 'moment';
import {Moment} from 'moment';
import * as XLSX from 'xlsx';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MatDatepicker} from '@angular/material/datepicker';
//import { MatDialog } from '@angular/material';
import { MatDialog } from '@angular/material/dialog';
import { EquiposService } from '../servicios/equipos.service';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
//import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { PrefixNot } from '@angular/compiler';
//import { trigger } from '@angular/animations';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSelectChange } from '@angular/material/select';
import { MatPaginator } from '@angular/material/paginator';


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

    //--  archivoCargado: File | null = null;
    //--  fileError: string | null = null;

    /*  selectedValue!: number;
      numericOptions = [
        { value: 995449, viewValue: '- A' },
        { value: 995082, viewValue: '- B' },
        { value: 995170, viewValue: '- C' },
        { value: 995213, viewValue: '- D' },
        { value: 995452, viewValue: '- E' },
      
      ];*/

     /* numericOptions = [
        { Matricula: 995449, NombreEquipo: 'A' },
        { Matricula: 995082, NombreEquipo: 'B' },
        { Matricula: 995170, NombreEquipo: 'C' },
        { Matricula: 995213, NombreEquipo: 'D' },
        { Matricula: 995328, NombreEquipo: 'E' },
        { Matricula: 995452, NombreEquipo: 'F' },
        { Matricula: 995167, NombreEquipo: 'G' },
        { Matricula: 995102, NombreEquipo: 'G' },
        ];
*/




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

    usuario   = JSON.parse(localStorage.getItem("currentUser"))
    matricula = this.usuario.usuario;
    idPerfil  =  this.usuario.Sistemas.filter(d => d.Id==environment.idSistema)[0].IdPerfil
  
    perfilUsu = (this.idPerfil == 1);

    presentacionForm: FormGroup;

    excelData: any[] = [];

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

     //*******************Corresponde con la grilla***************
    // displayedColumns: string[] = ['numero','bono', 'codigo', 'matricula'];
     displayedColumns: string[] = [ 'index','Bono', 'Codigo', 'Matricula'];
    //dataSource: any[] = [];
     dataSource = new MatTableDataSource<any>(this.excelData);
    //**************************************************************

     
     equipoValido= false;
     archivoSeleccionado : File | null = null;
     mensajeInformativo= "";

     @ViewChild('loaderDialogEnviar') loaderDialogEnviar: TemplateRef<any>;
     @ViewChild('fileInput') fileInput!: ElementRef;
     @ViewChild('confirmarPresentacionDialog') confirmarPresentacionDialog: TemplateRef<any>;
     @ViewChild('mensajeExitosoDialog') mensajeExitosoDialog: TemplateRef<any>;
     @ViewChild(MatPaginator) paginator!: MatPaginator;

          
    constructor(private service: EquiposService,
                private formBuilder : FormBuilder,
                public dialog: MatDialog, 
             //   private _snackBar: MatSnackBar,
                private cdr: ChangeDetectorRef
                ) { 
      //  this.user = JSON.parse(localStorage.getItem('rcmUser')) ? JSON.parse(localStorage.getItem('rcmUser')) : '' ;
        this.user = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')) : '' ;
    }

   ngOnInit() {  

    console.log("PERFIL ACTUAL",this.idPerfil);
    console.log(this.perfilUsu);
    //valida si es un equipo
    const esEquipo = /^[0-9]{6}$/.test(this.matricula.trim()) && this.matricula.trim().startsWith("995");

    if ((this.idPerfil == 3 ) && (esEquipo == true)) {
    //  this.equipos =  //getInfoEquipo   
     this.getInfoEquipo();

            
    }else{ 
      this.getEquipos() ;
    }
  
/*
  nombre: ['', Validators.required],
      fechaNacimiento: [{ value: '', disabled: true }, Validators.required],
     
      archivoExcel: [{ value: '', disabled: true }, Validators.required]
*/

    this.presentacionForm = this.formBuilder.group({
      // Campo de texto: Numero del equipo (obligatorio) - perfil admin
       numeroEquipoText: ['', [Validators.required, Validators.pattern(/^\d{1,6}$/)]],
         // Campo de fecha: Fecha de Inicio (obligatorio)
      // El valor inicial puede ser null o una fecha, Validators.required lo valida
       //periodo : [ ],
    // ---periodo :  [null, Validators.required] ,
     periodo :   [{ value: '', disabled: true }, Validators.required],
   // Campo de seleccion Nro de Equipo (obligatorio) - perfil medico
     // numeroEquipo: ['', Validators.required],
      numeroEquipo:[],
   
       // Campo de archivo: Archivo Adjunto (obligatorio)
      // Usamos 'null' como valor inicial y un validador personalizado 'fileRequiredValidator'
    //  archivo : []
   //  archivo: [null, this.fileRequiredValidator()]
 
     // periodo :moment(new Date()).format("YYYYMM"),
     archivo:[{ value: '', disabled: true }, Validators.required]

    
   // periodo : [new FormControl({ value: '', disabled: false })],
     
    })
       /* this.presentacionForm = new FormGroup({
                  usuarioSesion: new FormControl({ value: '', disabled: false }),
                  periodo: new FormControl({ value: ''}),
                 // periodo: new FormControl(moment().startOf('month'), [Validators.required, this.validatePeriodo()]),
        });*/
    this.maxDate.setMonth(this.maxDate.getMonth() - 1);
    this.minDate.setMonth(this.minDate.getMonth() - 3);

   // this.maxDateCierre.setMonth(this.maxDateCierre.getMonth() - 0);
   // this.minDateCierre.setMonth(this.minDateCierre.getMonth() - 0);
    //perfilUsu: Number;
   // this.presentacionForm.controls.periodo.setValue(moment());
   // this.presentacionForm.controls.periodo.setValue(null);
         
   

 this.presentacionForm.get('numeroEquipoText')?.valueChanges.subscribe(valor => {
      this.tieneTexto = valor && valor.trim().length > 0;

      // Si el usuario escribe → vuelve a pendiente
      this.estadoValidacion = 'pendiente';
    });


  //  this.dataSource.paginator = this.paginator; 

     }
   

// SOLUCIÓN: obtener tamaño correcto incluso antes de tener filteredData
  getLength(): number {
    return this.dataSource?.filteredData?.length ?? this.dataSource.data.length;
  }
 
getInfoEquipo(){
     this.service.getInformacionEquipo(this.usuario.usuario)
  .subscribe((result : any)=>{ 
       const equipoAdaptado = {
                                 Matricula: result.IdEquipo,
                                 NombreEquipo: result.Nombre
                               };
          console.log("equipoAdaptado", equipoAdaptado)                     

       this.equipos.push(equipoAdaptado);
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


  // Getter para acceder fácilmente a los controles del formulario en la plantilla HTML
 /* get numeroEquipoControl() { return this.presentacionForm.get('numeroEquipo'); }
  get numeroControl() { return this.presentacionForm.get('numeroEquipoText');  }
  get periodoControl() { return this.presentacionForm.get('periodo');  }
  */


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
      //  console.log('onBlurNombre', this.confirmarHabilitado);
    }
  }

  onFechaSeleccionada2() {
    const fecha = this.presentacionForm.get('periodo')?.value;
    if (fecha && this.equipoValido) {
      this.presentacionForm.get('archivo')?.enable();
      //  console.log('onFechaSeleccionada', this.confirmarHabilitado);
          console.log('fecha', fecha);
      //  this.mensajeInformativo = '📂 Seleccioná un archivo .xlsx';
    }
  }


//*************************************Corresponde con la grilla************************************************************/
/*
volver(): void {
  window.history.back();
}
*/
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
    

 //this.confirmar();

   /* En esta parte se envia a traves del servicio toda la informacion y se informa en pantalle el resultado.
    this.equipoService.enviarDatos(payload).subscribe(res => {
      if (res.success) {
        this.mensaje = '✅ Datos enviados correctamente.';
        this.form.reset();
        this.form.get('fecha')?.disable();
        this.form.get('archivo')?.disable();
        this.equipoValido = false;
        this.archivoSeleccionado = null;
      }
    });*/
}

/*
 onFechaSeleccionada() {

    if (this.presentacionForm.controls.periodo.valid && this.equipoValido) {
      //console.log("ON FECHA SELECCIONADA", this.presentacionForm.controls.periodo.value)
      this.presentacionForm.controls.archivo.enable();
      this.mensajeInformativo = 'Seleccione archivo .xlsx';
    }
  }*/

  onArchivoSeleccionado(event: any) {
    const file = event.target.files[0];
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
       this.archivoSeleccionado = file;
      
       this.LeerExcel(event)
       this.cdr.detectChanges();
       //para actualizar nuevamente el archivo subido
      // this.fileInput.nativeElement.value = null;
    } else {
      this.archivoSeleccionado = null;
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
        // 🔥 Limpia el input y quita el nombre del archivo
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

//confirma2() {
/*
 if (this.presentacionForm.valid) {
      console.log('Formulario enviado', this.presentacionForm.value);
    }*/

// if (this.presentacionForm.valid && this.confirmarHabilitado) {
     // console.log('Formulario válido!!!!', this.presentacionForm.value);
 //   }
//  }

    
    guardarInformacion(){
        const dialogRef =  this.dialog.open(this.confirmarPresentacionDialog, {
        disableClose: true,
        autoFocus: true //,
        // data: element
        });
        
        dialogRef.afterClosed().subscribe(result => {
          console.log("resultado Excel---->:" + JSON.stringify(result));
          if (result) {    
                        // ABRIR LOADER
                        const loaderEnvio = this.dialog.open(this.loaderDialogEnviar, {
                        disableClose: true,
                        panelClass: 'no-padding-dialog'
                         });
                         /*----------quitar para cuando se implemente el tema del perfil---------------------*/
                          if(this.idPerfil == 1) {
                                this.numEquipo = this.presentacionForm.controls.numeroEquipoText.value;
                             }else {this.numEquipo = this.presentacionForm.controls.numeroEquipo.value}
                          /*---------------------------------------------------------------------------------*/
                          /* console.log("resultado Excel 2---->:" + JSON.stringify(this.excelData));*/
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
                                       //console.error("error al generar el cierre");
                                      }
                             });
                 }else{  
                         this.presentacionForm.reset();
                         this.presentacionForm.get('periodo')?.disable();
                         this.presentacionForm.get('archivo')?.disable();
                         this.equipoValido = false;
                         this.mensajeInformativo = '';
                         // Limpia tu variable también
                         this.archivoSeleccionado = null;
                          //  Limpia el input y quita el nombre del archivo
                         this.fileInput.nativeElement.value = null;
                         this.excelData = null; //limpio grilla
                         this.cantidadBonos = 0;
                          this.dataSource.data = [];
                       }  
        })
            //limpiar listado bonos
     }



    mostrarMensajeExito(resp ){
        const dialogRef =  this.dialog.open(this.mensajeExitosoDialog, {
        disableClose: true,
        autoFocus: true ,
        data: resp
      });
    }

  
 
    LeerExcel(event: any) {  
       this.errors = []; //limpio lista de errores...
       this.excelData = null; //limpio grilla
       this.dataSource.data = [];
       this.cantidadBonos = 0;
       let file = event.target.files[0];
      if (file !== undefined){
           const fileReader = new FileReader();
           fileReader.readAsArrayBuffer(file);
           fileReader.onload = (e) => {
                 const data = new Uint8Array(fileReader.result as ArrayBuffer);
                 const workbook = XLSX.read(data, { type: 'array' });
                 const sheetName = workbook.SheetNames[0];
                 const worksheet = workbook.Sheets[sheetName];
                 console.log("worksheet-->" + JSON.stringify(worksheet));
                 // console.log("worksheet2", worksheet);
                 // this.validateMissingHeaders(worksheet);
                  const headers = ['Bono', 'Codigo', 'Matricula'];
                  if (!this.isValidCantidadDeColumnas(worksheet, headers)){
                          this.archivoSeleccionado = null;
                          console.log("isValidCantidadDeColumnas");
                          this.cdr.detectChanges();
                          return ;
                     }
                  this.excelData = XLSX.utils.sheet_to_json(worksheet, { header: headers });
                  this.cantidadBonos = (this.excelData.length) - 1;
                    // this.excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName[0]]);
                   // console.log("resultado Json antes:" + JSON.stringify(this.excelData));
                   //console.log('primer elemento',this.excelData[0]);
                  this.excelData.splice(0, 1);//elimina el header para mostrarlo en tabla html
                  this.dataSource.data = this.excelData;
                  this.dataSource.paginator = this.paginator;   // Asigno el paginator si no se hizo antes
                  this.paginator.firstPage();   // Reseteo a la primera página
                  if(!this.validarCantidadRegistros(this.excelData)){     
                        this.archivoSeleccionado = null;
                        this.cdr.detectChanges();
                       return ;
                  }
                 if(!this.validarLongitudDatos(this.excelData)){
                      this.archivoSeleccionado = null;
                      this.cdr.detectChanges();
                     return ;
                  }
                 if(!this.validarTipoDeDatos(this.excelData)){
                      this.archivoSeleccionado = null;
                      this.cdr.detectChanges();
                       return ;
                    }
                 console.log("datos del archivo excell--->",this.excelData);
                 this.presentacionForm.get('archivo')?.setValue(file);
                 this.cdr.detectChanges();
                }
           }else{ 
            }
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
      if (data) {
        const hData = data[0]; //header del excel cargado
        if (hData && (headers.length !== (hData as Array<any>).length)) {
          const msj = "La cantidad de columnas del excel cargado no coincide con lo establecido. Por favor, revise los datos.";
          this.errors.push(msj);
         // this.mensajeInformativo = "La cantidad de columnas del archivo seleccionado no tiene 3 columnas. Por favor, revise los datos.";
          return false;
        } else {
                 return true }
      }
     return false;
    }

    validarLongitudDatos(excelData: any): any {
      let respuesta = true;
      let nroFila = 0
      for (let i = 0; i < excelData.length; i++) {
        //console.log('BONO a validar:',excelData[i].Bono);
         console.log('BONO longitud:',JSON.stringify(excelData[i].Bono).length);
             console.log('CODIGO longitud:',JSON.stringify(excelData[i].Codigo).length);
                 console.log('MATRICULA longitud:',JSON.stringify(excelData[i].Matricula).length)
         if (((JSON.stringify(excelData[i].Bono).length) < 17) && // observar que si tienen letras la longitud son 2 caracteres mas
            ((JSON.stringify(excelData[i].Codigo).length) < 9) &&
            ((JSON.stringify(excelData[i].Matricula).length) < 9)) //&&
         //   ((JSON.stringify(excelData[i].Equipo).length) < 7)) 
            {
              /*  console.log('BONO longitud:',JSON.stringify(excelData[i].Bono).length);
                 console.log('CODIGO longitud:',JSON.stringify(excelData[i].Codigo).length);
                 console.log('MATRICULA longitud:',JSON.stringify(excelData[i].Matricula).length)*/
           // console.log('Respuesta Verdadera', respuesta);
          //  this.desbloquear();
          } else {
            respuesta = false;
            //console.log('Respuesta Falsa', respuesta);
            nroFila = i+1;
            const msj = "Error en la longitud de los datos ingresados en la fila " + nroFila + ".";
             // this.mensajeInformativo = "Error en la longitud de los datos ingresados en la fila " + nroFila + ". Por favor, revise los datos.";
             this.errors.push(msj);
             return respuesta;
             break;
          }
       }
       return respuesta;
    }

     validarTipoDeDatos(excelData: any): any {
      let respuesta = true;
      let nroFila = 0;
      for (let i = 0; i < excelData.length; i++) {
         if ((typeof (excelData[i].Matricula) === "number")
       //  && (typeof (excelData[i].Equipo) === "number")
        )
         {
          //  console.log('Verdadero', i);
         //   this.desbloquear()
         } else {
          //  console.log('Falso', i);
          nroFila = i+1;
            const msj = "Error en los tipos de datos ingresados en la fila " + nroFila + ".";
            this.errors.push(msj);
           //  this.mensajeInformativo = "Error en los tipos de datos ingresados en la fila " + nroFila + ". Por favor, revise los datos.";
            return respuesta = false;
            break;
         }
       }
      return respuesta;
     }
 

//usado
/*
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>) {
   if ( this.presentacionForm.controls.periodo.value != null) {
      const ctrlValue = this.presentacionForm.controls.periodo.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.presentacionForm.controls.periodo.setValue(ctrlValue);
    datepicker.close();
    }
  }

*/


chosenYearHandlerPer(normalizedYear: Moment) {
 // if (this.presentacionForm.controls.periodo.value != null) {
    const ctrlValue =  this.presentacionForm.controls.periodo.value;//?? moment();
    ctrlValue.year(normalizedYear.year());
    this.presentacionForm.controls.periodo.setValue(ctrlValue);
  //}
}

chosenMonthHandlerPer(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
 // if ( this.presentacionForm.controls.periodo.value != null) {
    const ctrlValue =  this.presentacionForm.controls.periodo.value;
    ctrlValue.month(normalizedMonth.month());
    this.presentacionForm.controls.periodo.setValue(ctrlValue);
    datepicker.close();
 // }
}




}
