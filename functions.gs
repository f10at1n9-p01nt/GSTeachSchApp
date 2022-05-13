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
      rows.push([`<input class="w-12 mx-3 pl-3 border-2 border-zinc-400" type="number" min="1" max="${maxNumber}" value="${value}" id="${classData[i][0]}">`, classData[i][0], classData[i][1], classData[i][5], classData[i][3], classData[i][4], classData[i][7]])
    }
    value = ''
  }
  return rows
}


function checkSchedule(username) {
  const lineupSheet = mainScheduleSpreadsheet.getSheetByName('Lineup')
  const teacherCol = lineupSheet.getRange(2, 11, lineupSheet.getLastRow()-1, 1).getValues();
  const classes = [];

  for (let i = 0; i < teacherCol.length; i++) {
    if (teacherCol[i][0] === username) {
      if (lineupSheet.getRange(i+2, 2).getValue() === "Running") {
        let data = lineupSheet.getRange(i+2, 3, 1, 8).getDisplayValues(); // Need to add two since row 1 has 0 teachers and counting starts at 1 and not 0
        data[0].splice(2, 2); // Should remove Code and Start [ID, Course, End, Day, Weeks, Time]
        data[0].splice(4, 1); // Should remove Weeks [ID, Course, End, Day, Time]
        [data[0][2], data[0][3]] = [data[0][3], data[0][2]] //Swap End,Day [ID, Course, Day, End, Time]
        data.forEach(d => classes.push(d));
      }
    }
  }

  if (classes.length === 0) {
    return [['Instructor', 'not found']]
  } else {
    return classes
  }
}


// Adds new row to data sheet with username, date, course preferences
function addUsername(username, courses, numberOfClasses) {
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
function findRankedClasses(days, classes) {
  const classIds = classes.map(c => c[1])
  const sheet = mainScheduleSpreadsheet.getSheetByName(classListSheetName);
  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getValues();
  const classArr = [];
  const addLater = [];

  for (i = 0; i < classData.length; i++) {
    if (days.includes(classData[i][5].toLowerCase())) {
      if (classIds.includes(String(classData[i][0]))) {
        for (j = 0; j < classes.length; j++) {
          if (classes[j][1] === String(classData[i][0])) {
            var value = classes[j][0]
          }
        }
        classArr.push([`<input class="w-12 mx-3 pl-3 border-2 border-zinc-400" type="number" min="1" max="${maxNumber}" value="${value}" id="${classData[i][0]}">`, classData[i][0], classData[i][1], classData[i][5], classData[i][3], classData[i][4], classData[i][7]])
      } else {
        addLater.push([`<input class="w-12 mx-3 pl-3 border-2 border-zinc-400" type="number" min="1" max="${maxNumber}" id="${classData[i][0]}">`, classData[i][0], classData[i][1], classData[i][5], classData[i][3], classData[i][4], classData[i][7]])
      }
    }
  }

  addLater.forEach(arr => classArr.push(arr))
  return classArr
}


// Returns if username is already on sheet
function checkUsername(username) {
  const sheet = mainScheduleSpreadsheet.getSheetByName(submitPreferencesSheetName);
  const usernames = sheet.getRange(2, 2, sheet.getLastRow(), 1).getValues();

  for (i = 0; i < usernames.length; i++) {
    if (usernames[i][0].toLowerCase() === username.toLowerCase()) {
      return true
    }
  }

  return false
}


function getPreferences(username) {
  // let username = 'achilleas';
  const sheet = mainScheduleSpreadsheet.getSheetByName('General Preferences')

  const teachers = sheet.getRange(3, 2, sheet.getLastRow(), 1).getValues();
  const data = teacherPrefRow(teachers, username, sheet)

  // const prefObj = {
  //   'pa1': data[0],
  //   'pa2': data[1],
  //   'alga': data[2],
  //   'algb': data[3],
  //   'icp': data[4],
  //   'int': data[5],
  //   'geo': data[6],
  // }

  return data
}

// Helper function called by getPreferences()
// Returns preferences row for teacher from General Preferences sheet
function teacherPrefRow(teacherArr, teacher, sheet) {
  for (let i = 0; i < teacherArr.length; i++) {
    if (teacherArr[i][0].toLowerCase() === teacher) {
      let timeDayPrefValues = sheet.getRange(i+3, 3, 1, 14).getValues()[0]
      let timeDayPref = reorderDays(timeDayPrefValues);
      let coursePref = sheet.getRange(i+3, 17, 1, 27).getValues()[0].reverse() // If General Preferences every changes columns, this will break
      return [timeDayPref, coursePref]
    }
  }
}


// Helper function to order days correctly for spreadsheet
// Days pulled from app early for each day then late
// Days on sheet are early/late for each day
function reorderDays(dayArr) {
  // let dayArr = [1,	1,	1,	1,	1,	1,	1,	0,	1,	0,	1,	1,	1,	1]
  // let dayArr = ['mon day', 'mon late', 'tue day', 'tue late', 'wed day', 'wed late', 'thu day', 'thu late', 'fri day', 'fri late', 'sat day', 'sat late', 'sun day', 'sun late']
  const tempArr = []
  const resultArr = []

  for (let i = 0; i < dayArr.length; i++) {
    if (i % 2 === 0) {
      resultArr.push(dayArr[i])
    } else {
      tempArr.push(dayArr[i])
    }
  }

  return resultArr.concat(tempArr)
}


function addPrefRow(teacher, row) {
  // let teacher = 'Achilleas'
  // let row = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0]
  const sheet = mainScheduleSpreadsheet.getSheetByName('General Preferences')
  const teachers = sheet.getRange(3, 2, sheet.getLastRow(), 1).getValues();
  const rowData = [new Date, teacher, ...row];

  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i][0].toLowerCase() === teacher.toLowerCase()) {
      var targetRow = i + 3
    }
  }

  sheet.getRange(targetRow, 1, 1, 43).setValues([rowData]);

  // return rowData;

}
