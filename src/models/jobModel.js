const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    skills:{
        type: [String],
        required: true,
        trim: true
    },
    experience:{
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true,
        trim: true
    },
    applicants:{
        type: [Object],
        default: []
    }

} , {timestamps: true});


module.exports = mongoose.model('Job', jobSchema);