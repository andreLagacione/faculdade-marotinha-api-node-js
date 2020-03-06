module.exports = {
    build(boletimData) {
        return `
        <!doctype html>
            <html>
                <head>
                    <style>
                        ${styles}
                    </style>
                </head>
                <body>
                    <h1 class="details">Boletim Escolar: ${boletimData.ano}</h1>

                    <div class="details">
                        <div class="item font-small"><b>Professor(a):</b> ${boletimData.professor}</div>
                        <div class="item font-small"><b>Aluno(a):</b> ${boletimData.aluno}</div>
                    </div>

                    <div class="details font-small">
                        <b>Turma:</b> ${boletimData.turma}
                    </div>

                    <div class="list-materies">
                        <div class="row-matery">
                            <div class="name">Matéria</div>
                            <div class="value">1° Bimestre</div>
                            <div class="value">2° Bimestre</div>
                            <div class="value">3° Bimestre</div>
                            <div class="value">4° Bimestre</div>
                            <div class="value">Média Final</div>
                        </div>

                        ${buildRowMatery(boletimData.notas)}
                    </div>
                </body>
            </html>
        `;
    }
};

const styles = `
* {
    box-sizing: border-box;
}

body {
    padding: 0;
    border: 1px solid black;
}

.details {
    display: block;
    text-align:center;
    font-size: 20px;
    padding: 10px;
    border-bottom: 1px solid black;
    margin: 0;
    overflow: hidden;
}

.details .item {
    width: 50%;
    float: left;
}

.font-small {
    font-size: 16px;
    text-align: left;
}

.list-materies {
    padding: 10px;
}

.row-matery {
    overflow: hidden;
    border: 1px solid black;
    border-bottom: 0;
    border-left: 0;
}

.row-matery:last-child {
    border-bottom: 1px solid black;
}

.row-matery div {
    padding: 10px;
    border-left: 1px solid black;
    font-size: 15px;
    float: left;
}

.row-matery .name {
    width: 50%;
}

.row-matery .value {
    width: 10%;
}
`;

const buildRowMatery = notas => {
    let row = '';

    notas.map(item => {
        row += `
            <div class="row-matery">
                <div class="name">${item.materia}</div>
                <div class="value">${item.notaBimestre1}</div>
                <div class="value">${item.notaBimestre2}</div>
                <div class="value">${item.notaBimestre3}</div>
                <div class="value">${item.notaBimestre4}</div>
                <div class="value">${item.mediaFinal}</div>
            </div>
        `
    });

    return row;
};