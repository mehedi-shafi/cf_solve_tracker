var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
var CFhandleRow = 6;
var firstUserColumn = 7;
var firstContestRow = 13;

function myFunction(){
  Logger.log('test passed');
}

function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Auto CF')
       .addItem('Update Contest', 'currentChosenContest')
       .addItem('Update User', 'currentChosenUser')
       .addToUi();
}

function getSolveCount(url){
  var response = UrlFetchApp.fetch(url);
  Logger.log(response.getContentText());
  return JSON.parse(response);
}

function currentChosenUser (){
  var col = currentChosenCellColumn()/2*2;
  var row = currentChosenCellRow();
  var userId = getCurrentUser(col);
  
  var Avals = sheet.getRange("A"+firstContestRow+":A").getValues();
  var Alast = Avals.filter(String).length;
  
  var totalMismatch = 0;
  var misMatches = [];
  var updated = "\n";
  
  if (userId != null && userId != ''){
    var contestRow = firstContestRow;
    for (var i = contestRow, j = 0; j < Alast; ++i, ++j){
      var formula = sheet.getRange(i, 1).getFormula();
      var url = getUrlFromForumla(formula);
      var contestId = getLastSplit(url, '/');
      if (contestId != null && contestId != ''){
        var link = buildUrl(userId, contestId);
        Logger.log("trying url: " + link);
        var solveCount = getSolveCount(link);
        if (solveCount[0] == 'ERR' || solveCount[1] == 'ERR'){
//          sheet.getRange(i, col).setBackground("red");
//          sheet.getRange(i, col + 1).setBackground("red");
        }
        else{
          var prevSolve=sheet.getRange(i, col).getValue();
          var prevUpsolve=sheet.getRange(i, col+1).getValue();
          if(prevSolve!=solveCount[0]){
            totalMismatch++;
            updated=updated.concat('\n(Row ' + i +' Solve) -> "' +prevSolve + '"' + ' to "' + solveCount[0] + '"');
          }
          sheet.getRange(i, col).setValue(solveCount[0]);
          if(prevUpsolve!=solveCount[1]){
            totalMismatch++;
            updated=updated.concat('\n(Row ' + i +' Upsolve) -> "' +prevUpsolve + '"' + ' to "' + solveCount[1] + '"');
            if (solveCount[1] != 0){
              sheet.getRange(i, col + 1).setValue(solveCount[1]);
            }else{
              sheet.getRange(i, col+1).setValue('');
            }
          }
          
        }      
      }
    }
  }
  timezone = "GMT+" + new Date().getTimezoneOffset()/60
  var date = Utilities.formatDate(new Date(), timezone, "HH:mm yyyy-MM-dd");
  var endMsg = "\n\nPlease report to sajjad15-6764@diu.edu.bd if you have any issue regarding this update";
  sheet.getRange(8, col).setNote("Updated at \n" + date + " UTC\nTotal mismatch: " + totalMismatch + updated + endMsg);
  var userName = sheet.getRange(CFhandleRow, col).getValue();
  Browser.msgBox('Finished Running Script For User: '+ userName + "\\nTotal mismatch: " + totalMismatch);
}

function currentChosenContest(){
  var col = currentChosenCellColumn();
  var row = currentChosenCellRow();
  
//  get contest ID from selected CELL
  var formula = sheet.getRange(row, 1).getFormula();
  var url = getUrlFromForumla(formula);
  var contestName = sheet.getRange(row, 1).getValue(); 
  var contestId = getLastSplit(url, '/');
  
  var currentUserColumn = firstUserColumn;
  
  for (var i = currentUserColumn; i <= sheet.getLastColumn(); i+=2){
    var currentUserId = getCurrentUser(i);
    if (currentUserId != '' && currentUserId != null){
      var url = buildUrl(currentUserId, contestId);
      Logger.log("trying url: " + url);
      var solveCount = getSolveCount(url);
      if (solveCount[0] == 'ERR' || solveCount[1] == 'ERR'){
        sheet.getRange(row, i).setBackground("red");
        sheet.getRange(row, i + 1).setBackground("red");
      }
      else{          
        sheet.getRange(row, i).setValue(solveCount[0]);
        if (solveCount[1] != 0){
          sheet.getRange(row, i+1).setValue(solveCount[1]);
        }else{
          sheet.getRange(row, i+1).setValue('');
        }
      }
    }
  }
  Browser.msgBox('Finished Running Script For Contest: '+ contestName);
}

function buildUrl(handle, contestid){
//  var url = 'https://blue-cf-tracker.herokuapp.com/{{ handle }}/{{ contestid }}';
  var url = 'https://cf-contest-tracker.herokuapp.com/{{ handle }}/{{ contestid }}';
  url = url.replace('{{ handle }}', handle);
  url = url.replace('{{ contestid }}', contestid);
  return url;
}

function getUrlFromForumla(formula){
  if (formula == '' || formula == null){
    return null;
  }
  var extracted = /"(.*?)"/.exec(formula);
  if (extracted != null && extracted.length >= 2){
    return extracted[1];
  }
  return formula; 
}

function getCurrentUser(column){
  var userProfileLink = getUrlFromForumla(sheet.getRange(CFhandleRow, column).getFormula());
  if (userProfileLink == null || userProfileLink == ''){
    var urlFromValue = getUrlFromForumla(sheet.getRange(CFhandleRow, column).getValue());
    return getLastSplit(urlFromValue, '/');
  }
  return getLastSplit(userProfileLink, '/');
}

function getLastSplit(text, splitter){
  if (text != null && text.length > 0){
    var splits = text.split(splitter);
    return splits[splits.length - 1];
  }
  return text;
}
function getSelectedCellUrl(){
  return sheet.getActiveCell().getFormula();
}

function getCurrentCellValue(){
  return sheet.getActiveCell().getValue();
}

function currentChosenCellRow(){
  return sheet.getActiveCell().getRow();
}

function currentChosenCellColumn(){
  return sheet.getActiveCell().getColumn();
}