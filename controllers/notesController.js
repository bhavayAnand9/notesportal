const Notes = require('../model/Notes')

//maybe later use select and populate functions of mongoose
exports.getAllNotes = (req, res, next) => {
    // if(!req.isLoggedIn) {
    //     res.status(403).json({
    //         Error: 'Access to that resource is forbidden',
    //         Message: 'Please login first'
    //     })
    //     return ;
    // }    

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
    // if(!req.isLoggedIn) {
    //     res.status(403).json({
    //         Error: 'Access to that resource is forbidden',
    //         Message: 'Please login first'
    //     })
    //     return ;
    // }  

    const {title, description, uploadedBy} = req.body
    const dateUploaded = new Date();

    const note = new Notes({
        title: title,
        description: description,
        uploadedBy: req.user._id,
        dateUploaded: dateUploaded
    });

    note
        .save()
        .then(result => {
            console.log('a note submitted');
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
    // if(!req.isLoggedIn) {
    //     res.status(403).json({
    //         Error: 'Access to that resource is forbidden',
    //         Message: 'Please login first'
    //     })
    //     return ;
    // }  

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