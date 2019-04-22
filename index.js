let fs = require('fs');
let express = require('express');
let cors = require('cors');
let app = express();
let http = require('http').Server(app);
let apiHandler = require('./api.js');

let config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

app.use(cors());

let port = process.env.PORT || config.server.port;


http.listen(port, () => {
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
