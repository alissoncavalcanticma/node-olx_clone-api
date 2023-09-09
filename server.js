require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileupload = require('express-fileupload');

const apiRoutes = require('./src/routes');

//mongoose.connect('mongodb://root:mongo123@localhost:27017/olx')

console.log(process.env.DATABASE);


mongoose.connect('mongodb://localhost:27017/olx', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Conectado ao MongoDB');
    })
    .catch((error) => {
        console.error('Erro ao conectar ao MongoDB:', error);
    });

mongoose.set('strictQuery', false)

mongoose.Promise = global.Promise;
mongoose.connection.on('error', (error) => {
    console.log('Erro: ', error.message);
});

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(fileupload());
server.use(express.static(__dirname + '/public'));

server.use('/', apiRoutes);

server.listen(process.env.PORT, () => {
    console.log(` - Rodando no endereço: ${process.env.BASE}`);
})