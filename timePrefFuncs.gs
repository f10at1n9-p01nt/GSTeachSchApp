// Sun:2-97, Mon:98-193,Tue:194-289, Wed:290-385, Thu:386-481, Fri: 482-577, Sat:578-673
function updateArr(timeArr, cell) {
  const [weekday, time] = cell;

  const row = weekday * 96 + 2 + Math.floor(time.split(':')[0] * 4) + Math.floor(time.split(':')[1] / 15);

  timeArr[row - 1][0] = "TRUE";

  return timeArr;
}

function sendTimePrefToSheet(prefs) {
  const sheet = SpreadsheetApp.openById('1uGZDjfgBqGx93cpx8UUNM3-sNahbeC6HKWRCYT6ZU0s').getSheetByName('Staff Availability');
  const timeArr = new Array(672).fill().map(() => ["FALSE"]);
  Logger.log(timeArr)
  prefs.forEach(cell => {
    updateArr(timeArr, cell)
  })

  sheet.getRange(3, 3, 672).setValues(timeArr); // Need to update col to correct username column
}
