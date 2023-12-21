import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Movie } from './model/movie';
import { MatTableDataSource } from '@angular/material/table';
import { MovieService } from './service/movie.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddMovieDialogComponent } from './add-movie/add-movie-dialog/add-movie-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,AfterViewInit {
  public displayedColumns = ['tconst','titleType','primaryTitle', 'originalTitle','isAdult','startYear','endYear','runtimeMinutes','genres'];
  public dataSource = new MatTableDataSource<Movie>();
  @ViewChild(MatSort) sort!: MatSort;
  public searchValue: any = {};
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  page:any=0;
  size:any=20;
  result:any;
  sortOrder:string='DESC'
  sortField:string='startYear'
  constructor(private movieService: MovieService,private cd:ChangeDetectorRef,public dialog: MatDialog){}

  ngOnInit(): void {
    this.getData();
  }

  ngAfterViewInit(): void {
    
  }

  public getData(){
    this.movieService.getData('api/movies')
    .subscribe((res:any)=> {
      this.dataSource.data = res.content as Movie[];
      this.result=res;
    })
  }

  public loadPaginateddData(event?:any) {
    console.log('event',this.paginator)
    this.dataSource.data=[];
    if(this.paginator){
      this.page=this.paginator.pageIndex;
      this.size=this.paginator.pageSize;
    }
    if(this.sort && this.sort.active && this.sort.direction){
      this.sortField=this.sort.active
      if(this.sort.direction==='asc'){
        this.sortOrder='ASC'
      }
      if(this.sort.direction==='desc'){
        this.sortOrder='DESC'
      }
    }
    this.movieService.getDataPaginated('api/movies/sort',this.page,this.size,this.sortField,this.sortOrder)
    .subscribe((res:any)=> {
      this.dataSource.data = res.content as Movie[];
      this.result=res;
    })
  }

  public customSort(event:any){
    this.paginator.pageIndex=0;
    this.loadPaginateddData();
  }

  clearColumn(columnKey: string): void {
    this.searchValue[columnKey] = null;
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.data=[];
    
    let searchFilter: any = {
      values: this.searchValue,
    }
    console.log('datasource==>',this.searchValue)
    if(searchFilter.values.originalTitle){
      this.dataSource.filter = searchFilter.values.originalTitle ? searchFilter.values.originalTitle.trim().toLowerCase() : '';
    }
    if(searchFilter.values.primaryTitle){
      this.dataSource.filter = searchFilter.values.primaryTitle ? searchFilter.values.primaryTitle.trim().toLowerCase() : '';
    }
    if(searchFilter.values.startYear){
      this.dataSource.filter = searchFilter.values.startYear ? searchFilter.values.startYear.trim().toLowerCase() : '';
    }

    this.movieService.filterData('api/movies/search',searchFilter.values.primaryTitle,searchFilter.values.originalTitle,searchFilter.values.startYear)
    .subscribe((res:any)=> {
      this.dataSource.data = res.content as Movie[];
      this.result=res;
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddMovieDialogComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}
