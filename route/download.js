const router = require('express').Router()
const multer = require('multer');
const path = require('path');
const fileService = require('../service/fileService')
const {v4: uuid4} = require('uuid')

router.get('/:uuid', async (req, res)=>{
    const file = await fileService.getFile({uuid: req.params.uuid});

    if(!file){
        return res.render('download', {error: 'link has been expired.'})
    }

    const filePath = `${__dirname}/../${file.path}`

    res.download(filePath);
})

module.exports=router;