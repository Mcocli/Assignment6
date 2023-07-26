/* WEB700 Assignment 2
Name: Marinela Coclli
ID:139916225
 */
class Data {
    constructor(students, courses) {
      this.students = students;
      this.courses = courses;
    }
  }
  
  let dataCollection = null;
  /************************ */
  const fs = require('fs');
const { getSystemErrorMap } = require('util');

function initialize() {
  return new Promise((resolve, reject) => {
    fs.readFile('./data/students.json', 'utf8', (err, studentDataFromFile) => {
      if (err) {
        reject("Unable to read students.json");
        return;
      }

      fs.readFile('./data/courses.json', 'utf8', (err, courseDataFromFile) => {
        if (err) {
          reject("Unable to read courses.json");
          return;
        }

        const students = JSON.parse(studentDataFromFile);
        const courses = JSON.parse(courseDataFromFile);

        dataCollection = new Data(students, courses);
       
        resolve();
      });
    });
  });
}

  /*************************** */
  function getAllStudents() {
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.students && dataCollection.students.length > 0) {
        resolve(dataCollection.students);
      } else {
        reject("No results returned");
      }
    });
  }
  /*********** */
  function getCourses() {
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.courses && dataCollection.courses.length > 0) {
        resolve(dataCollection.courses);
      } else {
        reject("No results returned");
      }
    });
  }

  
function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    const students = dataCollection.students;

    const filteredStudents = students.filter(student => student.course === course);

    if (filteredStudents.length === 0) {
      reject("No results returned");
    } else {
      resolve(filteredStudents);
    }
  });
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
    const students = dataCollection.students; 
    const foundStudent = students.find(student => student.studentNum === num);

    if (!foundStudent) {
      reject(new Error("No results returned"));

    } else {
      resolve(foundStudent);
    }
  });
  }


function addStudent(studentData) {
  return new Promise((resolve, reject) => {

    studentData.TA = (typeof studentData.TA === 'undefined') ? false : true;
    studentData.studentNum = dataCollection.students.length + 1;
    dataCollection.students.push(studentData);
    resolve();
  });
}

function getCourseById(id) {
  return new Promise((resolve, reject) => {
    // Search the courses array for the course with matching courseId
    const course = courses.find((course) => course.courseId === id);

    // If course found, resolve with the course object
    if (course) {
      resolve(course);
    } else {
      // If course not found, reject with an error message
      reject(new Error("Query returned 0 results"));
    }
  });
}

function updateStudent(studentData) {
  return new Promise((resolve, reject) => {
    const studentNum = studentData.studentNum;

    // Find the index of the student with matching studentNum in the students array
    const studentIndex = students.findIndex((student) => student.studentNum === studentNum);

    if (studentIndex !== -1) {
    
      students[studentIndex] = {
        ...students[studentIndex], 
        firstName: studentData.firstName,
        lastName: studentData.lastName,
        email: studentData.email,
        program: studentData.program,
        isTA: studentData.isTA === 'on', 
      };

      resolve();
    } else {
      reject(new Error('Student not found')); 
    }
  });
}



module.exports.getCourseById=getCourseById;
  module.exports.initialize=initialize;
  module.exports.getCourses=getCourses;
  module.exports.getAllStudents=getAllStudents;
  module.exports.getStudentsByCourse=getStudentsByCourse;
  module.exports.getStudentByNum=getStudentByNum;
  module.exports.addStudent=addStudent;
  module.exports.updateStudent=updateStudent;