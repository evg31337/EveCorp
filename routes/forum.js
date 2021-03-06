var async = require('async');
var User = require('../models/user');
var Corporation = require('../models/corporation');
var Announcement = require('../models/announcement');
var Doctrine = require('../models/doctrine');
var Ping = require('../models/ping');
var Wiki = require('../models/wiki');
var Timer = require('../models/timer');
var Forum = require('../models/forum');
mongoose = require('mongoose');

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/');
}

module.exports = function(app, passport) {

    // =============================================================================
    // ROOT ========================================================================
    // =============================================================================


                app.get('/forum/:id',isLoggedIn, function(req, res) {
   Corporation.findOne({CorporationID:req.user.CharacterCorporationID}, function(err, corp) {

    async.forEachOf(corp.Forum, function(value, key, callback) {
                   if (value._id == req.params.id)
                   {
                       res.render('forumpost.ejs', {
                user: req.user,
                post:value,
                corp: corp
            });
                   }
                      callback();  
                    
                }, function(err) {
                    if (err) console.error(err.message);
                })
        })
    });


                app.post('/newforumpost/:id',isLoggedIn, function(req, res) {
                  if (req.user.CharacterRoleLevel < 4) {res.send('Permission Denied');}
   Corporation.findOne({CorporationID:req.user.CharacterCorporationID}, function(err, corp) {
// Corporation.update({CorporationID:req.user.CharacterCorporationID},{$push:{CorporationName: 'lol'}});
      for (var i = corp.Forum.length - 1; i >= 0; i--) {
                             if (corp.Forum[i]._id == req.params.id) {
//Works but not really adding document
//
var comment={_id:mongoose.Types.ObjectId(),Title:req.param('title'),Body:req.param('body'),Author:req.param('author'),Best:false,Time:Date()};
corp.Forum[i].Answers.push(comment);
corp.markModified('Forum');
//
//Doesnt work adding document
//
// var postItem = new Comment();
//             postItem.Title = req.param('title');
//             postItem.Body = req.param('body');
//             postItem.Author = req.param('author');
// corp.Forum[i].Answers.push(postItem);
//
console.log(corp.Forum[i].Answers);
 corp.save();
}                              
 }

res.redirect('/forum/'+ req.params.id);               
        });
    });
















                                app.get('/forum',isLoggedIn, function(req, res) {
   Corporation.findOne({CorporationID:req.user.CharacterCorporationID}, function(err, corp) {
            res.render('forum.ejs', {
                user: req.user,
                corp: corp
            });
        })
    });

              


                app.get('/deleteforum/:id',isLoggedIn, function(req, res) {
                  if (req.user.CharacterRoleLevel < 4) {res.send('Permission Denied');}
   Corporation.findOne({CorporationID:req.user.CharacterCorporationID}, function(err, corp) {
for (var i = corp.Forum.length - 1; i >= 0; i--) {
  if (corp.Forum[i]._id == req.params.id)
  {
corp.Forum.splice(i, 1);
corp.save();
}
}
            res.redirect('/forum');
        })
    });
// /deletepostanswer/<%= post._id%>/<%= post.Answers[i]._id %>
                app.get('/deletepostanswer/:forumid/:postid',isLoggedIn, function(req, res) {
                  if (req.user.CharacterRoleLevel < 4) {res.send('Permission Denied');}
   Corporation.findOne({CorporationID:req.user.CharacterCorporationID}, function(err, corp) {





for (var i = corp.Forum.length - 1; i >= 0; i--) {

  if (corp.Forum[i]._id == req.params.forumid)
  {




    for (var x = corp.Forum[i].Answers.length - 1; x >= 0; x--) {
       if (corp.Forum[i].Answers[x]._id == req.params.postid)
   {
    console.log(corp.Forum[i].Answers[x]);
corp.Forum[i].Answers.splice(x, 1);
corp.markModified('Forum');
corp.save();
 }

}

}



}




 



            res.redirect('/forum/'+req.params.forumid);
        })
    });
      






  app.post('/newforum', isLoggedIn, function(req, res) {
    if (req.user.CharacterRoleLevel >= 4) {
var forumItem = new Forum();
          forumItem.Title = req.param('title');
          forumItem.Body = req.param('body');
          forumItem.Author = req.param('author');
  Corporation.findOne({CorporationID:req.user.CharacterCorporationID},{'Forum':1}, function(err, corp) {
corp.Forum.push(forumItem);
corp.save();
res.redirect('/forum');
       });
    } else {
      res.redirect('/');
    }
  });
    
}