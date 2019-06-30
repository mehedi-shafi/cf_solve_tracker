import fs from 'fs';
import express from 'express';
import cors from 'cors';
import http from 'http';
import getContestStatus from './api';
import saveLog from './logger';

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

let urlBuidler = (handle, contestId) => {
    let url = config.urls['contest_status'];
    url = url.replace('{{ contestId }}', contestId);
    url = url.replace('{{ handle }}', handle);
    return url;
}
