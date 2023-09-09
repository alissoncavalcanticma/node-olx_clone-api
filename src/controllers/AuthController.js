const { validationResult, matchedData } = require('express-validator');

module.exports = {
    signin: async(req, res) => {
        return true;
    },
    signup: async(req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ error: errors.mapped() });
            return;
        }

        const data = matchedData(req);
        res.json({ ok: true, data });
    }
};