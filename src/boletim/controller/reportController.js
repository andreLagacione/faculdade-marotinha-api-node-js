const pdf = require('html-pdf');
const fs = require('fs-extra');
const template = require('../build-report/buildReport');
const db = require('../../mongo-config');
const ObjectId = require('mongodb').ObjectID;
const { getById } = require('../../commons/getData');

const notasSchema = require('../../nota/schema');
const boletimSchema = require('../../boletim/schema');
const professorSchema = require('../../professor/schema');
const alunoSchema = require('../../aluno/schema');
const turmaSchema = require('../../turma/schema');
const materiaSchema = require('../../materia/schema');
const notasModel = db.model('notas', notasSchema);
const boletimModel = db.model('boletim', boletimSchema);
const professorModel = db.model('professor', professorSchema);
const alunoModel = db.model('aluno', alunoSchema);
const turmaModel = db.model('turma', turmaSchema);
const materiaModel = db.model('materia', materiaSchema);



module.exports = {
    async generate(request, response) {

        const boletimId = request.params.id;
        const boletim = await boletimModel.findById(boletimId);
        const notas = await notasModel.find({ idBoletim: ObjectId(boletimId) }).lean().exec();
        const professor = await professorModel.findById(boletim.professor);
        const aluno = await alunoModel.findById(boletim.aluno);
        const turma = await turmaModel.findById(boletim.turma);

        const boletimData = {
            ano: boletim.ano,
            professor: professor.name,
            aluno: aluno.name,
            turma: `${turma.cursoName} - período da ${turma.periodo}`,
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
            response.setHeader(`Content-Disposition', 'attachment; filename=${fileName}`);
            file.pipe(response);    
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