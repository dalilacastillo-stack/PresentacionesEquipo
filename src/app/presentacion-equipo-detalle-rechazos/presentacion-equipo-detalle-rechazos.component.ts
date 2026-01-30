import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { EquiposService } from '../servicios/equipos.service';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-presentacion-equipo-detalle-rechazos',
  templateUrl: './presentacion-equipo-detalle-rechazos.component.html',
  styleUrls: ['./presentacion-equipo-detalle-rechazos.component.scss']
})
export class PresentacionEquipoDetalleRechazosComponent implements OnInit {

   displayedCol: string[] = [  'Bono', 'Codigo','Matricula',  'motivoRechazo' ];
   dataSourceDetalle : any = new MatTableDataSource();
   user:any;
  
   idPresentacion!: number;
   resumenPresentacion: any = null;

  @ViewChild('paginator', { read: MatPaginator }) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private service: EquiposService,private router: Router) {

   this.user = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')) : '' ;

  }

    ngOnInit(): void {
  this.idPresentacion = Number(this.route.snapshot.paramMap.get('id'));
  this.cargarDetalle(this.idPresentacion);
  }

    ngAfterViewInit() {
      this.dataSourceDetalle.paginator = this.paginator; // ahora sí funciona
  }


 cargarDetalle(id: number): void {
    let matricula= this.user.usuario;
    console.log("MATRICULA DE SESSION",matricula);
   
    //let dataTable: any[] = [];
    this.dataSourceDetalle.data = []; 
    this.dataSourceDetalle._updateChangeSubscription();
    
   
      var sistema = this.user.Sistemas.filter(d => d.Id==environment.idSistema);
      console.log(sistema[0])
      //if (sistema.length > 0)  
      let idPerfil = sistema[0].IdPerfil;  //3 medico //1 admin 
     // let idPerfil = sistema[0].IdPerfil==1;  //3 medico //1 admin 
     this.service.getDetalleRechazos(id,matricula,idPerfil).subscribe(
        data => {
        //console.log("data:" + JSON.stringify(data));
        
        //let dataTable = data != null ? data: []; 
      const dataTable: any[] = Array.isArray(data) ? data : [];
        this.dataSourceDetalle.data = dataTable;

      if (dataTable.length > 0) {
        const item = dataTable[0];
        this.resumenPresentacion = {
        nroPresentacion: item.id,
        nombrePresentacion: item.nombrePresentacion,
        equipo: item.equipo,
        periodo: item.periodo,
        cantidadBonos: item.cantidadRegistros,
        fechaCarga: item.fechaCarga,
        usuarioCarga: item.usuarioCarga
      };
    }


        this.dataSourceDetalle._updateChangeSubscription();
       
        },
        error => {
          if (error.status != 0) {  
            console.log('Ocurrió un error al obtener los bonos rechazados');
           
          }
      
        }
      );
  }


  volver(): void {
     this.router.navigate(['/equipos-rechazos']);
    }





    verExcelRechazos(idArchivo: number, nombrePresentacion : string, equipo: number, idEstado:number, periodo:any){
    // alert(equipo);
      const jsonRechazo : any = {  
      id : idArchivo,  
      estadoId: idEstado,    
      nombrePresentacion :nombrePresentacion,
      equipo :equipo,
      periodo: periodo
       }
        this.service.obtenerExcelBonosRechazados(jsonRechazo).subscribe((data:any) => {
        console.log("data----------------->"+data[0]);
        console.log("data----------------->"+data[1]);
          // validar que si no hay datos rechazados informe dichomensaje y no descargue excel vacio
        if(data[1] > 0) {      
              const downloadLink = document.createElement('a');
              downloadLink.href = data[0]; //file;
              downloadLink.download = nombrePresentacion ; // fileName;
              downloadLink.click();
        } else {
                 //this.openSnackBar1("NO SE REGISTRAN BONOS RECHAZADOS");
                 console.log("NO SE REGISTRAN BONOS RECHAZADOS");
        }

      
      });
    }



 
}
