import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, of } from 'rxjs';
import { Book } from '../book';
import { BookService } from '../book.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {
  dataSaved = false;
  bookForm: any;
  allBooks: Observable<Book[]> = of([]);
  dataSource: MatTableDataSource<Book> = {} as MatTableDataSource<Book>;
  selection = new SelectionModel<Book>(true, []);
  bookIdUpdate = 0;
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
  constructor(
    private formbulider: FormBuilder,
    private bookService: BookService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.bookService.getAllBooks()
    .subscribe(data => {
      console.log('Ihab', data);
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnInit(): void {
    this.bookForm = this.formbulider.group({
      Name: ['', [Validators.required]],
      ISBN: ['', [Validators.required]]
    });
    this.loadAllBooks();
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

  checkboxLabel(row: Book): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.BookId + 1}`;
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  loadAllBooks() {
    this.bookService.getAllBooks().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onFormSubmit() {
    this.dataSaved = false;
    const book = this.bookForm.value;
    this.CreateBook(book);
    this.bookForm.reset();
  }

  loadBookToEdit(bookId: number) {
    this.bookService.getBookById(bookId).subscribe(book => {
      this.massage = null;
      this.dataSaved = false;
      this.bookIdUpdate = book.BookId;
      this.bookForm.controls['ISBN'].setValue(book.ISBN);
    });

  }

  CreateBook(book: Book) {
    //console.log(book.DateofBirth);
    if (this.bookIdUpdate == null) {
      this.bookService.createBook(book).subscribe(
        () => {
          this.dataSaved = true;
          this.SavedSuccessful(1);
          this.loadAllBooks();
          this.bookIdUpdate = 0;
          this.bookForm.reset();
        }
      );
    } else {
      book.BookId = this.bookIdUpdate;
      book.ISBN = this.ISBN;
      this.bookService.updateBook(book).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(0);
        this.loadAllBooks();
        this.bookIdUpdate = 0;
        this.bookForm.reset();
      });
    }
  }
  deleteBook(bookId: number) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.bookService.deleteBookById(bookId).subscribe(() => {
        this.dataSaved = true;
        this.SavedSuccessful(2);
        this.loadAllBooks();
        this.bookIdUpdate = 0;
        this.bookForm.reset();

      });
    }

  }

  resetForm() {
    this.bookForm.reset();
    this.massage = null;
    this.dataSaved = false;
    this.loadAllBooks();
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

