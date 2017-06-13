function initialiseSettings() {
  setAutoShowSidebar('false');
  setClockingCalendar(getPrimaryUserCalendar());
}

function test() {
  var returnValue = getPrimaryUserCalendar();
  Logger.log(returnValue);
}

function openSettings() {
  var html = HtmlService.createTemplateFromFile('Settings')
      .evaluate()
      .setWidth(300)
      .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Time Insight settings');
}

function loadSettings() {
  return { 
    autoShowSidebar:  getAutoShowSidebar(),
    clockingCalendar: getClockingCalendar(),
    allCalendars:     getAllCalendars(true) // not so beautiful to communicate this here...
  };
}

function saveSettings(settings) {
  setAutoShowSidebar(settings['autoShowSidebar']);
  setClockingCalendar(settings['clockingCalendar']);
}

function applySettings()
{
  applyAutoShowSidebar();
  applyClockingCalendar();
}

// AUTO_SHOW_SIDEBAR
function getAutoShowSidebar() {
  var documentProperties = PropertiesService.getDocumentProperties();
  return documentProperties.getProperty('AUTO_SHOW_SIDEBAR') == 'true';
}

function setAutoShowSidebar(autoShowSidebar) {
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('AUTO_SHOW_SIDEBAR', autoShowSidebar);
  
  applyAutoShowSidebar();
}

function applyAutoShowSidebar() {
  if (getAutoShowSidebar()) {
    showSidebar();
  }
}

// CLOCKING_CALENDAR
function getClockingCalendar() {
  var documentProperties = PropertiesService.getDocumentProperties();
  return documentProperties.getProperty('CLOCKING_CALENDAR');
}

function setClockingCalendar(clockingCalendar) {
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('CLOCKING_CALENDAR', clockingCalendar);
  
  applyClockingCalendar();
}

function applyClockingCalendar() {
  updateCurrentSheet();
}

function calendarIds() {
  return[getClockingCalendar()];
}
