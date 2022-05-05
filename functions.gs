// Returns array of all classes for requested days with number input attached
function getClasses(days, ranks) {
  const sheet = mainScheduleSpreadsheet.getSheetByName(classListSheetName)

  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getValues();
  let rows = []
  let rankedIds = ranks.map(c => c[1])
  let value = '';

  for (let i = 0; i < classData.length; i++) {
    if (days.includes(classData[i][5].toLowerCase())) {
      if (rankedIds.includes(String(classData[i][0]))) {
        for (j = 0; j < rankedIds.length; j++) {
          if (String(classData[i][0]) === ranks[j][1]) {
            value = ranks[j][0];
          }
        }
      }
      rows.push(`<input class="w-12 mx-3 pl-3 border-2 border-zinc-400" type="number" min="1" max="${maxNumber}" value="${value}" id="${classData[i][0]}">${classData[i][0]} ${classData[i][1]} ${classData[i][3]} ${classData[i][4]} ${classData[i][5]} ${classData[i][7]}`);
    }
    value = ''
  }
  return rows
}


// Returns 2D array of class data for username in Summer 2022 Lineup
// Called when "Get Schedule" button is clicked
function checkSchedule(username) {
  const lineupSheet = SpreadsheetApp.openById('1326N0jPlCf24inE9Q59oQf19Wv10aBHhE-gih5hNGfY').getSheetByName('Lineup');
  const teacherCol = lineupSheet.getRange(2, 6, lineupSheet.getLastRow()-1, 1).getValues();
  const classes = [];

  for (let i = 0; i < teacherCol.length; i++) {
    if (teacherCol[i][0] === username) {
      let data = lineupSheet.getRange(i+2, 1, 1, 2).getValues();
      data.forEach(d => classes.push(d));
    }
  }

  if (classes.length === 0) {
    return [['Instructor', 'not found']]
  } else {
    return classes
  }
}


// Adds new row to data sheet with username, date, course preferences
function addUsername(username, courses, numberOfClasses, wishToBeScheduled) {
  const sheet = mainScheduleSpreadsheet.getSheetByName(submitPreferencesSheetName);
  const rowData = [new Date(), username];

  const rankedCourses = sortRanking(courses);
  
  if (rankedCourses.length > maxNumber) {
    rankedCourses.length = maxNumber;
  }

  rankedCourses.forEach(course => rowData.push(course[1]))

  while (rowData.length < Number(maxNumber) + 2) {
    rowData.push('');
  }

  rowData.push(numberOfClasses);
  rowData.push(wishToBeScheduled);

  sheet.appendRow(rowData);

  return rankedCourses.length
}


// Helper function to sort ranked courses from 1 to n
function sortRanking(coursesArr) {
  const rankedCourses = coursesArr.sort(function(a, b) {
    return a[0] - b[0]
  })

  return rankedCourses
}


// Returns array with ranked classes at the top
function findRankedClasses(classes) {
  const classIds = classes.map(c => c[1])
  const sheet = mainScheduleSpreadsheet.getSheetByName(classListSheetName);
  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getValues();
  const classArr = [];
  const addLater = [];

  for (i = 0; i < classData.length; i++) {
    if (classIds.includes(String(classData[i][0]))) {
      for (j = 0; j < classes.length; j++) {
        if (classes[j][1] === String(classData[i][0])) {
          var value = classes[j][0]
        }
      }
      classArr.push(`<input class="w-12 mx-3 pl-3 border-2 border-zinc-400" type="number" min="1" max="${maxNumber}" value="${value}" id="${classData[i][0]}">${classData[i][0]} ${classData[i][1]} ${classData[i][3]} ${classData[i][4]} ${classData[i][5]} ${classData[i][7]}`)
    } else {
      addLater.push(`<input class="w-12 mx-3 pl-3 border-2 border-zinc-400" type="number" min="1" max="${maxNumber}" id="${classData[i][0]}">${classData[i][0]} ${classData[i][1]} ${classData[i][3]} ${classData[i][4]} ${classData[i][5]} ${classData[i][7]}`)
    }
  }

  addLater.forEach(row => classArr.push(row))
  return classArr
}
