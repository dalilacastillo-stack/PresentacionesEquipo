import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EquiposService } from '../servicios/equipos.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentacion-equipo-rechazos',
  templateUrl: './presentacion-equipo-rechazos.component.html',
  styleUrls: ['./presentacion-equipo-rechazos.component.scss']
})
export class PresentacionEquipoRechazosComponent implements OnInit {

  displayedColumns: string[] = [ 'NumPresentacion','NombrePresentacion', 'Equipo', 'Periodo', 'Cantidad','Detalles' ];
  dataSourceRechazos : any = new MatTableDataSource();
  user:any;

  @ViewChild('paginator', { read: MatPaginator }) paginator: MatPaginator;



    constructor(private service: EquiposService, private router: Router ) {
     
     this.user = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')) : '' ;
   
      
   }
 

  ngOnInit(): void {
     this.listadoProformasRechazadas();
  }



  ngAfterViewInit() {
      this.dataSourceRechazos.paginator = this.paginator; // ahora sí funciona
  }


 
  listadoProformasRechazadas(){
    let matricula= this.user.usuario;
    console.log("MATRICULA DE SESSION",matricula);
    //this.isLoading = true;
    let dataTable: any[] = [];
    this.dataSourceRechazos.data = []; 
    this.dataSourceRechazos._updateChangeSubscription();
    
   
      var sistema = this.user.Sistemas.filter(d => d.Id==environment.idSistema);
      console.log(sistema[0])
      //if (sistema.length > 0)  
      let idPerfil = sistema[0].IdPerfil;  //3 medico //1 admin 
     // let idPerfil = sistema[0].IdPerfil==1;  //3 medico //1 admin 
     this.service.getProformasRechazadas(matricula,idPerfil).subscribe(
        data => {
        console.log("data:" + JSON.stringify(data));
        
        let dataTable = data != null ? data: []; //---------------agregue el let----------------------
        this.dataSourceRechazos.data = dataTable;
       // this.isLoading = false;
        //this.resetInMemoryFilter();
        this.dataSourceRechazos._updateChangeSubscription();
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
 
  
  irADetalleRechazos( id: number): void {
   //console.log("Ver Rechazos"+ id);
   this.router.navigate(['/detalle-rechazos', id]);

 }


  
}
