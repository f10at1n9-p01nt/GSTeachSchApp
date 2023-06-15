const mainScheduleSpreadsheet = SpreadsheetApp.openById('1uGZDjfgBqGx93cpx8UUNM3-sNahbeC6HKWRCYT6ZU0s');
const classListSheetName = mainScheduleSpreadsheet.getSheetByName('Dashboard').getRange(2, 2).getValue();
const maxNumber = mainScheduleSpreadsheet.getSheetByName('Dashboard').getRange(4,2).getValue();

function doGet(request) {

  if (request.parameters.page == "sched") {
    return loadForm();
  } else if (request.parameters.page == "pref") {
    return HtmlService.createTemplateFromFile('general-preferences').evaluate();
  } else
    var template = HtmlService.createTemplateFromFile('home')
    template.season = `${mainScheduleSpreadsheet.getSheetByName('Dashboard').getRange(1,2).getValue()}`;
    
  return template.evaluate();

}


function loadForm() {
  let template = HtmlService.createTemplateFromFile('index');
  template.season = `${mainScheduleSpreadsheet.getSheetByName('Dashboard').getRange(1,2).getValue()}`;

  return template.evaluate();
}
