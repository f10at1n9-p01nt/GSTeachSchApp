function doGet(request) {
  let template = HtmlService.createTemplateFromFile('index')
  template.season = "Summer 2022 Schedule";

  const sheet = SpreadsheetApp.openById('1b_Bup-DyjUUopMCqbpXgaW6j0HNotnXOEtcamiC_ufk').getSheetByName('Sheet1')

  let classData = sheet.getRange(2, 1, sheet.getLastRow()-1, 11).getValues();
  let rows = []

  for (let i = 0; i < classData.length; i++) {
    rows.push(`<li class="ml-5 mt-3"><input class="w-12 mx-3 pl-3" type="number" min="1" max="10">${classData[i][0]} ${classData[i][1]} ${classData[i][3]} ${classData[i][4]} ${classData[i][5]} ${classData[i][7]} </li>`);
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


function addUsername(username, courses) {
  const sheet = SpreadsheetApp.openById('1b_Bup-DyjUUopMCqbpXgaW6j0HNotnXOEtcamiC_ufk').getSheetByName('data')
  const rowData = [username, new Date()]

  const rankedCourses = sortRanking(courses);

  rankedCourses.forEach(course => rowData.push(course[1]))
  console.log(rowData);
  sheet.appendRow(rowData);

}


function sortRanking(coursesArr) {
  // const coursesArr = [[1, '3001'], [3, 3003], [2, 3002], [5, 3005]];
  const rankedCourses = coursesArr.sort(function(a, b) {
    return a[0] - b[0]
  })

  Logger.log(rankedCourses)
  return rankedCourses
}


function test() {
  const ul = document.getElementById('class-list');
  const classes = ul.getElementsByTagName("li");

  for (let i = 0; i < classes.length; i++) {
    console.log(classes[i])
  }
}