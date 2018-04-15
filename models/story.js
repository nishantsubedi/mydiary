var mongoose = require('mongoose');

// Story Schema
var StorySchema = mongoose.Schema({

    title:  {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created: {
        type: String,
        required: true
    },
    updated: {
        type: String,
        required: true
    }
});

var Story = module.exports = mongoose.model('Story', StorySchema);
