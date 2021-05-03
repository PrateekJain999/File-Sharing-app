const router = require('express').Router()
const multer = require('multer');
const path = require('path');
const fileService = require('../service/fileService')
const { v4: uuid4 } = require('uuid')

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
})

let upload = multer({
    storage,
    limit: {
        fileSize: 1000000 * 100
    }
}).single('myfile')

router.post('/', (req, res) => {
    //validate request
    //store file
    upload(req, res, async (err) => {
        if (!req.file) {
            return res.json({ error: 'files error' });
        }

        if (err) {
            return res.status(500).send({ error: err.message });
        }

        const file = {
            filename: req.file.filename,
            uuid: uuid4(),
            path: req.file.path,
            size: req.file.size
        };

        const response = await fileService.registerFile(file);

        return res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
    })
});

router.post('/send', async (req, res) => {
    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || !emailFrom) {
        return res.status(422).send({ error: 'All fields required' });
    }

    const file = await fileService.getFile({ uuid: uuid });

    if (file.sender) {
        return res.status(422).send({ error: 'email already sent' });
    }

    file.sender = emailFrom;
    file.receiver = emailTo;
    const response = await fileService.registerFile(file);

    const sendMail = require('../service/emailService');

    sendMail({
        from: emailFrom,
        to: emailTo,
        subject: 'file Sharing',
        text: `${emailFrom} share file with you`,
        html: require('./../service/emailTemplate')({
            emailFrom: emailFrom,
            downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
            size: parseInt(file.size / 1000) + 'KB',
            expires: 24
        }),
    }).then(() => {
        return res.json({ success: true });
    }).catch(err => {
        return res.status(500).json({ error: 'Error in email sending.' });
    });
})

module.exports = router;