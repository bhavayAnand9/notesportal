// const notes = [];

// module.exports = class Notes {
//     constructor(title, id){
//         this.title = title;
//     }

//     save(){
//         this.id = Math.random().toString();
//         notes.push(this);
//     }

//     static fetchAll(){
//         return notes;
//     }

//     static getById(id, cb){
//         let found = false;
//         notes.forEach(note => {
//             if(note.id === id){
//                 cb(null, note);
//                 found = true;
//             }
//         });
//         if(!found){
//             let err = 'Notes Not found';
//             cb(err, null);
//         }
//     }
// }

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
    }
})

module.exports = mongoose.model('Notes', notesSchema);