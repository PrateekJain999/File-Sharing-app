require('dotenv').config();
const mong = require('mongoose');
var app = require('express')();
const path = require('path');

mong.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true
});
app.use(require('express').static('public'));
app.use(require('express').json());

app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs')


app.use('/api/files', require('./route/files'));
app.use('/files', require('./route/show'));
app.use('/files/download', require('./route/download'));

let startNodeserver = async () => {
    // express startup.
    server = await require('./route/files');

    return new Promise((resolve, reject) => {
        app.listen(4000, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
};


startNodeserver()
    .then(() => {
        console.log('Node server running on 4000');
    }).catch((err) => {
        console.log('Error in starting server', err);
        process.exit(1);
    });