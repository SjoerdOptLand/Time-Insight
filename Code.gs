/**
 * @OnlyCurrentDoc  Limits the script to only accessing the current spreadsheet.
 */

var DIALOG_TITLE = 'Example Dialog';
var SIDEBAR_TITLE = 'Time Insight';



/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Create example sheet', 'createExampleSheet')
      .addItem('Update current sheet', 'updateCurrentSheet')
      .addItem('Show clocking sidebar', 'showSidebar')
      .addToUi();
  
  showSidebar();
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  onOpen(e);
}


/**
 * Opens a sidebar. The sidebar structure is described in the Sidebar.html
 * project file.
 */
function showSidebar() {
  var ui = HtmlService.createTemplateFromFile('Sidebar')
      .evaluate()
      .setTitle(SIDEBAR_TITLE);
  SpreadsheetApp.getUi().showSidebar(ui);
}


function getSelectedTag() {
  // Retrieve and return the information requested by the sidebar.
  var selectedValue = tagSheet().getActiveCell().getValue();
  
  if (selectedValue) {
    var firstTag = splitTags(selectedValue)[0];
  
    if (firstTag[0] !== "#") {
      throw new Error("Tag must start with a # ('"+firstTag+"' does not)");
    }

    return firstTag;
  }
}



function updateCurrentSheet() {
  // print hash tags
  periods = getPeriods();
  
  totalPeriod = [periods[0][0],periods[periods.length-1][1]];
  allEvents = getAllEvents(calendarNames(), totalPeriod);
  newHashTags = listKeys(hashTotalsInPeriod(allEvents,totalPeriod));
  
  newTagGroups = mergeTags(splitTagStrings(getActualTagStrings()),newHashTags);
  newTagGroups.print(startRow(), 1);

  
  // print totals for each period
  data = createArray(newTagGroups.groups.length,periods.length);
  periods.forEach( function(period, periodIndex) {
    periodTotals = hashTotalsInPeriod(allEvents, period)
    newTagGroups.groups.forEach( function(tags, tagLineIndex) {
      tagLineTotal = 0;
      tags.forEach( function(tag) {
        if (periodTotals[tag]) {
          tagLineTotal += periodTotals[tag]/1000/3600;
        }
      });
      if (tagLineTotal) {
        data[tagLineIndex][periodIndex] = tagLineTotal;
      } else {
        data[tagLineIndex][periodIndex] = "";
      }
    });
  });
  
  range = tagSheet().getRange(startRow(),startColumn(),newTagGroups.groups.length,periods.length);
  range.setValues(data);
}

function simplify(amounts, aliases) {
  simplifiedDictionary = {};
  for (var originalKey in amounts) {
    if (aliases[originalKey]) newKey = aliases[originalKey]; else newKey = originalKey;
    
    if (!simplifiedDictionary[newKey]) simplifiedDictionary[newKey] = 0.0;
    simplifiedDictionary[newKey] += amounts[originalKey];
  }
  return simplifiedDictionary;
}

/**
 * Replaces the active cell value with the given value.
 *
 * @param {Number} value A reference number to replace with.
 */
function setActiveValue(value) {
  // Use data collected from sidebar to manipulate the sheet.
  //var cell = tagSheet().getActiveCell();
  //cell.setValue('Hoi');
  
  //hashTotals = thisYearsTotals();
  //aliases = readInDictionary('Alias Calendrier');
  //writeOutDictionary(simplify(hashTotals,aliases));
  updateCurrentSheet();
}


/**
 * Executes the specified action (create a new sheet, copy the active sheet, or
 * clear the current sheet).
 *
 * @param {String} action An identifier for the action to take.
 */
function modifySheets(action) {
  // Use data collected from dialog to manipulate the spreadsheet.
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var currentSheet = ss.getActiveSheet();
  if (action === "create") {
    ss.insertSheet();
  } else if (action === "copy") {
    currentSheet.copyTo(ss);
  } else if (action === "clear") {
    currentSheet.clear();
  }
}

//http://stackoverflow.com/questions/966225/how-can-i-create-a-two-dimensional-array-in-javascript/966938#966938
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}