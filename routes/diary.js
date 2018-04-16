const express = require('express');
const router = express.Router();
const h2p = require('html2plaintext');
const dateTime = require('node-datetime');

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

    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');


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
       
        var story = new Story({
            title: title,
            content: content,
            created: formatted,
            updated: formatted
        });
        story.save((err) => {
            if(err) console.log(err);
            req.flash('success', 'Story Added');
            res.redirect('/diary');
        });
       
    }
   
});


 /*
* GET edit Story page
*/
router.get('/edit/:id', function(req, res){
    Story.findById(req.params.id, (err, story) => {
        if(err) {
            // return console.log(err);
            console.log(err);
        }
        
        if(!story){
            res.redirect('/diary');
        }   
        
        else{
            res.render('diary/edit', {
                title: story.title,
                content: story. content,
                id: story._id
            });
        }
    });
 
    
 });


/*
* POST edit story page
*/
router.post('/edit/:id', (req, res) => {
    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');
    

    req.checkBody('content', 'Content mush have a value').notEmpty();

    var title = req.body.title;
    var id = req.params.id; 
    var content = req.body.content; 
    var errors = req.validationErrors();
    if(errors){
         console.log(errors);
        req.flash('danger', errors[0].msg);
        res.render('diary/edit', {
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
        Story.findById(id, (err, story) => {
            if(err) return console.log(err);
            story.title = title;
            story.content = content;
            story.updated = formatted;
            story.save((err) => {
                if(err) console.log(err);
                req.flash('success', 'Story Edited');
                res.redirect('/diary/');
            });
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
                content: story.content,
                id: story._id
            });
        }

    });
});


/*
* GET delete story
*/
router.get('/delete/:id', function(req, res){
    Story.findByIdAndRemove(req.params.id, (err) => {
        if(err) return console.log(err);
        req.flash('success', 'Story Deleted');
        res.redirect('/diary/');
    })
    
});
// Exports 
module.exports = router;