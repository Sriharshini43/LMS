class BorrowRequestModel {
    constructor(request) {
      this.userId = request.userId;
      this.bookId = request.bookId;
      this.status = request.status || "pending"; // Default status: pending
      this.requestDate = request.requestDate || new Date();
      this.returnDate = request.returnDate || null;
    }
  }
  
  export default BorrowRequestModel;
  