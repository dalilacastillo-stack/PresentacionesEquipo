import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EquiposService } from '../servicios/equipos.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-presentacion-equipo-pendientes',
  templateUrl: './presentacion-equipo-pendientes.component.html',
  styleUrls: ['./presentacion-equipo-pendientes.component.scss']
})
export class PresentacionEquipoPendientesComponent implements OnInit {

 

  displayedColumns: string[] = [ 'NumPresentacion','NombrePresentacion', 'Equipo', 'Periodo', 'Cantidad','Detalles' ];
  dataSourcePendientes : any = new MatTableDataSource();
  user:any;

  @ViewChild('paginator', { read: MatPaginator }) paginator: MatPaginator;



    constructor(private service: EquiposService, private router: Router ) {
     
    this.user = JSON.parse(localStorage.getItem('currentUser')) ? JSON.parse(localStorage.getItem('currentUser')) : '' ;
         
   }
 

  ngOnInit(): void {
     this.listadoProformasPendientes();
  }



  ngAfterViewInit() {
      this.dataSourcePendientes.paginator = this.paginator; // ahora sí funciona
  }


 
  listadoProformasPendientes(){
    let matricula= this.user.usuario;
    console.log("MATRICULA DE SESSION",matricula);
    //this.isLoading = true;
    let dataTable: any[] = [];
    this.dataSourcePendientes.data = []; 
    this.dataSourcePendientes._updateChangeSubscription();
    
   
      var sistema = this.user.Sistemas.filter(d => d.Id==environment.idSistema);
      console.log(sistema[0])
      //if (sistema.length > 0)  
      let idPerfil = sistema[0].IdPerfil;  //3 medico //1 admin 
     // let idPerfil = sistema[0].IdPerfil==1;  //3 medico //1 admin 
     this.service.getProformasPendientes(matricula,idPerfil).subscribe(
        data => {
        console.log("data:" + JSON.stringify(data));
        
        let dataTable = data != null ? data: []; //---------------agregue el let----------------------
        this.dataSourcePendientes.data = dataTable;
       
        this.dataSourcePendientes._updateChangeSubscription();
        
        },
        error => {
          if (error.status != 0) {  
            console.log('Ocurrió un error al obtener los datos de las proformas');
         
          }
          
        }
      );
  }
 
  
  irADetallePendientes( id: number): void {
   //console.log("Ver pendientes"+ id);
   this.router.navigate(['/detalle-pendientes', id]);

 }


  
}



