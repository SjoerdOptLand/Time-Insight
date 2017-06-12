function startTag(tag, minutesAgo) {
  try {
    stopRunningTag();
  } catch(error) {
    Logger.log(error);
  }
  
  var documentProperties = PropertiesService.getDocumentProperties();
  documentProperties.setProperty('RUNNING_TAG', tag);
  var startDate = new Date(new Date() - 60 * 1000 * minutesAgo);
  documentProperties.setProperty('RUNNING_SINCE', startDate);
}

function test() {
  startTag("#blep", 0);
}

function getRunningTag() {
  var documentProperties = PropertiesService.getDocumentProperties();
  return documentProperties.getProperty('RUNNING_TAG');
}

function logRunningTag() {
  var documentProperties = PropertiesService.getDocumentProperties();
  Logger.log(documentProperties.getProperty('RUNNING_TAG'));
  Logger.log(documentProperties.getProperty('RUNNING_SINCE'))
}

function stopRunningTag() {
  var documentProperties = PropertiesService.getDocumentProperties();
  var activityTag = documentProperties.getProperty('RUNNING_TAG');
  if (activityTag) {
    var activityStart = new Date(documentProperties.getProperty('RUNNING_SINCE'));
    var activityStop = new Date();
    
    storeActivity(activityTag,activityStart,activityStop);
    
    documentProperties.setProperty('RUNNING_TAG', "");
    documentProperties.setProperty('RUNNING_SINCE', 0);
    
  } else {
    throw new Error( "No current activity to stop." );
  }
}

function storeActivity(activityTag,activityStart,activityStop) {
  var calendar = CalendarApp.getCalendarsByName(calendarNames()[0])[0];  
  calendar.createEvent(activityTag,activityStart,activityStop);
}