const http = require('http');
const os = require('os');

exports.getById = async (path) => {
    return new Promise((resolve, reject) => {
        http.get({
            hostname: `${os.hostname()}`,
            port: 3001,
            path: path,
        }, (response) => {
            response.setEncoding('utf8');
            let body = '';

            response.on('data', chunck => body += chunck);
            response.on('end', () => resolve(JSON.parse(body)));
        }).on('error', reject);
    });
}