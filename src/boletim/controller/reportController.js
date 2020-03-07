const pdf = require('html-pdf');
const fs = require('fs-extra');
const template = require('../build-report/buildReport');
const db = require('../../mongo-config');
const ObjectId = require('mongodb').ObjectID;
const { getById } = require('../../commons/getData');
const notasSchema = require('../../nota/schema');
const notasModel = db.model('notas', notasSchema);

module.exports = {
    async generate(request, response) {

        const boletimId = request.params.id;
        const notas = await notasModel.find({ idBoletim: ObjectId(boletimId) }).lean().exec();
        const boletim = await getById(`/boletim/${boletimId}`);
        const professor = await getById(`/professor/${boletim.idProfessor}`);
        const aluno = await getById(`/aluno/${boletim.idAluno}`);
        const turma = await getById(`/turma/${boletim.idTurma}`);
        const curso = await getById(`/curso/${turma.curso.id}`);

        const boletimData = {
            ano: boletim.ano,
            professor: professor.name,
            aluno: aluno.name,
            turma: `${curso.name} - período da ${turma.periodo}`,
            notas: await buildNotas(notas)
        };

        const boletimTemplate = template.build(boletimData);
        const stream = await new Promise((resolve, reject) => {
            pdf.create(boletimTemplate, options).toStream((err, stream) => {
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

        setTimeout(() => {
            const file = fs.createReadStream(pdfPath);
            const stat = fs.statSync(file.path);
    
            response.setHeader('Content-Length', stat.size);
            response.setHeader('Content-Type', 'application/pdf');
            response.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
            file.pipe(response);

            removeFile(pdfPath);
        }, 300);
    }
}

const buildNotas = async (notasList) => {
    let notasDTO = [];

    await Promise.all(
        notasList.map(async item => {
            const materia = await getById(`/materia/${item.materia}`);

            notasDTO.push({
                materia: materia.name,
                notaBimestre1: item.notaBimestre1,
                notaBimestre2: item.notaBimestre2,
                notaBimestre3: item.notaBimestre3,
                notaBimestre4: item.notaBimestre4,
                mediaFinal: item.mediaFinal,
            });
        })
    );

    return notasDTO;
}

const removeFile = filePath => {
    fs.unlink(filePath, (error) => {
        if (error) {
            throw error;
        }
    })
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