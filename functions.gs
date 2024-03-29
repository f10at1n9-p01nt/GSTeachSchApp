// Returns array of all classes for requested days with number input attached
function getClasses(days, ranks) {
  const sheet = mainScheduleSpreadsheet.getSheetByName(classListSheetName)

  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getDisplayValues();
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
  const teacherCol = lineupSheet.getRange(2, 12, lineupSheet.getLastRow()-1, 1).getDisplayValues();
  const assistantOneCol = lineupSheet.getRange(2, 17, lineupSheet.getLastRow()-1, 1).getDisplayValues();
  const assistantTwoCol = lineupSheet.getRange(2, 18, lineupSheet.getLastRow()-1, 1).getDisplayValues();
  const cols = [teacherCol, assistantOneCol, assistantTwoCol]
  const classes = [];

  cols.forEach((col) => {
    for (let i = 0; i < col.length; i++) {
      if (col[i][0].toLowerCase() === username.toLowerCase()) {
        if (lineupSheet.getRange(i+2, 4).getValue() != "Ended" && lineupSheet.getRange(i+2, 4).getValue() != "Cancelled") {
          let data = lineupSheet.getRange(i+2, 1, 1, 9).getDisplayValues(); // Need to add two since row 1 has 0 teachers and counting starts at 1 and not 0
          data[0].splice(2, 3); // Should remove Code and Start [ID, Course, End, Day, Weeks, Time]
          data[0].splice(4, 1); // Should remove Weeks [ID, Course, End, Day, Time]
          [data[0][2], data[0][3]] = [data[0][3], data[0][2]] //Swap End,Day [ID, Course, Day, End, Time]
          data.forEach(d => classes.push(d));
        }
      }
    }
  })

  if (classes.length === 0) {
    return [['No', 'current', 'classes']]
  } else {
    return classes
  }
}


// Adds new row to data sheet with username, date, course preferences
function addUsername(username, courses, numberOfClasses, role) {
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
  rowData.push(role);

  if (role.toLowerCase() === 'instructor') {
    var sheet = mainScheduleSpreadsheet.getSheetByName('Instructor Responses');
  } else {
    var sheet = mainScheduleSpreadsheet.getSheetByName('Assistant Responses');
  }
  sheet.appendRow(rowData);
  // sheet.getRange(sheet.getLastRow(), 3, 1, 10).setNumberFormat("@"); // sets the data for course IDs to plain text
  // sheet.getRange(sheet.getLastRow(), 3, 1, 10);

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
  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getDisplayValues();
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


// Returns if username is already on sheet for given role
function checkUsername(username, role) {
  if (role.toLowerCase() === 'instructor') {
    var sheet = mainScheduleSpreadsheet.getSheetByName('Instructor Responses');
  } else {
    var sheet = mainScheduleSpreadsheet.getSheetByName('Assistant Responses');
  }

  const usernames = sheet.getRange(2, 2, sheet.getLastRow(), 1).getValues();
  const roles = sheet.getRange(2, 14, sheet.getLastRow(), 1).getValues();

  for (i = 0; i < usernames.length; i++) {
    if (usernames[i][0].toLowerCase() === username.toLowerCase()) {
      if (roles[i][0] === role) {
        return true
      }
    }
  }
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
      let coursePref = sheet.getRange(i+3, 17, 1, 30).getValues()[0].reverse() // If General Preferences ever changes columns, this will break
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

  sheet.getRange(targetRow, 1, 1, 46).setValues([rowData]); //Changed to 46 with CodeWOOT
}


function authenticateUser(username) {
  const sheet = mainScheduleSpreadsheet.getSheetByName('General Preferences');
  const sheetTwo = SpreadsheetApp.openById('1W9GSrx-12ALbETFlmuoHPY90j2WGhwoQkimhZvUTtK0').getSheetByName('Grader Preferences')
  const teachers = sheet.getRange(3, 2, sheet.getLastRow(), 1).getValues();
  const graders = sheetTwo.getRange(3, 2, sheetTwo.getLastRow(), 1).getValues();

  for (let i = 0; i < teachers.length; i++) {
    if (teachers[i][0] === username && username != '') {
      return 'teacher'
    }
  }

  for (let i = 0; i < graders.length; i++) {
    if (graders[i][0] === username && username != '') {
      return 'grader'
    }
  }

  return false
}


// Returns true if assistant only, otherwise false
function checkAssistantOnly(username) {
  const contractorsUniversal = SpreadsheetApp.openById('1QFD2-76RIHwd_WEe5HooOKDkggiMuS5gR3iA7mCv8rc').getSheetByName('Master List');
  const assistantColumnNumber = findColumnNumber(contractorsUniversal, 'Assist');
  const instructorColumnNumber = findColumnNumber(contractorsUniversal, 'Teach');
  const usernameColumnNumber = findColumnNumber(contractorsUniversal, 'Username');

  const usernames2D = contractorsUniversal.getRange(2, usernameColumnNumber, contractorsUniversal.getLastRow()).getValues();
  const usernames = [].concat(...usernames2D).map((username) => username.toLowerCase());
  const usernameRow = usernames.indexOf(username.toLowerCase()) + 2

  const isInstructor = contractorsUniversal.getRange(usernameRow, instructorColumnNumber).getDisplayValue();
  const isAssistant = contractorsUniversal.getRange(usernameRow, assistantColumnNumber).getDisplayValue();

  if (isAssistant === 'Y' && isInstructor !== 'Y') {
    console.log('true')
    return true
  }
  console.log('false')
  return false;
}


// Helper function to find column number of 'Grade' column in Contractor's Universal
function findColumnNumber (sheet, columnName) {
  const columnHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()

  return columnHeaders[0].indexOf(columnName) + 1
}




// Grader Preferences Functions Repurposed from above

function getGraderPreferences(username) {
  // let username = 'achilleas';
  const sheet = SpreadsheetApp.openById('1W9GSrx-12ALbETFlmuoHPY90j2WGhwoQkimhZvUTtK0').getSheetByName('Grader Preferences')

  const graders = sheet.getRange(3, 2, sheet.getLastRow(), 1).getValues();
  const data = graderPrefRow(graders, username, sheet)

  return data
}

// Helper function called by getPreferences()
// Returns preferences row for grader from Grader Preferences sheet
function graderPrefRow(graderArr, grader, sheet) {
  for (let i = 0; i < graderArr.length; i++) {
    if (graderArr[i][0].toLowerCase() === grader) {
      // let timeDayPrefValues = sheet.getRange(i+3, 3, 1, 14).getValues()[0]
      // let timeDayPref = reorderDays(timeDayPrefValues);
      let coursePref = sheet.getRange(i+3, 3, 1, 30).getValues()[0].reverse() // If General Preferences ever changes columns, this will break
      return [coursePref]
    }
  }
}

function addGraderPrefRow(grader, row) {
  const sheet = SpreadsheetApp.openById('1W9GSrx-12ALbETFlmuoHPY90j2WGhwoQkimhZvUTtK0').getSheetByName('Grader Preferences')
  const graders = sheet.getRange(3, 2, sheet.getLastRow(), 1).getValues();
  const rowData = [new Date, grader, ...row];

  for (let i = 0; i < graders.length; i++) {
    if (graders[i][0].toLowerCase() === grader.toLowerCase()) {
      var targetRow = i + 3
    }
  }

  sheet.getRange(targetRow, 1, 1, 32).setValues([rowData]);
}
