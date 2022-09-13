// Dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const sessionsRouter = express.Router();
const User = require('../models/user.js');
const RidgewoodClasses = require('../models/ridgewoodClasses.js');

module.exports = sessionsRouter;

sessionsRouter.use(express.static("Public"));

// Index
sessionsRouter.get('/signedin', (req,res) => {
    RidgewoodClasses.find({dateScheduled:{$gte: new Date()}}, (error, allClasses) => {
        res.render('./sessions/dashboard.ejs', {
            currentUser: req.session.currentUser,
            classes: allClasses,
        })
    }).sort({dateScheduled: 1})
})

sessionsRouter.get('/previousClasses', (req,res) => {
    RidgewoodClasses.find({dateScheduled:{$lt: new Date()}}, (error, allClasses) => {
        res.render('./sessions/previousClasses.ejs', {
            currentUser: req.session.currentUser,
            classes: allClasses,
        })
    }).sort({dateScheduled: -1})
})

// New (login page)
sessionsRouter.get('/new', (req, res) => {
	res.render('sessions/new.ejs', {
		currentUser: req.session.currentUser
	});
});

// New
sessionsRouter.get('/newclass', (req, res) => {
    res.render('sessions/newClass.ejs', {
        currentUser: req.session.currentUser
    });
});


// Delete (logout route)
sessionsRouter.delete('/', (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/');
  });
});

// Delete
sessionsRouter.delete("/:id", (req, res) => {
    RidgewoodClasses.findByIdAndDelete(req.params.id, (err, data) => {
      res.redirect('signedin')
    })
  });


// Update
sessionsRouter.put("/:id", (req, res) => {  
    console.log(req.body)
    RidgewoodClasses.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
      (error, updatedClass) => {
        res.redirect('../signedin')
      }
    )
  })


// Create (login route)
sessionsRouter.post('/', (req, res) => {
    // Check for an existing user
    User.findOne({
        email: req.body.email
    }, (error, foundUser) => {
        // send error message if no user is found
        if (!foundUser) {
            res.send(`Oops! No user with that email address has been registered.`);
        } else {
            // If a user has been found 
            // compare the given password with the hashed password we have stored
            const passwordMatches = bcrypt.compareSync(req.body.password, foundUser.password);

            // if the passwords match
            if (passwordMatches) {
                // add the user to our session
                req.session.currentUser = foundUser;
                // redirect to dashboard
                res.redirect('sessions/signedin');
            } else {
                // if the passwords don't match
                res.send('Oops! Invalid credentials.');
            }
        }
    });
});

sessionsRouter.post('/addnewclass', (req, res) => {
    RidgewoodClasses.create(req.body, (error, newClass) => {
        console.log(req.body)
        res.redirect('signedin');
    });
});

// Edit
sessionsRouter.get("/:id/edit", (req, res) => {
    RidgewoodClasses.findById(req.params.id, (err, foundClass) => {
      res.render('sessions/editClass.ejs', {
        currentUser: req.session.currentUser,
        foundClass: foundClass,
      })
    })
  });

// Show
sessionsRouter.get("/:id", (req, res) => {
	RidgewoodClasses.findById(req.params.id, (err, foundClass) => {
		res.render("sessions/aboutClass.ejs", {
            currentUser: req.session.currentUser,
            foundClass: foundClass,
        })
	});
});

// Export Sessions Router
module.exports = sessionsRouter;