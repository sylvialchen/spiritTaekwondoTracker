// Dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const sessionsRouter = express.Router();
const User = require('../models/user.js');
const RidgewoodClasses = require('../models/ridgewoodClasses.js');

module.exports = sessionsRouter;

sessionsRouter.use(express.static("Public"));

///////////////////////////
////////// INDEX //////////
///////////////////////////
// Dashboard

userSelectedClasses = [];
sessionsRouter.get('/signedin', (req, res) => {
    userSelectedClasses.splice(0, userSelectedClasses.length);
    RidgewoodClasses.find({ dateScheduled: { $gte: new Date() } }, (error, allClasses) => {
        req.session.currentUser.userClassArray.forEach((userClass) => {
            allClasses.forEach((allClass) => {  
                if (userClass == allClass._id) {
                    // console.log('found matching' + allClass._id)
                    userSelectedClasses.push(allClasses.splice(allClass,1))
                }
            })}),
            // console.log(userSelectedClasses),
            // console.log(allClasses)
        res.render('./sessions/dashboard.ejs', {
            currentUser: req.session.currentUser,
            classes: allClasses,
            uniqueSelectedClasses: userSelectedClasses
        })
}).sort({ dateScheduled: 1 })
})

// Previous Classes
sessionsRouter.get('/previousClasses', (req, res) => {
    RidgewoodClasses.find({ dateScheduled: { $lt: new Date() } }, (error, allClasses) => {
        res.render('./sessions/previousClasses.ejs', {
            currentUser: req.session.currentUser,
            classes: allClasses,
        })
    }).sort({ dateScheduled: -1 })
})
/////////////////////////
////////// NEW //////////
/////////////////////////

// Login Page
sessionsRouter.get('/new', (req, res) => {
    res.render('sessions/new.ejs', {
        currentUser: req.session.currentUser
    });
});

// Add New Class Page
sessionsRouter.get('/newclass', (req, res) => {
    res.render('sessions/newClass.ejs', {
        currentUser: req.session.currentUser
    });
});

////////////////////////////
////////// DELETE //////////
////////////////////////////

// Logout Route
sessionsRouter.delete('/', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/');
    });
});

// Delete Class
sessionsRouter.delete("/:id", (req, res) => {
    RidgewoodClasses.findByIdAndDelete(req.params.id, (err, data) => {
        res.redirect('signedin')
    })
});

////////////////////////////
////////// UPDATE //////////
////////////////////////////
// Update user's class array by adding selected class
sessionsRouter.put('/addToUser/:id', (req, res) => {
    console.log(req.session.currentUser._id)
    User.findByIdAndUpdate(
        req.session.currentUser._id,
        req.params.id,
        {
            new: true,
        },
        (error, updatedUser) => {
            updatedUser.userClassArray.push(req.params.id)
            updatedUser.save();
            res.redirect('../signedin')
        }
    )
});

// Update class info
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
});


////////////////////////////
////////// CREATE //////////
////////////////////////////
// Login Route
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

// Add New Class
sessionsRouter.post('/addnewclass', (req, res) => {
    RidgewoodClasses.create(req.body, (error, newClass) => {
        // console.log(req.body)
        res.redirect('signedin');
    });
});

//////////////////////////
////////// EDIT //////////
//////////////////////////
sessionsRouter.get("/:id/edit", (req, res) => {
    RidgewoodClasses.findById(req.params.id, (err, foundClass) => {
        res.render('sessions/editClass.ejs', {
            currentUser: req.session.currentUser,
            foundClass: foundClass,
        })
    })
});

//////////////////////////
////////// SHOW //////////
//////////////////////////
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