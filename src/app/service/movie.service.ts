import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/assets/environements/environment';
import { Movie } from '../model/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  constructor(private http: HttpClient) { }

  public getData = (route: string) => {
    return this.http.get(this.createCompleteRoute(route, environment.urlAddress));
  }

  public getDataPaginated = (route: string, page: number, size: number, sortBy: string, order: string) => {
    let queryParams = new HttpParams();
    queryParams = queryParams.append("page", page);
    queryParams = queryParams.append("size", size);
    queryParams = queryParams.append("sortBy", sortBy);
    queryParams = queryParams.append("order", order);
    return this.http.get(this.createCompleteRoute(route, environment.urlAddress), { params: queryParams });
  }

  public filterData(route: string, primaryTitle?: string, originalTitle?: string, startYear?: string){
    let queryParams = new HttpParams();
    if(primaryTitle){
      queryParams = queryParams.append("primaryTitle", primaryTitle);
    }
    if(originalTitle){
      queryParams = queryParams.append("originalTitle", originalTitle);
    }
    if(startYear){
      queryParams = queryParams.append("startYear", startYear);
    }
    
    return this.http.get(this.createCompleteRoute(route, environment.urlAddress), { params: queryParams });
  }

  public addNewMovie(route:string,body:any){
    return this.http.post(this.createCompleteRoute(route, environment.urlAddress),body,this.generateHeaders())
  }

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }

  private generateHeaders = () => {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' ,'Accept':'*/*'})
    }
  }
}
