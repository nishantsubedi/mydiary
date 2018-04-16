const express = require('express');
const router = express.Router();
const h2p = require('html2plaintext');
const dateTime = require('node-datetime');

// Get story model
var Story = require('../models/story');

// get diary index
router.get('/page/:pageno', (req, res) => {
    Story.find({}).sort({updated: -1}).exec((err, stories) => {
        var pageno = req.params.pageno;
        
        var storyList= [];
        var counterPage = 0;
        var counterStory = 0;
        var pageLimit = 5;
        var page = 0;
        var pageLength = stories.length;
    //    console.log(stories[1]);
        storyList[page] = [];
            while(counterStory < pageLength ){
                if(counterPage > pageLimit - 1){
                    counterPage = 0;
                    page++;
                    storyList[page] = [];
                }
                storyList[page][counterPage] = stories[counterStory];
                counterStory++;
                counterPage++;
               
            }
            // console.log(storyList[0]);
        
        // // console.log(stories);
        // console.log(storyList[pageno-1]);
        res.render('diary/diary', {
            title: 'Stories',
            stories: storyList[pageno - 1],
            pageno: pageno,
            noOfPages: page + 1
        }); 
    });
   
});

// GET write diaries page
router.get('/write', (req, res) => {
    var pageno = req.query.pageno;
    if(!pageno) pageno = 1;
    res.render('diary/write', {
        title: 'Write a Story',
        form: {
            title: '',
            content: ''
            
        },
        pageno: pageno
    });
});


// POST story from write diaries page
router.post('/write', (req, res) => {

    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');

    var pageno = req.query.pageno;
    if(!pageno) pageno = 1;

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
            },
            pageno: pageno
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
            res.redirect('/diary/page/'+ 1);
        });
       
    }
   
});


 /*
* GET edit Story page
*/
router.get('/edit/:id', function(req, res){
    var pageno = req.query.pageno;
    if(!pageno) pageno = 1;
    Story.findById(req.params.id, (err, story) => {
        if(err) {
            // return console.log(err);
            console.log(err);
        }
        
        if(!story){
            res.redirect('/diary/page/1');
        }   
        
        else{
            res.render('diary/edit', {
                title: story.title,
                content: story. content,
                id: story._id,
                pageno: pageno
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
    
    var pageno = req.query.pageno;
    if(!pageno) pageno = 1;

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
            },
            pageno: pageno
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
                res.redirect('/diary/page/1');
            });
        });
       
        
       
    }
   
});

// GET story page
router.get('/story/:id', (req, res) => {
    var pageno = req.query.pageno;
    if(!pageno) pageno = 1;
    Story.findById(req.params.id, (err, story) => {
        if(err) console.log(err);
        if(!story){
            res.redirect('/diary');
        } else {
                res.render('diary/story', {
                title: story.title,
                content: story.content,
                id: story._id,
                pageno: pageno
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
        res.redirect('/diary/page/1');
    })
    
});
// Exports 
module.exports = router;