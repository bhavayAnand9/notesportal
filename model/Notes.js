const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const notesSchema = new Schema({
    title: {
        type: String,
        required:true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    },
    dateUploaded: {
        type: Date,
        required: true
    },
    // notesPath: {
    //     type: String
    // }
})

module.exports = mongoose.model('Notes', notesSchema);