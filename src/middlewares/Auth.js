const User = require('../models/User');
const ModelUser = require('../models/User')

module.exports = {
    private: async(req, res, next) => {
        if (!req.body.token && (req.body.token == "")) {
            return res.status(401).json({ valid: false });
        } else {
            let token = req.body.token;

            const user = await User.findOne({
                token
            })

            if (!user) {
                return res.status(401).json({ token: 'invalid' });

            }

            next();
        }

    }
}