// Dependencies
require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const session = require('express-session');
const methodOverride = require('method-override');


// Port
const PORT = process.env.PORT || 3000;

// Database Configuration
mongoose.connect(process.env.MONGODB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// Database Connection Error / Success
const db = mongoose.connection;
db.on('error', (err) => console.log(err.message + ' is mongod not running?'));
db.on('connected', () => console.log('mongo connected'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
// Body parser middleware: give us access to req.body
app.use(express.urlencoded({ extended: true }));
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: false, 
		unset: "destroy"
    }));
app.use(methodOverride('_method'));

// Routes / Controllers
app.use(express.static("Public"));
const userController = require('./controllers/users');
app.use('/users', userController);
const sessionsController = require('./controllers/sessions');
app.use('/sessions', sessionsController);
app.get('/', (req, res) => {
	if (req.session.currentUser) {
		res.render('sessions/dashboard.ejs', {
			currentUser: req.session.currentUser,
		});
	} else {
		res.render('index.ejs', {
			currentUser: req.session.currentUser
		});
	}
});





// Listener
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));