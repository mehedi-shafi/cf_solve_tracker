import fs from 'fs';
import path from 'path';

let render = (templatepath, data) => {
    let response = parse(fs.readFileSync('./views/header.html', 'utf-8'), data.title);
    response += parse(fs.readFileSync(templatepath, 'utf-8'), data.data);
    response += fs.readFileSync('./views/footer.html', 'utf-8');
    return response;
}

let parse = (template, data) => {
    for (let key in data){
        template = template.replace(`{{ ${key} }}`, data[key]);
    }
    return template;
}

let createLogList = () => {
    let template = fs.readFileSync('./views/log-row.html', 'utf-8');
    let filelist = fs.readdirSync('./LOGS/');
    let loglist = '';
    filelist.forEach(element => {
        loglist += parse(template, {'logname': path.basename(element).split('.')[0], 'download': '/logs/view/'+path.basename(element).split('.')[0]});
    });
    return loglist;
}

export default render;
export const createloglist = createLogList;