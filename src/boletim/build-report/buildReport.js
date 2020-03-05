module.exports = {
    build(Report) {
        return `
        <!doctype html>
            <html>
                <head>
                    <style>
                        ${styles}
                    </style>
                </head>
                <body>
                    <h1 class="titulo">Boletim Escolar: 2020</h1>
                </body>
            </html>
        `;
    }
}

const styles = `
body {
    padding: 0;
    border: 1px solid black;
}

.titulo {
    display: block;
    text-align:center;
    font-size: 20px;
    padding: 10px 0;
    border-bottom: 1px solid black;
    margin: 0;
}
`