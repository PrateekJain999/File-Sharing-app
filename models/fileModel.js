const MONGOOSE = require('mongoose');
const Schema = MONGOOSE.Schema;

const fileSchema = new Schema({
    filename: { type: String , required: true},
    path: { type: String , required: true},
    size: { type: Number , required: true},
    uuid: { type: String , required: true},
    sender: { type: String , required: false},
    receiver: { type: String , required: false}
}, {timestamps: true});

module.exports=MONGOOSE.model('files', fileSchema);