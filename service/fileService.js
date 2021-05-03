const fileModel = require('../models/fileModel')
let fileService = {};

fileService.registerFile = async (file) => {
  return await fileModel(file).save();
};

fileService.getFile = async (criteria) => {
  let data = await fileModel.findOne(criteria)
  return data
};

module.exports = fileService;