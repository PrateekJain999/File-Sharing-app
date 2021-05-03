const router = require('express').Router()
const multer = require('multer');
const path = require('path');
const fileService = require('../service/fileService')
const {v4: uuid4} = require('uuid')

router.get('/:uuid', async (req, res)=>{
    try{
        const file = await fileService.getFile({uuid: req.params.uuid});

        if(!file){
            return res.render('download', {error: 'link has been expired'});      
        }
        return res.render('download', {
            uuid: file.uuid,
            filename: file.filename,
            filesize : file.size,
            downloadLink: `${process.env.APP_BASE_URL}/files/download/${file.uuid}`
        });
    }
    catch(err){
        return res.render('download', {error: 'something went wrong'});
    }
});

module.exports=router;