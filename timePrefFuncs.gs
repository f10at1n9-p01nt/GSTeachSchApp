// Sun:4-99, Mon:100-195,Tue:196-291, Wed:292-387, Thu:388-483, Fri: 484-579, Sat:580-675
function updateArr(timeArr, cell) {
  const [weekday, time] = cell;
  // Logger.log(`Weekday is ${weekday} and time is ${time}`)
  const row = weekday * 96 + 4 + Math.floor(time.split(':')[0] * 4) + Math.floor(time.split(':')[1] / 15);

  timeArr[row - 1][0] = 1;

  return timeArr;
}

function sendTimePrefToSheet(username, prefs) {
//   const prefs = [
//     [
//         0,
//         "00:00"
//     ],
//     [
//         0,
//         "00:15"
//     ]
// ]
  // const username = ["kevinyaiko"]
  const sheet = SpreadsheetApp.openById('1uGZDjfgBqGx93cpx8UUNM3-sNahbeC6HKWRCYT6ZU0s').getSheetByName('Staff Availability');

  let column = findUserNameCol(username[0], sheet)

  if (column < 3) {
    column = 3
  }

  const timeArr = new Array(675).fill().map(() => [0]);
  prefs.forEach(cell => {
    updateArr(timeArr, cell)
  })

  const date = new Date();
  const options = { timeZone: 'America/New_York', hour12: false, timeZoneName: 'short' };
  timeArr[0][0] = date.toLocaleString('en-US', options).slice(0, -3)
  timeArr[1][0] = ''
  timeArr[2][0] = ''

  sheet.getRange(1, column, 675).setValues(timeArr); // Need to update col to correct username column
  if (column === 3) {
    sheet.getRange('C2').setFormula("=TRANSPOSE(SORT('General Preferences'!B3:B))")
  }
}


function findUserNameCol(username, sheet) {
  const usernames = sheet.getRange(2, 3, 1, sheet.getLastColumn()-2).getValues()
  const column = usernames[0].indexOf(username)
  
  return column + 3 // +3 accounts for 0 index and usernames starting in column C
}