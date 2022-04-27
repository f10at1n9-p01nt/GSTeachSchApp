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


// Finds data on Summer 2022 Lineup
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


function addUsername(username) {
  const sheet = SpreadsheetApp.openById('1b_Bup-DyjUUopMCqbpXgaW6j0HNotnXOEtcamiC_ufk').getSheetByName('data')
  sheet.appendRow([username, new Date()]);
}


function test() {
  const lineupSheet = SpreadsheetApp.openById('1326N0jPlCf24inE9Q59oQf19Wv10aBHhE-gih5hNGfY').getSheetByName('Lineup');
  const teacherCol = lineupSheet.getRange(2, 6, lineupSheet.getLastRow()-1, 1).getValues();
  const classes = [];

  for (let i = 0; i < teacherCol.length; i++) {
    if (teacherCol[i][0] === 'bedwards') {
      let data = lineupSheet.getRange(i+1, 1, 1, 2).getValues();
      data.forEach(d => classes.push(d))
      Logger.log(classes)
    }
  }

  return classes;
}