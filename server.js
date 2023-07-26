/*********************************************************************************
* WEB700 – Assignment 05
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Marinela Coclli Student ID: 139916225 Date: 23/7/2023
*
* Online (Cyclic) Link:https://outstanding-button-dove.cyclic.app/__________________________________
*
********************************************************************************/ 
const express = require('express');
const path = require('path');
const exphbs= require('express-handlebars');
const app = express();

//navlink helper 
const navLink = function (url, options) {
  return (
    '<li' +
    (url === app.locals.activeRoute ? ' class="nav-item active" ' : ' class="nav-item" ') +
    '><a class="nav-link" href="' + url + '">' + options.fn(this) + '</a></li>'
  );
};
//equal helper 

const equalHelper= function (lvalue, rvalue, options) {
  if (arguments.length < 3)
  throw new Error("Handlebars Helper equal needs 2 parameters");
  if (lvalue != rvalue) {
  return options.inverse(this);
  } else {
  return options.fn(this);
  }
 }
 const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
    navLink: navLink, 
    equal: equalHelper,
  },
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
const collegeData = require('./modules/collegeData'); 
const { addStudent } = require('./modules/collegeData');
var HTTP_PORT = process.env.PORT || 8080;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, "")); 
  next();
 });
app.get('/students', (req, res) => {
    const { course } = req.query;

if (course) {
  collegeData
    .getStudentsByCourse(course)
    .then((students) => {
      if (students.length === 0) {
       
        res.render('students', { message: 'no results' });
      } else {
       
        res.render('students', { students });
      }
    })
    .catch(() => {
     
      res.render('students', { message: 'no results' });
    });
} else {
  collegeData
    .getAllStudents()
    .then((students) => {
      if (students.length === 0) {
        
        res.render('students', { message: 'no results' });
      } else {
       
        res.render('students', { students });
      }
    })
    .catch(() => {
      
      res.render('students', { message: 'no results' });
    });
}
});

app.get('/courses', (req, res) => {
  collegeData
    .getCourses()
    .then(courses => res.render('courses',{courses}))
    .catch(() => res.render('courses',{ message: 'no results' }));
}); 


app.get('/course/:courseid', (req, res) => {
  const courseId = parseInt(req.params.courseId); 

  collegeData.getCourseById(courseId)
    .then((course) => {
      
      res.render('course', { course: course });
    })
    .catch((error) => {
      
      res.status(404).send('Course Not Found');
    });
});

  app.get('/student/:studentNum', (req, res) => {
    const studentNum = parseInt(req.params.studentNum);
    
    collegeData
      .getStudentByNum(studentNum)
      .then(student => res.render("student", { student: student }))
      .catch(() => res.render('student',{ message: 'no results' }));
  });
 
  
  app.get('/', (req, res) => {
    res.render('home',{layout: 'main'});
  });
  
  app.get('/about', (req, res) => {
    res.render('about', {layout:'main'})
  });
  app.get('/htmlDemo', (req, res) => {
    res.render('htmlDemo',{layout: 'main'});
  });
  // GET route for "/students/add"
app.get('/students/add', (req, res) => {

  res.render('addstudent',{layout: 'main'});
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
     
      res.redirect('/students/add');
    });
});

  app.use((req, res) => {
    res.status(404).send('Page Not Found');
  });
  //
  app.post("/student/update", (req, res) => {
    const studentData = req.body;
  
    collegeData
      .updateStudent(studentData)
      .then(() => {
        console.log("Student data updated successfully:", studentData);
        res.redirect("/students");
      })
      .catch((error) => {
        console.error("Error updating student data:", error);
        
        res.redirect("/students");
      });
  });
  
  //
  collegeData.initialize()
  .then(function () {
    app.listen(8080, function () {
      console.log('Server is running on port 8080');
    });
  })
  .catch(function (err) {
    console.error('Error initializing collegeData:', err);
  });
