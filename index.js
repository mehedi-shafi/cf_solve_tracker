import fs from 'fs';
import express from 'express';
import cors from 'cors';
import http from 'http';
import getContestStatus from './api';
import saveLog from './logger';
import render from './renderer';
import { createloglist } from './renderer';

let app = express();
let httpServer = http.Server(app);

let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

app.use(cors());

let port = process.env.PORT || config.server.port;


httpServer.listen(port, () => {
    console.log(`Listening on : ${config.server.port}`);
});

app.get('/:handle/:contestid', (req, res) => {
    let url = urlBuidler(req.params.handle, req.params.contestid);
    getContestStatus(url, (response) => {
        res.write(response);
        res.end();
        response = JSON.parse(response);
        let info = {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            handler: req.params.handle,
            contestid: req.params.contestid,
            contestsolve: response[0],
            upsolve: response[1]
        };
        saveLog(info);
    });
});

app.get('/logs', (req, res) => {
    let loglist = createloglist();
    res.write(render('./views/logs.html', {title: {'title': 'Logs'}, data: {'LOG_LIST': loglist}}));
    res.end();
});

app.get('/logs/view/:logfile', (req, res) => {
    console.log('Showing log for: ' + req.params.logfile);
    let logcontent = JSON.parse(fs.readFileSync('./LOGS/'+req.params.logfile+'.json' , 'utf-8'));
    res.write(render('./views/logview.html', {title: {'title': req.params.logfile}, data: {'JSON': JSON.stringify(logcontent, null, 4)}}));
    res.end();
});

let urlBuidler = (handle, contestId) => {
    let url = config.urls['contest_status'];
    url = url.replace('{{ contestId }}', contestId);
    url = url.replace('{{ handle }}', handle);
    return url;
}
