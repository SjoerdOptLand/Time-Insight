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

function getAllCalendarIds() { //TODO: refer to calendars by ID, because names may be duplicate
  calendarIds = [];
  CalendarApp.getAllCalendars().forEach( function(calendar) {
    calendarIds.push(calendar.getId());
  });
  return calendarIds;
}

function getAllCalendars(editable) {
  var allCalendars = {};
  var test = {};
  if (editable) {
    var calendars = CalendarApp.getAllOwnedCalendars();
  } else {
    var calendars = CalendarApp.getAllCalendars();
  }
  calendars.forEach( function(calendar) {
    allCalendars[calendar.getId()] = calendar.getName();
    test[calendar.getId()] = calendar.isMyPrimaryCalendar();
  });
  return allCalendars;
}

function getPrimaryUserCalendar() {
  var primaryCalendar = CalendarApp.getAllOwnedCalendars().find( function(calendar) {
    return calendar.isMyPrimaryCalendar()
  });
  if (primaryCalendar) {
    return primaryCalendar.getId();
  } else {
    throw new Error("No primary calendar found. Please create at least one Google Calendar.");
  }
}

function getAllEvents(calendarIds, period) {
  var startTime = period[0];
  var endTime = period[1];
  
  var allEvents = [];
  calendarIds.forEach( function(calendarId) {
    var calendar = CalendarApp.getCalendarById(calendarId);
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