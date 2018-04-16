const express = require('express');
const router = express.Router();
const h2p = require('html2plaintext');

// Get story model
var Story = require('../models/story');

// get diary index
router.get('/', (req, res) => {
    Story.find({}).sort({updated: -1}).exec((err, stories) => {
        res.render('diary/diary', {
            title: 'Stories',
            stories: stories  
        }); 
    });
   
});

// GET write diaries page
router.get('/write', (req, res) => {
    res.render('diary/write', {
        title: 'Write a Story',
        form: {
            title: '',
            content: ''
        }
    });
});


// POST story from write diaries page
router.post('/write', (req, res) => {
   
    req.checkBody('content', 'Content mush have a value').notEmpty();

    var title = req.body.title;
    var content = req.body.content;
    var errors = req.validationErrors();
    if(errors){
         console.log(errors);
        req.flash('danger', errors[0].msg);
        res.render('diary/write', {
            title: 'Write a Story',
            form: {
                title: title,
                content: content
            }
        }); 
    } else {
        if(title == ""){
            
            tempTitle = h2p(content).split(' ');
            var lengthTitle = 0;
            tempTitle.forEach(word => {
                if(lengthTitle > 30){
                    return;
                }
                title = title + ' ' + word;
                lengthTitle += word.length;
                
            });
           
        }
        var date = Date.now();
        console.log(date);
        var story = new Story({
            title: title,
            content: content,
            created: date,
            updated: date
        });
        story.save((err) => {
            if(err) console.log(err);
            req.flash('success', 'Story Added');
            res.redirect('/diary');
        });
       
    }
   
});

// GET story page
router.get('/story/:id', (req, res) => {
    Story.findById(req.params.id, (err, story) => {
        if(err) console.log(err);
        if(!story){
            res.redirect('/diary');
        } else {
                res.render('diary/story', {
                title: story.title,
                story: story
            });
        }

    });
});

// Exports 
module.exports = router;