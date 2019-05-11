const Notes = require('../model/Notes');
const User = require('../model/Users');


//maybe later use select and populate functions of mongoose
exports.getAllNotes = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.status(404).json({
            Error: 'Please login first on /user/login',
            operation: 'Unsuccessful'
        })
    }
    
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
    if(!req.session.isLoggedIn){
        return res.status(404).json({
            Error: 'Please login first on /user/login',
            operation: 'Unsuccessful'
        })
    }

    const {title, description, uploadedBy} = req.body
    const dateUploaded = new Date();

    const note = new Notes({
        title: title,
        description: description,
        uploadedBy: req.session.user._id,
        dateUploaded: dateUploaded
    });

    note
        .save()
        .then(result => {
            User.findById(result.uploadedBy)
                .then(user => {
                    console.log(user);
                    user.notesUploaded.notes.push(result._id);
                    user.save();
                })
                .catch(err => console.error(err));
            
            res.status(200).json({
                Req_Info: 'POST req --  /notes/submit-notes -- ',
                dataUploaded: result,
                operation: 'successful'
            });   
        })
        .catch(err => {
            res.status(500).json({
                Error: err,
                operation: 'unsuccessful'
            })
        });
}

exports.getNote = (req, res, next) => {
    if(!req.session.isLoggedIn){
        return res.status(404).json({
            Error: 'Please login first on /user/login',
            operation: 'Unsuccessful'
        })
    }

    const note_id = req.params.noteId;
    Notes.findById(note_id)
        .then(note => {
            res.status(200).json({
                note
            })
        })
        .catch(err => {
            res.status(500).json({
                Error: 'no notes found',
                operation: 'unsuccessful'
            })
        })
}