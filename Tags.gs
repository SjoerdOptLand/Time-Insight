function GroupList() {
    this.groups = [];
    this.notes = [];
}
GroupList.prototype.print = function(startRow, startColumn) {
  if (this.groups.length !== this.notes.length) {throw new Error('Not the same number of notes and groups in GroupList');}
  
  rectangularTable = [];
  this.groups.forEach( function(group) {
    rectangularTable.push([joinTags(group)]);
  });
  
  rectangularNotesTable = [];
  rectangularColoursTable = [];
  this.notes.forEach( function(note) {
    rectangularNotesTable.push([note]);
    if (note.contains('Warning')) {
      cellColour = 'orange';
    } else {
      cellColour = '';
    }
    rectangularColoursTable.push([cellColour]);
  });
    
  var range = tagSheet().getRange(startRow,startColumn,rectangularTable.length,1);
  range.setValues(rectangularTable);
  range.setNotes(rectangularNotesTable);
  range.setBackgrounds(rectangularColoursTable);
  
  trimSheetToRow(tagSheet(), startRow + this.groups.length -1);
}





function getPeriods() {
  periods = [];
  for (columnNumber = 1; columnNumber < tagSheet().getMaxColumns(); columnNumber++) {
    rowValues = tagSheet().getRange(dateRow,columnNumber,1,2).getValues(); //TODO: get row at once and loop over it afterwards
    if( (rowValues[0][0] instanceof Date) && (rowValues[0][1] instanceof Date) ) {
      if( rowValues[0][0] >= rowValues[0][1]) {
        throw new Error('Dates are not strictly ascending');
      }
      periods.push(rowValues[0])
    }
  }
  
  // well-formedness check
  t=tagSheet().getMaxColumns();
  s= startColumn();
  if (periods.length !== tagSheet().getMaxColumns() - startColumn()) {
    throw new Error('Row '+dateRow+' should contain only contain dates from a certain column onwards, all the way to last column (no blanks allowed).');
  }
  return periods;
}

function getActualTagStrings() {
  numberOfRows = tagSheet().getMaxRows()-startRow()+1;
  actualTagStrings = [];
  if (numberOfRows > 0) {
    rawTagStrings = tagSheet().getRange(startRow(),1,numberOfRows,1).getValues();
    rawTagStrings.forEach( function(rawTagString) { 
      //if (rawTagString[0]) {
      actualTagStrings.push(rawTagString[0]);
      //}
    });
  }
  return actualTagStrings;
}

function mergeTags(oldTagGroups, newTags) {
  newTagGroups = new GroupList();
  newTagGroups.groups = oldTagGroups;
  
  // accumulate old tags
  oldTags = [];
  oldTagGroups.forEach( function(oldTagGroup) {
    thisTagGroupNotes = [];
    oldTagGroup.forEach( function(oldTag) {
      if (oldTags.contains(oldTag)) {
        thisTagGroupNotes.push("Warning: Already encountered "+oldTag+" above (double counting of time).");
      }
      if (!newTags.contains(oldTag)) {
        thisTagGroupNotes.push(oldTag+" does not appear in the calendar data (useless).");
      }
      oldTags.push(oldTag);
    });
    newTagGroups.notes.push(thisTagGroupNotes.join('\n\n'));
  });
  
  // add new tags only if necessary  
  newTags.forEach( function(newTag) {
    if (oldTags.indexOf(newTag) === -1) {
      newTagGroups.groups.push([newTag]);
      newTagGroups.notes.push('Freshly added from calendar data.');
    }
  }); 
  
  return newTagGroups;
}
 
function joinTags(tags) {
  return tags.join(', ');
}

function joinTagGroups(tagGroups) {
  tagStrings = [];
  tagGroups.forEach( function(tagGroup) {
    tagStrings.push(joinTags(tagGroup));
  });
  return tagStrings;
}

function splitTags(tagString) {
  if (tagString === "") {
    return [];
  } else {
    return tagString.split(',').map( function(rawTag) {
      return rawTag.trim();
    }); 
  }
}

function splitTagStrings(tagStrings) {
  tagGroups = [];
  tagStrings.forEach( function(tagString) {
    tagGroups.push(splitTags(tagString));
  });
  return tagGroups
}

