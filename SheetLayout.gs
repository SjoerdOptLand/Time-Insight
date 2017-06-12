function tagSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

dateRow = 1;

hashTagColumn = 'A'; // implicitly at several places in the code, don't change and expect this to work
hashTagHeader = 'Hashtag(s)';


function calendarNames() {
  theNames = [];
  
  readList(tagSheet(),1,2).forEach( function(calendarName) {
    if (calendarName !== '-') {
      theNames.push(calendarName);
    }
  });
  
  if (theNames.length == 0) {
    throw new Error("No calendar names found starting from cell A2");
  }
  return theNames;
}



function startRow() {
  return findValueInColumn(hashTagHeader,hashTagColumn)+1;
}

function startColumn() {
  return findFirstDateInRow(dateRow);
}
