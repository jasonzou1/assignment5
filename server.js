/*********************************************************************************
 * WEB700 – Assignment 03
 * I declare that this assignment is my own work in accordance with Seneca Academic Policy.
 * No part of this assignment has been copied manually or electronically from any other source
 * (including web sites) or distributed to other students.
 *
 * Name: Jiasheng Zou Student ID: 141462226 Date: 6/17/2023
 *
 ********************************************************************************/

var HTTP_PORT = process.env.PORT || 8080;
var express = require("express");
var app = express();
var path = require("path");
const collegeData = require('./modules/collegeData'); // assuming you have a collegeData module
const { log } = require("console");
const express = require('express');
const app = express();
const exphbs = require('express-handlebars');


app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.get('/students', (req, res) => {
    // Assume data comes from some database operation
    if (data.length > 0) {
        res.render("students", {students: data});
    } else {
        res.render("students", {message: "no results"});
    }
    // Handle rejected promises as needed
});

app.get('/courses', (req, res) => {
    // Assume data comes from some database operation
    if (data.length > 0) {
        res.render("courses", {courses: data});
    } else {
        res.render("courses", {message: "no results"});
    }
    // Handle rejected promises as needed
});


// GET /tas
app.get('/tas', (req, res) => {
    collegeData.getTAs()
        .then(tas => {
            if (tas.length === 0) {
                res.json({ message: 'no results' });
            } else {
                res.json(tas);
            }
        })
        .catch(error => {
            res.status(500).json({ message: 'Internal server error' });
        });
});




// GET /student/num
app.get("/student/:studentNum", (req, res) => {
    let viewData = {};

    data.getStudentByNum(req.params.studentNum)
        .then((data) => {
            viewData.student = data ? data : null;
        })
        .catch(() => {
            viewData.student = null;
        })
        .then(data.getCourses)
        .then((data) => {
            viewData.courses = data;
            for (let i = 0; i < viewData.courses.length; i++) {
                if (viewData.courses[i].courseId == viewData.student.course) {
                    viewData.courses[i].selected = true;
                }
            }
        })
        .catch(() => {
            viewData.courses = [];
        })
        .then(() => {
            if (viewData.student == null) {
                res.status(404).send("Student Not Found");
            } else {
                res.render("student", {viewData: viewData});
            }
        });
});



// GET /
app.get("/", function (req, res) {
    res.render("home");
});


// GET /about
app.get("/about", function (req, res) {
    res.render("about");
});

// GET /htmlDemo
app.get("/htmlDemo", function (req, res) {
    res.render("htmlDemo");
});


app.get("/students/add", (req, res) => {
    collegeData.getCourses()
        .then((data) => {
            res.render("addStudent", {courses: data});
        })
        .catch(() => {
            res.render("addStudent", {courses: []});
        });
});

// setup http server to listen on HTTP_PORT
collegeData.initialize()
    .then(() => {
        // Start the server
        app.listen(8000, () => {
            console.log('Server is running on port 8000');
        });
    })
    .catch((err) => {
        console.error('Error initializing data:', err);
    });

// Rest of the route handlers
// ...

// [ no matching route ]
app.use((req, res) => {
    res.status(404).send('Page Not Found');
});

app.post("/students/add", function(req, res){
    collegeData.addStudent(req.body).then(() => {
        res.redirect("/students");
    });
});

const app = require('express')();

// Setting up express-handlebars
app.engine('.hbs', exphbs({ 
    defaultLayout: 'main',
    extname: '.hbs',
    helpers: {
        navLink: function(url, options){
            return '<li' + 
                ((url == app.locals.activeRoute) ? ' class="nav-item active" ' : ' class="nav-item" ') + 
                '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>';
        },
        equal: function(lvalue, rvalue, options){
            if (arguments.length < 3)
                throw new Error("Handlebars Helper equal needs 2 parameters");
            if (lvalue != rvalue) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));


app.set('view engine', '.hbs');

app.use(function(req, res, next){
    let route = req.path.substring(1);
    app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, ""));    
    next();
});

app.get('/course/:id', function (req, res) {
    collegeData.getCourseById(req.params.id)
    .then((data) => {
        res.render("course", { course: data });
    })
    .catch((err) => {
        res.render("course", { message: err });
    });
});


app.post("/student/update", (req, res) => {
    collegeData.updateStudent(req.body)
        .then(() => {
            res.redirect("/students");
        })
        .catch((err) => {
            res.render("student", { message: err });
        });
});
