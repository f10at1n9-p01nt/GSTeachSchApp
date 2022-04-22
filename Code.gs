function doGet(request) {
  let template = HtmlService.createTemplateFromFile('index')
  template.season = "Summer 2022 Schedule";

  const sheet = SpreadsheetApp.openById('1b_Bup-DyjUUopMCqbpXgaW6j0HNotnXOEtcamiC_ufk').getSheetByName('Sheet1')

  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getValues();
  let rows = []

  for (let i = 0; i < classData.length; i++) {
    rows.push(`<li class="ml-5 mt-3">${classData[i][0]} ${classData[i][1]} ${classData[i][3]} ${classData[i][4]} ${classData[i][5]} ${classData[i][7]} </li>`);
  }

  template.rows = rows.join('');

  return template.evaluate();
}


function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


function checkSchedule(username) {
  
  const sheet = SpreadsheetApp.openById('1b_Bup-DyjUUopMCqbpXgaW6j0HNotnXOEtcamiC_ufk').getSheetByName('data');
  const usernames = sheet.getRange(1, 1, sheet.getLastRow()).getValues();

  for (let i = 0; i < usernames.length; i++) {
    if (usernames[i][0] == username) {
      let teacherSchedule = sheet.getRange(i+1, 2, 1, sheet.getLastColumn()-1).getValues();
      result = [];
      for (let i = 0; i < teacherSchedule[0].length; i++) {
        if (teacherSchedule[0][i] != '') {
          result.push(teacherSchedule[0][i])
        }
      }
      // let row = teacherSchedule.map(data => data[0])
      // return `Found username: ${username}`
      // return teacherSchedule;
      return result;
    }
  }
}


function test() {
    const sheet = SpreadsheetApp.openById('1b_Bup-DyjUUopMCqbpXgaW6j0HNotnXOEtcamiC_ufk').getSheetByName('data');
  let teacherSchedule = sheet.getRange(1, 2, 1, sheet.getLastColumn()-1).getValues();

  Logger.log(teacherSchedule)
  Logger.log(teacherSchedule[0][2]);
}