// Returns array of all classes for requested days with number input attached
function getClasses(days, ranks) {
  const sheet = mainScheduleSpreadsheet.getSheetByName(classListSheetName)

  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getValues();
  let rows = []
  let rankedIds = ranks.map(c => c[1])
  let value = '';

  for (let i = 0; i < classData.length; i++) {
    if (days.includes(classData[i][5].toLowerCase().trim())) {
      if (rankedIds.includes(String(classData[i][0]))) {
        for (j = 0; j < rankedIds.length; j++) {
          if (String(classData[i][0]) === ranks[j][1]) {
            value = ranks[j][0];
          }
        }
      }
      rows.push([`<input class="form-label" type="number" min="1" max="${maxNumber}" value="${value}" id="${classData[i][0]}">`, classData[i][0], classData[i][1], classData[i][5], classData[i][3], classData[i][4], classData[i][7]]);
    }
    value = ''
  }
  return rows
}


function checkSchedule(username) {
  const lineupSheet = mainScheduleSpreadsheet.getSheetByName('Official Schedule');
  const teacherCol = lineupSheet.getRange(2, 12, lineupSheet.getLastRow()-1, 1).getValues();
  const classes = [];

  for (let i = 0; i < teacherCol.length; i++) {
    Logger.log(teacherCol[i][0])
    if (teacherCol[i][0].toLowerCase() === username.toLowerCase()) {
      if (lineupSheet.getRange(i+2, 4).getValue() != "Ended" && lineupSheet.getRange(i+2, 4).getValue() != "Cancelled") {
        let data = lineupSheet.getRange(i+2, 1, 1, 9).getDisplayValues(); // Need to add two since row 1 has 0 teachers and counting starts at 1 and not 0
        Logger.log(data)
        data[0].splice(2, 3); // Should remove Code and Start [ID, Course, End, Day, Weeks, Time]
        data[0].splice(4, 1); // Should remove Weeks [ID, Course, End, Day, Time]
        [data[0][2], data[0][3]] = [data[0][3], data[0][2]] //Swap End,Day [ID, Course, Day, End, Time]
        data.forEach(d => classes.push(d));
      }
    }
  }

  if (classes.length === 0) {
    return [['No', 'current', 'classes']]
  } else {
    return classes
  }
}


// Adds new row to data sheet with username, date, course preferences
function addUsername(username, courses, numberOfClasses) {
  const sheet = mainScheduleSpreadsheet.getSheetByName(submitPreferencesSheetName);
  const rowData = [new Date(), username];

  const rankedCourses = sortRanking(courses);
  
  // Restricts list of ranked courses to that set in dashboard in Instructor Scheduling Sheet - maxNumber is a global variable
  if (rankedCourses.length > maxNumber) {
    rankedCourses.length = maxNumber;
  }

  rankedCourses.forEach(course => rowData.push(course[1]))

  while (rowData.length < Number(maxNumber) + 2) {
    rowData.push('');
  }
  rowData.push(numberOfClasses);

  sheet.appendRow(rowData);
  // sheet.getRange(sheet.getLastRow(), 3, 1, 10).setNumberFormat("@"); // sets the data for course IDs to plain text
  sheet.getRange(sheet.getLastRow(), 3, 1, 10);

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
  // let days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sun', 'tue, thu', 'mon, wed, fri']
  // let classes = [["5", "3263"], ["2", "3253"], ["3", "3297"], ["1", "3258"]]
  const sortedClasses = sortRanking(classes); // Added this in case it helps order the classes - right now it just pulls them to the top
  const classIds = sortedClasses.map(c => c[1])
  const sheet = mainScheduleSpreadsheet.getSheetByName(classListSheetName);
  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getValues();
  const classArr = [];
  const addLater = [];

  //Loop through ranked classes
  sortedClasses.forEach((cls) => {
    for (let i = 0; i < classData.length; i++) {
      if (classData[i][0] === cls[1]) {
        if (days.includes(classData[i][5].toLowerCase())) {
          let value = cls[0]
          classArr.push([`<input class="form-label" type="number" min="1" max="${maxNumber}" value="${value}" id="${classData[i][0]}">`, classData[i][0], classData[i][1], classData[i][5], classData[i][3], classData[i][4], classData[i][7]]);
        }
      }
    }
  })

  for (let i = 0; i < classData.length; i++) {
    if (!classIds.includes(classData[i][0])) {
      if (days.includes(classData[i][5].toLowerCase())) {
        classArr.push([`<input class="form-label" type="number" min="1" max="${maxNumber}" id="${classData[i][0]}">`, classData[i][0], classData[i][1], classData[i][5], classData[i][3], classData[i][4], classData[i][7]]);
      }
    }
  }
  return classArr
}

                // classArr.push([`<input class="w-12 mx-3 pl-3 border-2 border-zinc-400" type="number" min="1" max="${maxNumber}" value="${value}" id="${classData[i][0]}">`, classData[i][0], classData[i][1], classData[i][5], classData[i][3], classData[i][4], classData[i][7]])

                        // classArr.push([`<input class="w-12 mx-3 pl-3 border-2 border-zinc-400" type="number" min="1" max="${maxNumber}" id="${classData[i][0]}">`, classData[i][0], classData[i][1], classData[i][5], classData[i][3], classData[i][4], classData[i][7]])


// Returns if username is already on sheet
function checkUsername(username) {
  const sheet = mainScheduleSpreadsheet.getSheetByName(submitPreferencesSheetName);
  const usernames = sheet.getRange(2, 2, sheet.getLastRow(), 1).getValues();

  for (i = 0; i < usernames.length; i++) {
    if (usernames[i][0].toLowerCase() === username.toLowerCase()) {
      Logger.log(true)
      return true
    }
  }
  Logger.log(false)
  return false
}


function getPreferences(username) {
  // let username = 'achilleas';
  const sheet = mainScheduleSpreadsheet.getSheetByName('General Preferences')

  const teachers = sheet.getRange(3, 2, sheet.getLastRow(), 1).getValues();
  const data = teacherPrefRow(teachers, username, sheet)

  return data
}

// Helper function called by getPreferences()
// Returns preferences row for teacher from General Preferences sheet
function teacherPrefRow(teacherArr, teacher, sheet) {
  for (let i = 0; i < teacherArr.length; i++) {
    if (teacherArr[i][0].toLowerCase() === teacher) {
      let timeDayPrefValues = sheet.getRange(i+3, 3, 1, 14).getValues()[0]
      let timeDayPref = reorderDays(timeDayPrefValues);
      let coursePref = sheet.getRange(i+3, 17, 1, 29).getValues()[0].reverse() // If General Preferences ever changes columns, this will break
      return [timeDayPref, coursePref]
    }
  }
}


// Helper function to order days correctly for spreadsheet
// Days pulled from app early for each day then late
// Days on sheet are early/late for each day
function reorderDays(dayArr) {
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
  const sheet = mainScheduleSpreadsheet.getSheetByName('General Preferences')
  const teachers = sheet.getRange(3, 2, sheet.getLastRow(), 1).getValues();
  const rowData = [new Date, teacher, ...row];

  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i][0].toLowerCase() === teacher.toLowerCase()) {
      var targetRow = i + 3
    }
  }

  sheet.getRange(targetRow, 1, 1, 45).setValues([rowData]); //Changed to 45
}


function authenticateUser(username) {
  const sheet = mainScheduleSpreadsheet.getSheetByName('General Preferences');
  const teachers = sheet.getRange(3, 2, sheet.getLastRow(), 1).getValues();

  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i][0]=== username && username != '') {
      return true
    }
  }
  return false
}
