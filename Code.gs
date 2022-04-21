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