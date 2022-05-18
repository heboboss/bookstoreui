import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { Author } from '../utils';
import { MatDialog } from '@angular/material/dialog';
import { AuthorService } from '../author.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent implements OnInit {
  dataSaved = false;
  authorForm: any;
  allAuthors: Observable<Author[]> = of([]);
  dataSource: MatTableDataSource<Author> = {} as MatTableDataSource<Author>;
  selection = new SelectionModel<Author>(true, []);
  massage = null;
  CountryId = null;
  StateId = null;
  CityId = null;
  SelectedDate = null;
  isMale = true;
  isFeMale = false;
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  displayedColumns: string[] = ['select', 'ISBN',  'Edit', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;
  @ViewChild(MatSort) sort: MatSort = {} as MatSort;
  ISBN: string = '';
  authors: Author[] = [];
  authorIdUpdate: number = 0;
  firstName: string = '';
  lastName: string = '';

  constructor(
    private formbulider: FormBuilder,
    private authorService: AuthorService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.authorService.getAllAuthors()
    .subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit(): void {
    this.authorForm = this.formbulider.group({
      FirstName: ['', [Validators.required]],
      SecondName: ['', [Validators.required]],
    });
    this.loadAllAuthors();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = !!this.dataSource && this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(r => this.selection.select(r));
  }

  checkboxLabel(row: Author): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.AuthorId + 1}`;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadAllAuthors() {
    this.authorService.getAllAuthors().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }


  onFormSubmit() {
    this.dataSaved = false;
    const author = this.authorForm.value;
    this.CreateAuthor(author);
    this.authorForm.reset();
  }

  loadAuthorToEdit(authorId: number) {
    this.authorService.getAuthorById(authorId).subscribe(author => {
      this.massage = null;
      this.dataSaved = false;
      this.authorIdUpdate = author.AuthorId;
      this.authorForm.controls['FirstName'].setValue(author.FirstName);
      this.authorForm.controls['LastName'].setValue(author.LastName);

    });

  }

  CreateAuthor(author: Author) {
    if (this.authorIdUpdate == null) {
      this.authorService.createAuthor(author).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedSuccessful(1);
          this.loadAllAuthors();
          this.authorIdUpdate = 0;
          this.authorForm.reset();
        }
      );
    } else {
      author.AuthorId = this.authorIdUpdate;
      author.FirstName = this.firstName;
      author.LastName = this.lastName;
      this.authorService.updateAuthor(author).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(0);
        this.loadAllAuthors();
        this.authorIdUpdate = 0;
        this.authorForm.reset();
      });
    }
  }
  deleteAuthor(authorId: number) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.authorService.deleteAuthorById(authorId).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(2);
        this.loadAllAuthors();
        this.authorIdUpdate = 0;
        this.authorForm.reset();

      });
    }

  }

  resetForm() {
    this.authorForm.reset();
    this.massage = null;
    this.dataSaved = false;
    this.loadAllAuthors();
  }

  SavedSuccessful(isUpdate: number) {
    if (isUpdate == 0) {
      this._snackBar.open('Record Updated Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (isUpdate == 1) {
      this._snackBar.open('Record Saved Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
    else if (isUpdate == 2) {
      this._snackBar.open('Record Deleted Successfully!', 'Close', {
        duration: 2000,
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
      });
    }
  }
}

