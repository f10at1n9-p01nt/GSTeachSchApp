// Called in index to add Javascript and Stylesheet
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function dummyFunc () {
  return null
}


function getScriptURL() {
  return ScriptApp.getService().getUrl();
}