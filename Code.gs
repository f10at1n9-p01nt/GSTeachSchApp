function doGet(request) {
  let template = HtmlService.createTemplateFromFile('index')
  template.season = "Summer 2022 Schedule";

  const sheet = SpreadsheetApp.openById('1b_Bup-DyjUUopMCqbpXgaW6j0HNotnXOEtcamiC_ufk').getSheetByName('Sheet1')

  template.classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getValues();
  template.classIds = sheet.getRange(2, 1, sheet.getLastRow()-1).getValues();

  return template.evaluate();
}


function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}