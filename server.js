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


// GET /students
app.get('/students', (req, res) => {
    const { course } = req.query;
    if (course) {
        console.log(course)
        collegeData.getStudentsByCourse(course)
            .then(students => {
                if (students.length === 0) {
                    res.render("students", {message: "no results"});
                } else {
                    res.render("students", {students: data});
                }
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({ message: 'Internal server error' });
            });
    } else {
        collegeData.getAllStudents()
            .then(students => {
                if (students.length === 0) {
                    res.render("students", {message: "no results"});
                } else {
                    res.render("students", {students: data});
                }
            })
            .catch(error => {
                res.status(500).json({ message: 'Internal server error' });
            });
    }
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

// GET /courses
app.get('/courses', function (req, res) {
    collegeData.getAllCourses().then(data => {
        res.render('courses', {courses: data});
    }).catch(err => {
        res.render('courses', {message: 'no results'});
    });
});


// GET /student/num
app.get("/student/:studentNum", function(req, res) {
    collegeData.getStudentByNum(req.params.studentNum)
        .then((data) => {
            res.render("student", { student: data });
        })
        .catch((err) => {
            res.render("student", { message: err });
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


app.get("/Students/add", function (req, res) {
    res.render("/Students/add");
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
