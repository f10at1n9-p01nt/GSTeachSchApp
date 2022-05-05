const mainScheduleSpreadsheet = SpreadsheetApp.openById('1uGZDjfgBqGx93cpx8UUNM3-sNahbeC6HKWRCYT6ZU0s');
const classListSheetName = mainScheduleSpreadsheet.getSheetByName('Dashboard').getRange(2, 2).getValue();
const submitPreferencesSheetName = mainScheduleSpreadsheet.getSheetByName('Dashboard').getRange(3, 2).getValue();
const maxNumber = mainScheduleSpreadsheet.getSheetByName('Dashboard').getRange(4,2).getValue();

function doGet(request) {

  if (request.parameters.page == "sched") {
    return loadForm();
  } else if (request.parameters.page == "pref") {
    return HtmlService.createTemplateFromFile('general-preferences').evaluate();
  } else
    var template = HtmlService.createTemplateFromFile('home')
    template.season = `${mainScheduleSpreadsheet.getSheetByName('Dashboard').getRange(1,2).getValue()} Schedule`;
    return template.evaluate();

}


function loadForm() {
  let template = HtmlService.createTemplateFromFile('index');
  template.season = `${mainScheduleSpreadsheet.getSheetByName('Dashboard').getRange(1,2).getValue()} Schedule`;

  const sheet = mainScheduleSpreadsheet.getSheetByName(classListSheetName)

  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getValues();
  let rows = []

  for (let i = 0; i < classData.length; i++) {
    rows.push(`<li class="ml-5 mt-3"><input class="w-12 mx-3 pl-3 border-2 border-zinc-400" type="number" min="1" max="${maxNumber}" id="${classData[i][0]}">${classData[i][0]} ${classData[i][1]} ${classData[i][3]} ${classData[i][4]} ${classData[i][5]} ${classData[i][7]} </li>`);
  }

  template.rows = rows.join('');

  return template.evaluate();
}