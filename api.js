let request = require('request');

let getContestStatus = (url, callback) => {
    request(url, (err, response, body) => {
        if (err){
            console.error(err);
        }
        else{
            let responseBody = JSON.parse(body);
            let response = processStatus(responseBody);
            console.log(response);
            callback(JSON.stringify(response));
        }
    })
};

let processStatus = (contestStatus) => {
    if (contestStatus.status == 'OK'){
        if (contestStatus.result.length == 0){
            return ['A', 0];
        }
        else{
            return getSolveCount(contestStatus.result);
        }
    }
    else{
        console.log(contestStatus);
        console.log("Api returned non OK status");
        return ["ERR", "ERR"];
    }
}

let getSolveCount = (submissions) => {
    let submissionCount = submissions.length;
    let upsolves = getUpSolveSubmissions(submissions);
    let contestSolves = getContestSubmissions(submissions);
    if (contestSolves.length == 0){
        return ['A', upsolves.length];
    }
    let n = contestSolves.length;
    for (let i = 0; i < n; ++i){
        if (isin(upsolves, contestSolves[i])){
            upsolves.splice(upsolves.indexOf(contestSolves[i]), 1);
        }
    }
    return [contestSolves.length, upsolves.length];
}

let getContestSubmissions = (submissions) => {
    let n = submissions.length;
    let contestSubmissions = [];
    for (let i = 0; i < n; ++i){
        if (submissions[i].author.participantType == 'CONTESTANT' || submissions[i].author.participantType == 'OUT_OF_COMPETITION'){
            contestSubmissions.push(submissions[i]);
        }
    }
    if (contestSubmissions.length == 0){
        return [];
    }
    return getUniqueSolveSubmissions(contestSubmissions);
}

let getUpSolveSubmissions = (submissions) => {
    let n = submissions.length;
    let upsolveSubmissions = [];
    for (let i = 0; i < n; ++i){
        if (submissions[i].author.participantType == 'PRACTICE'){
            upsolveSubmissions.push(submissions[i]);
        }
    }
    return getUniqueSolveSubmissions(upsolveSubmissions);
}

let getUniqueSolveSubmissions = (submissions) => {
    let n = submissions.length;
    let uniqueSolves = [];
    for (let i = 0; i < n; ++i){
        if (submissions[i].verdict == 'OK'){
            if (!isin(uniqueSolves, submissions[i].problem.index)){
                uniqueSolves.push(submissions[i].problem.index);
            }
        }
    }
    return uniqueSolves;
}

let isin = (arr, x) => {
    let n = arr.length;
    for (let i = 0; i < x; ++i){
        if (arr[i] == x){
            return true;
        }
    }
    return false;
}


let contestTimeSubmissionCount = (submissions) => {
    let z = submissions.length;
    let cnt = 0;
    for (let i = 0; i < z; ++i){
        if (submissions[i].author.participantType == 'CONTESTANT'){
            cnt ++;
        }
    }
    return cnt;
}

let isContestSolve = (submission) => {
    if (submission.author.participantType == "CONTESTANT"){
        if (submission.verdict == "OK"){
            return true;
        }
    }
    return false;
}

let isUpSolve = (submission) => {
    if (submission.author.participantType != "CONTESTANT"){
        if (submission.verdict == "OK"){
            return true;
        }
    }
    return false;
}

module.exports.getContestStatus = getContestStatus;
