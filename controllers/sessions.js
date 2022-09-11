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
    RidgewoodClasses.find({}, (error, allClasses) => {
        res.render('dashboard.ejs', {
            currentUser: req.session.currentUser,
            classes: allClasses,
        })
    })
})

// New (login page)
sessionsRouter.get('/new', (req, res) => {
	res.render('sessions/new.ejs', {
		currentUser: req.session.currentUser
	});
});
// Delete (logout route)
sessionsRouter.delete('/', (req, res) => {
  req.session.destroy((error) => {
    res.redirect('/');
  });
});

// Update

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

sessionsRouter.post('/', (req, res) => {
    RidgewoodClasses.create(req.body, (error, newClass) => {
        res.send('dashboard.ejs');
    });
});

// Edit
// Show

// Export Sessions Router
module.exports = sessionsRouter;