const { checkSchema } = require('express-validator');

module.exports = {
    signup: checkSchema({
        name: {
            trim: true,
            notEmpty: true,
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Tamanho mínimo do nome precisa ser 2 carcteres!'
        },
        email: {
            isEmail: true,
            normalizeEmail: true,
            errorMessage: 'E-mail inválido!'
        },
        password: {
            isLength: {
                options: { min: 2 }
            },
            errorMessage: 'Tamanho mínimo da senha precisa ter 2 caracteres!'
        },
        state: {
            notEmpty: true,
            errorMessage: 'Estado não preenchido!'
        }
    })
}