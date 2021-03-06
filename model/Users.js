const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    resetToken: {
      type: String
    },
    resetTokenExpiration: {
      type: Date
    },
    joiningDate: {
      type: Date
    },
    college: {
      type: String
    },
    about: {
      type: String
    },
    notesUploaded: {
      notes: [
        {
          noteid: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Notes'
          }  
        }
      ]
    }
})

module.exports = mongoose.model('Users', userSchema);