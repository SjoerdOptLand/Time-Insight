String.prototype.contains = function(substring) { 
  return this.indexOf(substring) !== -1; 
};

Array.prototype.contains = function(item) { //TODO: replace par includes
  return this.indexOf(item) !== -1; 
};

function trimSheetToRow(sheet, shallLastRow) {
  superFluousRows = sheet.getMaxRows() - shallLastRow;
  if (superFluousRows > 0) {
    sheet.deleteRows(shallLastRow + 1, superFluousRows);
  }
}

function trimSheetToColumn(sheet, shallLastColumn) {
  superFluousColumns = sheet.getMaxColumns() - shallLastColumn;
  if (superFluousColumns > 0) {
    sheet.deleteColumns(shallLastColumn + 1, superFluousColumns);
  }
}

function findValueInColumn(soughtValue,columnLetter) {
  var columnValues = tagSheet().getRange(columnLetter+':'+columnLetter).getValues();
  var foundRow = -1;
  columnValues.some( function(rowValues, rowIndex) {
    if (rowValues[0] === soughtValue) {
      foundRow = rowIndex + 1;
      return true;
    }
  });
  if (foundRow < 0) {
    throw new Error('First column should literally contain "'+soughtValue+'" somewhere.');
  }
  return foundRow;
}

function findFirstDateInRow(rowNumber) {
  rowValues = tagSheet().getRange(rowNumber+':'+rowNumber).getValues();
  var values = rowValues[0];
  foundColumnIndex = values.findIndex( function(value) {
    return (value instanceof Date);
  });
  if (foundColumnIndex < 0) {
    throw new Error('Row ' + rowNumber + ' should contain a date somewhere.');
  }
  return foundColumnIndex + 1;
}

function readInDictionary(spreadSheetName) {
  //spreadSheetName = 'Alias Calendrier'

  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(spreadSheetName);
  newDictionary = {};
  for (rowNumber = 1; true; rowNumber++) {
    rowValues = sheet.getRange(rowNumber,1,1,2).getValues();
    if (rowValues[0][0] === '') break;
    newDictionary[rowValues[0][0]] = rowValues[0][1]
  }
  return newDictionary;
}

function writeOutDictionary(sheet, theDictionary) {
  //theDictionary = thisYearsTotals();
  
  rectangularTable = [];
  for (var key in theDictionary) {
    rectangularTable.push([key, theDictionary[key]])
  }
  
  var range = sheet.getRange(2,1,rectangularTable.length,2);
  range.setValues(rectangularTable);
}

function readList(sheet, column, startRow) {
  values = [];
  for (rowNumber = startRow; true; rowNumber++) {
    rowValue = sheet.getRange(rowNumber,1,1,1).getValue();
    if (rowValue === '') break;
    values.push(rowValue)
  }
  return values;
}


function listKeys(theDictionary) {
  keyList = [];
  for (var key in theDictionary) {
    keyList.push(key)
  }
  return keyList;
}

function findNonExistingSheetName(nameProposal) {
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