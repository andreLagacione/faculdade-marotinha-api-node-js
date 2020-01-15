const express = require('express');
const app = express();

exports.notFound = (req, res, next) => {
    app.use(
        (req, res, next) => {
            const error = new Error('Not found');
            error.status = 404;
            next(error);
        }
    );
}

exports.serverError = (error, req, res, next) => {
    app.use(
        (error, req, res, next) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        }
    );
}