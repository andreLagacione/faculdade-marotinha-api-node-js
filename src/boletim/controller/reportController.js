var express = require('express');
var pdf = require('html-pdf');
const fs = require('fs-extra');
const template = require('../build-report/buildReport');


module.exports = {
    async generate(request, response) {

        const stream = await new Promise((resolve, reject) => {
            pdf.create(template.build(), options).toStream((err, stream) => {
                if (err) {
                    reject(reject);
                    return;
                }
                resolve(stream);
            });
        });

        const fileName = `${+new Date()}.pdf`;
        const pdfPath = `./files/${fileName}`;
        stream.pipe(fs.createWriteStream(pdfPath));
        response.json({ msg: 'ok' });
    }
}

const options = {
    format: 'Letter',
    orientation: 'landscape',
    border: {
        top: '10px',
        right: '10px',
        bottom: '10px',
        left: '10px'
    },
}