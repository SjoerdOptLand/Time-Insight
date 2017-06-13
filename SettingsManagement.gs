function initialiseSettings() {
  setAutoShowSidebar('false');
}

function openSettings() {
  var html = HtmlService.createTemplateFromFile('Settings')
      .evaluate()
      .setWidth(300)
      .setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, 'Time Insight settings');
}

function saveSettings(autoShowSidebar) {
  setAutoShowSidebar(autoShowSidebar);
}

function setAutoShowSidebar(autoShowSidebar) {
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('AUTO_SHOW_SIDEBAR', autoShowSidebar);
  
  applyAutoShowSidebar();
}

function getAutoShowSidebar() {
  var documentProperties = PropertiesService.getDocumentProperties();
  return documentProperties.getProperty('AUTO_SHOW_SIDEBAR') == 'true';
}

function applyAutoShowSidebar() {
  if (getAutoShowSidebar()) {
    showSidebar();
  }
}
  
function test() {
  var returnValue = getAutoShowSidebar();
  Logger.log();
}