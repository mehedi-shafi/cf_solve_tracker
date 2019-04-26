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
    let upsolve = 0;
    let contestSolve = 0;
    for (let i = 0; i < submissionCount; ++i){
        if (isContestSolve(submissions[i])){
            contestSolve++;
        }
        else if (isUpSolve(submissions[i])){
            upsolve ++;
        }
    }
    if (contestSolve == 0){
        let contestSubmission = contestTimeSubmissionCount(submissions);
        if (contestSubmission == 0){
            contestSolve = 'A';
        }
    }
    return [contestSolve, upsolve];
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
