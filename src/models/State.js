const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const modelSchema = new mongoose.Schema({
    name: String
});

const modelname = 'State';

if (mongoose.connection && mongoose.connection.models[modelName]) {
    module.exports = mongoose.connection.models[modelname];
} else {
    module.exports = mongoose.model(modelName, modelSchema);
}