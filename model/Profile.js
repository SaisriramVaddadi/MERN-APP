const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        type: [String],
        required: true
    },bio: {
        type: String
    },
    githubUserName: {
        type: String
    },
    experience: [
        {
            title:{
                type: String,
                required: true
            },
            company: {
                type:String,
                required: true
            },
            location: {
                tpe: String,
            },
            from: {
                type: String
            },
            to: {
                type: String
            }


        },

    ]


})