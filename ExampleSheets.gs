hourFormat = '0.0';

function createWeekExampleSheet() {
  var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  var newSheet = spreadSheet.insertSheet(findNonExistingSheetName('This Week'));
  
  // create date list
  var dateRange = newSheet.getRange(1,4,1,7);
  var dateLimits = ['','+1','+2','+3','+4','+5','+7'];
  var dateFormulas = [];
  for (limitNumber = 0; limitNumber < dateLimits.length; limitNumber++) {
    dateFormulas.push("=TODAY()-WEEKDAY(TODAY();3)"+dateLimits[limitNumber]);
  }
  dateRange.setFormulas([dateFormulas]);
  
  
  var dateLabelRange = newSheet.getRange(5,4,1,7);
  dateLabelRange.setValues([['Monday','Tuesday','Wednesday','Thursday','Friday','Weekend','']]);
  dateLabelRange.setFontWeight('bold');
  trimSheetToColumn(newSheet, 10);
  for (columnNumber = 4; columnNumber <= 10; columnNumber++) {
    newSheet.setColumnWidth(columnNumber, 80);
  } 
  
  // create day totals
  var dateRange = newSheet.getRange(4,4,1,6);
  var dateColumns = ['D','E','F','G','H','I'];
  var dateFormulas = [];
  for (columnNumber = 0; columnNumber < dateColumns.length; columnNumber++) {
    var letter = dateColumns[columnNumber];
    dateFormulas.push('=SUMIF($B$6:$B;"<>X";'+letter+'$6:'+letter+')');
  }
  dateRange.setFormulas([dateFormulas]);
  dateRange.setNumberFormat(hourFormat);
  
  // create week total
  newSheet.setColumnWidth(2, 120);
  var weekCell = newSheet.getRange(1,2,1,1);
  weekCell.setFormula('=SUM(D4:I4)');
  weekCell.setFontWeight('bold');
  weekCell.setFontSize(36);
  weekCell.setNumberFormat(hourFormat);
  
  var weekCells = newSheet.getRange(1,2,4,1);
  weekCells.merge();
  weekCells.setHorizontalAlignment('center');
  weekCells.setVerticalAlignment('middle');
  
  // prepare for hashtags
  newSheet.setColumnWidth(1, 300);
  var hashTagsLabelCell = newSheet.getRange(5,1,1,2);
  hashTagsLabelCell.setValues([[hashTagHeader, 'Exclude?']]);
  hashTagsLabelCell.setFontWeight('bold');
  trimSheetToRow(newSheet, 6);
  var excludeUntaggedCells = newSheet.getRange(6,1,1,2);
  excludeUntaggedCells.setValues([["Untagged","X"]]);
  
  
  // prepare for hours
  var hoursRange = newSheet.getRange(6,4,1,7);
  hoursRange.setNumberFormat(hourFormat);
  
  // hide last column (10)
  newSheet.hideColumns(10);
  
  // update!
  updateCurrentSheet();
}

function createMonthExampleSheet() {
  spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
  newSheet = spreadSheet.insertSheet(findNonExistingSheetName('This Month'));
  
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

