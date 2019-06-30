import fs from 'fs';

let saveLog = (info) => {
    let ret = getLogFile();
    let filepath = ret[0];
    let log = ret[1];
    log.push(createLogEntry(info));
    fs.writeFileSync(filepath, JSON.stringify(log));
}

let createLogEntry = (info) => {
    return {
        ip: info.ip,
        timestamp: Date.now(),
        handler: info.handler,
        contestid: info.contestid,
        contestsolve: info.contestsolve,
        upsolve: info.upsolve
    };
}

let getLogFile = (logdir='./LOGS/') => {
    let filePath = logdir + getLogFileName();
    if (fs.existsSync(filePath)){
        return [filePath, JSON.parse(fs.readFileSync(filePath))];
    }
    else{
        return [filePath, JSON.parse('[]')];
    }
}

let getLogFileName = () => {
    let d = new Date();
    let returnDate = String(d.getFullYear());
    returnDate += (d.getMonth() < 10 ? '0'+String(d.getMonth()) : String(d.getMonth()));
    returnDate += (d.getDate() < 10 ? '0' + String(d.getDate()) : String(d.getDate()));
    return returnDate + '.json';
}

export default saveLog;