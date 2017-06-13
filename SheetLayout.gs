function tagSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

dateRow = 1;

hashTagColumn = 'A'; // implicitly at several places in the code, don't change and expect this to work
hashTagHeader = 'Hashtag(s)';



function startRow() {
  return findValueInColumn(hashTagHeader,hashTagColumn)+1;
}

function startColumn() {
  return findFirstDateInRow(dateRow);
}
