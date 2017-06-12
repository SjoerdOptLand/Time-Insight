function createExampleSheet() {
  spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  newSheet = spreadSheet.insertSheet(findNonExistingName('Example Ontology')); //, 8, 15);
  
  // create date list
  dateRange = newSheet.getRange(1,4,1,13);
  dateLimits = [];
  now = new Date()
  for (monthNumber = 0; monthNumber < 13; monthNumber++) {
    dateLimits.push(new Date(now.getYear(), monthNumber, 1, 0, 0, 0));
  }
  dateRange.setValues([dateLimits]);
  
  dateLabelRange = newSheet.getRange(6,4,1,12);
  dateLabelRange.setValues([['J','F','M','A','M','J','J','A','S','O','N','D']]);
  dateLabelRange.setFontWeight('bold');
  trimSheetToColumn(newSheet, 16);
  for (columnNumber = 4; columnNumber <= 16; columnNumber++) {
    newSheet.setColumnWidth(columnNumber, 35);
  }
  
  
  // create calendar list
  var calendarLabelCell = newSheet.getRange(1,1,1,1);
  calendarLabelCell.setValue('Calendar(s):');
  calendarLabelCell.setFontWeight('bold');
  
  newSheet.setColumnWidth(1, 200);
  
  var calendarCells = newSheet.getRange(2,1,3,1);
  var allCalendarNames = getAllCalendarNames();
  allCalendarNames.unshift('-');
  var calendarRule = SpreadsheetApp.newDataValidation().requireValueInList(allCalendarNames, true).build();
  calendarCells.setDataValidation(calendarRule);
  newSheet.getRange(2,1,1,1).setValue(allCalendarNames[1]);
  newSheet.getRange(3,1,1,1).setValue(allCalendarNames[0]);
  newSheet.getRange(4,1,1,1).setValue(allCalendarNames[0]);
  
  
  
  // prepare for hashtags
  var hashTagsLabelCell = newSheet.getRange(6,1,1,3);
  hashTagsLabelCell.setValues([[hashTagHeader, 'Activity', 'Notes']]);
  hashTagsLabelCell.setFontWeight('bold');
  trimSheetToRow(newSheet, 7);
  
  // prepare for hours
  var hoursRange = newSheet.getRange(7,4,1,12);
  hoursRange.setNumberFormat("0");
}

function findNonExistingName(nameProposal) {
  spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  sheetNames = [];
  spreadSheet.getSheets().forEach( function(sheet) {
    sheetNames.push(sheet.getName());
  });
  tryProposal = nameProposal;
  for (copyNumber = 1; sheetNames.contains(tryProposal); copyNumber++) {
    tryProposal = nameProposal + ' ' + copyNumber;
  }
  return tryProposal;
}