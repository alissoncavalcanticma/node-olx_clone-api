const { checkSchema } = require('express-validator');


module.exports = {
    editAction: checkSchema({
        token: {
            notEmpty: true
        },
        name: {
            optional: true,
            trim: true,
            notEmpty: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Tamanho mínimo do nome precisa ser 2 carcteres!'
        },
        email: {
            optional: true,
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido!'
        },
        password: {
            optional: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Tamanho mínimo da senha precisa ter 2 caracteres!'
        },
        state: {
            optional: true,
            notEmpty: true,
            errorMessage: 'Estado não preenchido!'
        }
    }),
}