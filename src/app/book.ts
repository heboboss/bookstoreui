export class Book {
    BookId: number = 0;
    ISBN: string = '';
    Author: Author = new Author()
}

export class Author {
    AuthorId: number = 0;
    FirstName: string = '';
    LastName: string = '';
}
