/*********************************************************************************
* WEB700 – Assignment 06
* I declare that this assignment is my own work in accordance with Seneca Academic Policy. No part
* of this assignment has been copied manually or electronically from any other source
* (including 3rd party web sites) or distributed to other students.
*
* Name: Marinela Coclli Student ID: 139916225 Date: 8/5/2023
*
* Online (Cyclic) Link:________________________________
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
var HTTP_PORT = process.env.PORT || 8080 ;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.use(function(req,res,next){
  let route = req.path.substring(1);
  app.locals.activeRoute = "/" + (isNaN(route.split('/')[1]) ? route.replace(/\/(?!.*)/, "") : route.replace(/\/(.*)/, "")); 
  next();
 });


 app.get('/students', (req, res) => {
  collegeData.getAllStudents()
    .then((students) => {
      if (students.length > 0) {
        res.render('students', { students: students });
      } else {
        res.render('students', { message: 'No results' });
      }
    })
    .catch((error) => {
      console.error('Error getting all students:', error);
      res.render('students', { message: 'An error occurred while fetching data' });
    });
});


// Route to display all courses
app.get('/courses', (req, res) => {
  collegeData.getCourses()
    .then((courses) => {
      if (courses.length > 0) {
        res.render('courses', { courses: courses });
      } else {
        res.render('courses', { message: 'No results' });
      }
    })
    .catch((error) => {
      console.error('Error getting all courses:', error);
      res.render('courses', { message: 'An error occurred while fetching data' });
    });
});

app.get('/courses/add', (req, res) => {
  res.render('addCourse');
});

app.post('/courses/add', (req, res) => {
  const courseData = {
    courseCode: req.body.courseCode,
    courseDescription: req.body.courseDescription
  };

  collegeData.addCourse(courseData)
    .then(() => {
     
      res.redirect('/courses');
    })
    .catch((error) => {
      console.error('Error adding course:', error);
     
      res.render('addCourse', { errorMessage: 'Unable to add course' });
    });
});

app.get('/course/update/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  collegeData.getCourseById(courseId)
    .then((course) => {
      res.render('updateCourse', { course });
    })
    .catch((error) => {
      console.error('Error getting course:', error);
      // Render an error page or redirect to the courses list with an error message
      res.redirect('/courses');
    });
});

// Route to handle the POST request for updating a course
app.post('/course/update', (req, res) => {
  const courseData = {
    courseId: parseInt(req.body.courseId),
    courseCode: req.body.courseCode,
    courseDescription: req.body.courseDescription
  };

  collegeData.updateCourse(courseData)
    .then(() => {
      // Redirect to /courses after successfully updating the course
      res.redirect('/courses');
    })
    .catch((error) => {
      console.error('Error updating course:', error);
      // Render the updateCourse view with an error message
      res.render('updateCourse', { course: courseData, errorMessage: 'Unable to update course' });
    });
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


app.get('/course/delete/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  collegeData.deleteCourseById(courseId)
    .then(() => {
      res.redirect('/courses');
    })
    .catch((error) => {
      console.error('Error deleting course:', error);
      res.status(500).send('Unable to Remove Course / Course not found');
    });
}); 
app.get("/student/:studentNum", (req, res) => {
  // initialize an empty object to store the values
  let viewData = {};
  data.getStudentByNum(req.params.studentNum).then((data) => {
  if (data) {
  viewData.student = data; //store student data in the "viewData" object as "student"
  } else {
  viewData.student = null; // set student to null if none were returned
  }
  }).catch(() => {
  viewData.student = null; // set student to null if there was an error 
  }).then(data.getCourses)
  .then((data) => {
  viewData.courses = data; 
  for (let i = 0; i < viewData.courses.length; i++) {
  if (viewData.courses[i].courseId == viewData.student.course) {
  viewData.courses[i].selected = true;
  }
  }
  }).catch(() => {
  viewData.courses = []; // set courses to empty if there was an error
  }).then(() => {
  if (viewData.student == null) { // if no student - return an error
  res.status(404).send("Student Not Found");
  } else {
  res.render("student", { viewData: viewData }); // render the "student" view
  }
  });
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
    collegeData.getCourses()
      .then((courses) => {
        res.render('addStudent', { courses });
      })
      .catch(() => {
        res.render('addStudent', { courses: [] });
      });
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
  app.get("/students/delete/:studentNum", (req, res) => {
    const studentNum = parseInt(req.params.studentNum);
  
    collegeData
      .deleteStudentByNum(studentNum)
      .then(() => {
        res.redirect("/students");
      })
      .catch((err) => {
        res.status(500).send("Unable to Remove Student / Student not found");
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
