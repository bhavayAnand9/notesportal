const Notes = require('../model/Notes');
const User = require('../model/Users');
const node_path = require('path');
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
    if(!document || document.mimetype !== 'application/pdf'){
        fs.unlinkSync(node_path.resolve(__dirname + '/../' + document.path));
        return res.status(404).json({
            Error: 'file is corrupted',
            operation: 'unsuccessful'
        })
    }

    const note = new Notes({
        title: title,
        description: description,
        uploadedBy: req.loggedInUserId,
        dateUploaded: dateUploaded,
    });

    note
        .save()
        .then(result => {
            User.findById(result.uploadedBy)
                .then(user => {
                    user.notesUploaded.notes.push(result._id);
                    user.save();
                })
                .catch(err => res.status(500).json(err));
            
            try{    
                fs.renameSync(node_path.resolve(__dirname + '/../' + document.path), node_path.resolve(__dirname + '/../' + 'uploads/' + result._id + '.pdf'));
            }
            catch(e){
                return res.status(404).json({e});
            }    
            res.status(200).json({
                dataUploaded: result,
                operation: 'successful'
            });   
        })
        .catch(err => {
            fs.unlinkSync(node_path.resolve(__dirname + '/../' + document.path));
            return res.status(500).json({
                Error: err,
                operation: 'unsuccessful'
            })
        });
}

exports.getNote = (req, res, next) => {
    const note_id = req.params.noteId;
    Notes.findById(note_id)
        .then(note => {
            const file = fs.createReadStream(node_path.resolve(__dirname + '/../' + 'uploads/' + note_id + '.pdf'));
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + note.title + '"'
            );
            file.pipe(res);
        })
        .catch(err => {
            res.status(500).json({
                Error: 'no notes found',
                operation: 'unsuccessful'
            })
        })
}