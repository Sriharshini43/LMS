class BookModel {
  constructor(book) {
    this.title = book.title;
    this.author = book.author;
    this.description = book.description;
    this.stock= book.stock;
  }
}

export default BookModel;
