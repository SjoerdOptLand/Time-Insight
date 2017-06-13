/**
 * @OnlyCurrentDoc  Limits the script to only accessing the current spreadsheet.
 */

var SIDEBAR_TITLE = 'Punch Clock';



/**
 * Adds a custom menu with items to show the sidebar and dialog.
 *
 * @param {Object} e The event parameter for a simple onOpen trigger.
 */
function onOpen(e) {
  SpreadsheetApp.getUi()
      .createAddonMenu()
      .addItem('Update current sheet', 'updateCurrentSheet')
      .addItem('Open punch clock', 'showSidebar')
      .addSeparator()
      .addSubMenu(SpreadsheetApp.getUi().createMenu('Use template')
           //.addItem('Monthly time sheet', 'createExampleSheet')
           .addItem('Weekly time sheet', 'createWeekExampleSheet')
           //.addItem('Daily time sheet', 'createExampleSheet')
      )
      .addItem('Settings...', 'openSettings')  
      .addToUi();
  
  if (e && e.authMode == ScriptApp.AuthMode.NONE) {
    SpreadsheetApp.getUi().alert("You are opening a document that requires Time Insight to be installed. Install it from the Add-on menu.");
  } else {                                 
    applySettings();
  }
}

/**
 * Runs when the add-on is installed; calls onOpen() to ensure menu creation and
 * any other initializion work is done immediately.
 *
 * @param {Object} e The event parameter for a simple onInstall trigger.
 */
function onInstall(e) {
  initialiseSettings();
  
  
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
  var selectedValue = tagSheet().getActiveCell().getValue();
  
  if (selectedValue) {
    try {
      var firstTag = splitTags(selectedValue)[0];
      if (firstTag[0] !== "#") {
        throw new Error("Tag must start with a # ('"+firstTag+"' does not)");
      }
      return firstTag;
    } catch (exception) {
      return '';
    }
  }
}



function updateCurrentSheet() {
  // print hash tags
  periods = getPeriods();
  
  totalPeriod = [periods[0][0],periods[periods.length-1][1]];
  allEvents = getAllEvents(calendarIds(), totalPeriod);
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