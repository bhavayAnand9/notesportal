const Notes = require('../model/Notes');
const User = require('../model/Users');
const path = require('path');
const fs = require('fs');

//maybe later use select and populate functions of mongoose
exports.getAllNotes = (req, res, next) => {
    Notes.find({}, (err, allnotes) => {
        if(err) {
            res.status(404).json({
                Error: 'There are no notes',
                operation: 'unsuccessful'
            });
        } else {
            res.status(200).json({
                allnotes,
                operation: 'successful'
            });
        }
    })
}

exports.submitNotes = (req, res, next) => { 
    const {title, description} = req.body
    const dateUploaded = new Date();
    const document = req.file;
    if(!document){
        fs.unlinkSync(path.resolve(__dirname + '/../' + document.path));
        res.status(404).json({
            Error: 'file is corrupted'

        })
    }

    const docPath = document.path;
    const note = new Notes({
        title: title,
        description: description,
        uploadedBy: req.session.user._id,
        dateUploaded: dateUploaded,
        notesPath: docPath
    });

    note
        .save()
        .then(result => {
            User.findById(result.uploadedBy)
                .then(user => {
                    user.notesUploaded.notes.push(result._id);
                    user.save();
                })
                .catch(err => console.error(err));
            
            res.status(200).json({
                dataUploaded: result,
                operation: 'successful'
            });   
        })
        .catch(err => {
            fs.unlinkSync(path.resolve(__dirname + '/../' + document.path));
            res.status(500).json({
                Error: err,
                operation: 'unsuccessful'
            })
        });
}

exports.getNote = (req, res, next) => {
    const note_id = req.params.noteId;
    Notes.findById(note_id)
        .then(note => {
            // res.status(200).json({
            //     note
            // })
            // res.status(200).sendFile(note.notesPath);
            res.sendFile(path.resolve(__dirname + '/../' + note.notesPath));
            // const invoicePath = 
        })
        .catch(err => {
            res.status(500).json({
                Error: 'no notes found',
                operation: 'unsuccessful'
            })
        })
}