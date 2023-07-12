/*********************************************************************************
* WEB700 – Assignment 04
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Marinela Coclli Student ID: 139916225 Date: 7/7/2023
*
* Online (Cyclic) Link: ________________________________________________________
*
********************************************************************************/ 
const express = require('express');
const path = require('path');
const collegeData = require('./modules/collegeData'); 
const { addStudent } = require('./modules/collegeData');
var HTTP_PORT = process.env.PORT || 8080;
var app = express();
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.get('/students', (req, res) => {
    const { course } = req.query;

    if (course) {
      collegeData
        .getStudentsByCourse(course)
        .then(students => res.json(students))
        .catch(() => res.json({ message: 'no results' }));
    } else {
      collegeData
        .getAllStudents()
        .then(students => res.json(students))
        .catch(() => res.json({ message: 'no results' }));
    }
  });

  app.get('/tas', (req, res) => {
    collegeData
      .getTAs()
      .then(tas => res.json(tas))
      .catch(() => res.json({ message: 'no results' }));
  });

  app.get('/courses', (req, res) => {
    collegeData
      .getCourses()
      .then(courses => res.json(courses))
      .catch(() => res.json({ message: 'no results' }));
  });

  app.get('/student/:num', (req, res) => {
    const num = parseInt(req.params.num);
    
    collegeData
      .getStudentByNum(num)
      .then(student => res.json(student))
      .catch(() => res.json({ message: 'no results' }));
  });
  
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
  });
  
  app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'about.html'));
  });
  
  app.get('/htmlDemo', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'htmlDemo.html'));
  });
  // GET route for "/students/add"
app.get('/students/add', (req, res) => {

  res.sendFile( path.join(__dirname,'views' , 'addstudent.html'));
});
  // POST route for "/students/add"
app.post('/students/add', (req, res) => {
  const studentData = req.body;
  addStudent(studentData)
  
    .then(() => {
      res.redirect('/students');
    })
    .catch((error) => {
      console.error('Error adding student:', error);
      // Handle the error appropriately
      res.redirect('/students/add');
    });
});

  app.use((req, res) => {
    res.status(404).send('Page Not Found');
  });
  
  
  collegeData.initialize()
  .then(function () {
    app.listen(8080, function () {
      console.log('Server is running on port 8080');
    });
  })
  .catch(function (err) {
    console.error('Error initializing collegeData:', err);
  });
  