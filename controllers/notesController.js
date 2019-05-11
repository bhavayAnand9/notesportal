const Notes = require('../model/Notes')

exports.getAllNotes = (req, res, next) => {
    // data = Notes.fetchAll()
    // res.status(200).json({
    //     Req_Info: 'GET req --  /notes/get-notes -- ',
    //     Notes_Data: data
    // })
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
    const note_id = req.params.noteId;
    // Notes.getById(note_id, (err, note)=> {
    //     if(err) {
    //         res.status(404).json({
    //             'Error': err
    //         })
    //     }
    //     else {
    //         res.status(200).json({
    //             note
    //         });
    //     }
    // })
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