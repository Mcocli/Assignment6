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
  //******* */
  function getTAs() {
    return new Promise((resolve, reject) => {
      if (dataCollection && dataCollection.students) {
        const tas = dataCollection.students.filter(student => student.TA === true);
        if (tas.length > 0) {
          resolve(tas);
        } else {
          reject("No results returned");
        }
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
      reject("No results returned");
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


  module.exports.initialize=initialize;
  module.exports.getCourses=getCourses;
  module.exports.getAllStudents=getAllStudents;
  module.exports.getTAs=getTAs;
  module.exports.getStudentsByCourse=getStudentsByCourse;
  module.exports.getStudentByNum=getStudentByNum;
  module.exports.addStudent=addStudent;