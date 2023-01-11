const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({


    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverletter:{
        type: String,
        default:""
    }
}, {timestamps: true});


module.exports = mongoose.model('Application', applicationSchema);