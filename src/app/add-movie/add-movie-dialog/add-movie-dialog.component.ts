import { Component, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Movie } from 'src/app/model/movie';
import { MovieService } from 'src/app/service/movie.service';

@Component({
  selector: 'app-add-movie-dialog',
  templateUrl: './add-movie-dialog.component.html',
  styleUrls: ['./add-movie-dialog.component.scss']
})
export class AddMovieDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<AddMovieDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Movie,private movieService:MovieService
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
  addNewMovie(movieForm:NgForm){
    console.log('data==>',JSON.parse(JSON.stringify(this.data)))
    this.movieService.addNewMovie('api/movies',JSON.stringify(this.data)).subscribe(
      (result:any)=>{
        console.log('result',result)
        movieForm.reset();
        this.dialogRef.close();
      }
    )
  }
}
