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
    let onlineParticipant = getOnlineSubmissionCount(submissions);
    let acSubmissions = getAcSubmissions(submissions);
    let contestSolves = getContestSubmissions(submissions);
    let upSolves = getUpSolveSubmissions(submissions);
    let onlineCount = 0;
    let upSolveCount = 0;
    console.log(onlineParticipant);

    for(var sub of acSubmissions){
        if(contestSolves[sub]) onlineCount++;
        else if(upSolves[sub]) upSolveCount++;
    }
    if (onlineParticipant == 0) return ['A', upSolveCount];
    return [onlineCount, upSolveCount];
}

let getOnlineSubmissionCount = (submissions) => {
    let n = submissions.length;
    for (let i = 0; i < n; ++i){
        if(submissions[i].author.participantType == 'CONTESTANT' || submissions[i].author.participantType == 'OUT_OF_COMPETITION')
            return 1;
    }
    return 0;
}

let getAcSubmissions = (submissions) =>{
    let n=submissions.length;
    let acSubmissions=new Set();
    for (let i=0; i < n; ++i){
        if(submissions[i].verdict == 'OK') acSubmissions.add(submissions[i].problem.index);
    }
    return acSubmissions;
}

let getContestSubmissions = (submissions) => {
    let n = submissions.length;
    let contestSubmissions = {};
    for (let i = 0; i < n; ++i){
        if (submissions[i].author.participantType == 'CONTESTANT' || submissions[i].author.participantType == 'OUT_OF_COMPETITION'){
            if(submissions[i].verdict == 'OK') contestSubmissions[submissions[i].problem.index]=1;
        }
    }
    return contestSubmissions;
}

let getUpSolveSubmissions = (submissions) => {
    let n = submissions.length;
    let upsolveSubmissions = {};
    for (let i = 0; i < n; ++i){
        if (submissions[i].author.participantType == 'PRACTICE' || submissions[i].author.participantType == 'VIRTUAL'){
            if(submissions[i].verdict == 'OK') upsolveSubmissions[submissions[i].problem.index]=1;
        }
    }
    return upsolveSubmissions;
}

module.exports.getContestStatus = getContestStatus;
