function thisYearsTotals() {
  now = new Date()
  start = new Date(now.getYear(), 1, 1, 0, 0, 0);
  end = new Date(now.getYear(), 13, 1, 0, 0, 0);
  
  return hashTotalsInPeriod(start,end);
}

function thisMonthsTotals() {
  now = new Date()
  startOfThisMonth = new Date(now.getYear(), now.getMonth(), 1, 0, 0, 0);
  endOfThisMonth = new Date(now.getYear(), now.getMonth()+1, 1, 0, 0, 0);
  
  return hashTotalsInPeriod(startOfThisMonth,endOfThisMonth);
}

function getAllCalendarNames() { //TODO: refer to calendars by ID, because names may be duplicate
  calendarNames = [];
  CalendarApp.getAllCalendars().forEach( function(calendar) {
    calendarNames.push(calendar.getName());
  });
  return calendarNames;
}


function getAllEvents(calendarNames, period) {
  var startTime = period[0];
  var endTime = period[1];
  
  var allEvents = [];
  calendarNames.forEach( function(calendarName) {
    var calendar = CalendarApp.getCalendarsByName(calendarName)[0];
    allEvents = allEvents.concat(calendar.getEvents(startTime,endTime));
    //Utilities.sleep(1000);
  });
  
  return allEvents;
}

function hashTotalsInPeriod(allEvents, period) {
  var startTime = period[0];
  var endTime = period[1];
  
  var tagsDurations = {};
  allEvents.forEach( function(theEvent) {
    if (theEvent.getStartTime() >= startTime & theEvent.getStartTime() < endTime) {
      eventTag = extractTag(theEvent.getTitle());
      if (!eventTag) {
        eventTag = 'Untagged';
      }
      
      duration = theEvent.getEndTime()-theEvent.getStartTime();
      if (!(tagsDurations[eventTag])) {
        tagsDurations[eventTag] = 0.0;
      }
      tagsDurations[eventTag] += duration;  
    }
  });
  
  return tagsDurations;
}

function extractTag(eventTitle) {
  var tag = "";
  
  // try dashtag
  var titleItems = eventTitle.split(' - ');
  if (titleItems.length >= 2) {
    tag = titleItems[0].trim();
  }
  
  // try hashtag (overrules if dashtag was formerly found)
  var titleWords = eventTitle.split(' ');
  titleWords.some( function(theWord) {
    if (theWord[0] == '#') {
      tag = theWord;
      return true;
    }
  });
  
  return tag;
}