import fs from 'fs';
import express from 'express';
import cors from 'cors';
import http from 'http';
import apiHandler from './api';

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
    apiHandler.getContestStatus(url, (response) => {
        res.write(response);
        res.end();
    });
});

let urlBuidler = (handle, contestId) => {
    let url = config.urls['contest_status'];
    url = url.replace('{{ contestId }}', contestId);
    url = url.replace('{{ handle }}', handle);
    return url;
}
