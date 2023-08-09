const { Sequelize, DataTypes } = require('sequelize');
var sequelize = new Sequelize('quhfanqu', 'quhfanqu', 'CCpu0GNr5IQwh_xWdPGWbfg1HZIQ3Q0P', {
 host: 'peanut.db.elephantsql.com',
 dialect: 'postgres',
 port: 5432,
 dialectOptions: {
 ssl: { rejectUnauthorized: false }
 },
 query:{ raw: true }
});


class Data {
  constructor(students, courses) {
    this.students = students;
    this.courses = courses;
  }
}

function initialize() {
  return new Promise((resolve, reject) => {
    // Synchronize the models with the database (create tables if they don't exist)
    sequelize
      .sync()
      .then(() => {
        console.log('Database and tables created!');
        resolve();
      })
      .catch((error) => {
        console.error('Error creating database tables:', error);
        reject('Unable to sync the database');
      });
  });
}

function getAllStudents() {
  return new Promise((resolve, reject) => {
    // Use Sequelize findAll() to retrieve all students from the database
    Student.findAll()
      .then((students) => {
        if (students && students.length > 0) {
          resolve(students);
        } else {
          reject('No results returned');
        }
      })
      .catch((error) => {
        console.error('Error retrieving students:', error);
        reject('No results returned');
      });
  });
}



function getCourses() {
  return new Promise((resolve, reject) => {
    // Use Sequelize findAll() to retrieve all courses from the database
    Course.findAll()
      .then((courses) => {
        if (courses && courses.length > 0) {
          resolve(courses);
        } else {
          reject('No results returned');
        }
      })
      .catch((error) => {
        console.error('Error retrieving courses:', error);
        reject('No results returned');
      });
  });
}

function addCourse(courseData) {
  return new Promise((resolve, reject) => {
  
    for (const key in courseData) {
      if (courseData.hasOwnProperty(key) && courseData[key] === "") {
        courseData[key] = null;
      }
    }

    Course.create(courseData)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error('Error creating course:', error);
        reject('Unable to create course');
      });
  });
}  
function updateCourse(courseData) {
  return new Promise((resolve, reject) => {
    // Iterate over every property in the courseData object and replace empty values ("") with null
    for (const key in courseData) {
      if (courseData.hasOwnProperty(key) && courseData[key] === "") {
        courseData[key] = null;
      }
    }

    // Use Sequelize update() to update the course in the database
    Course.update(courseData, {
      where: {
        courseId: courseData.courseId,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error('Error updating course:', error);
        reject('Unable to update course');
      });
  });
}

function deleteCourseById(id) {
  return new Promise((resolve, reject) => {
    Course.destroy({
      where: {
        courseId: id,
      },
    })
      .then((rowsDeleted) => {
        if (rowsDeleted === 0) {
          reject('Course not found');
        } else {
          resolve();
        }
      })
      .catch((error) => {
        console.error('Error deleting course:', error);
        reject('Unable to delete course');
      });
  });
} 


function getStudentsByCourse(course) {
  return new Promise((resolve, reject) => {
    Student.findAll({
      where: {
        course: course,
      },
    })
      .then((students) => {
        if (students && students.length > 0) {
          resolve(students);
        } else {
          reject('No results returned');
        }
      })
      .catch((error) => {
        console.error('Error retrieving students by course:', error);
        reject('No results returned');
      });
  });
}

function getStudentByNum(num) {
  return new Promise((resolve, reject) => {
   
    Student.findOne({
      where: {
        studentNum: num,
      },
    })
      .then((student) => {
        if (student) {
          resolve(student);
        } else {
          reject('No results returned');
        }
      })
      .catch((error) => {
        console.error('Error retrieving student by studentNum:', error);
        reject('No results returned');
      });
  });
}

function addStudent(studentData) {
  return new Promise((resolve, reject) => {
 studentData.TA = studentData.TA ? true : false;

  
    for (const key in studentData) {
      if (studentData.hasOwnProperty(key) && studentData[key] === "") {
        studentData[key] = null;
      }
    }

    // Use Sequelize create() to add a new student to the database
    Student.create(studentData)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error('Error creating student:', error);
        reject('Unable to create student');
      });
  });
}


function getCourseById(id) {
  return new Promise((resolve, reject) => {
    // Use Sequelize findOne() with a where clause to filter course by courseId
    Course.findOne({
      where: {
        courseId: id,
      },
    })
      .then((course) => {
        if (course) {
          resolve(course);
        } else {
          reject('No results returned');
        }
      })
      .catch((error) => {
        console.error('Error retrieving course by courseId:', error);
        reject('No results returned');
      });
  });
}


function updateStudent(studentData) {
  return new Promise((resolve, reject) => {
   studentData.TA = studentData.TA ? true : false;

    // Iterate over every property in the studentData object and replace empty values ("") with null
    for (const key in studentData) {
      if (studentData.hasOwnProperty(key) && studentData[key] === "") {
        studentData[key] = null;
      }
    }

    // Use Sequelize update() to update the student in the database
    Student.update(studentData, {
      where: {
        studentNum: studentData.studentNum,
      },
    })
      .then(() => {
        resolve();
      })
      .catch((error) => {
        console.error('Error updating student:', error);
        reject('Unable to update student');
      });
  });
}

function deleteStudentByNum(studentNum) {
  return new Promise((resolve, reject) => {
    Student.destroy({ where: { studentNum } })
      .then(() => resolve())
      .catch((err) => reject(err));
  });
}


// Define the Student model
const Student = sequelize.define('Student', {
  studentNum: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
  },
  addressStreet: {
    type: DataTypes.STRING,
  },
  addressCity: {
    type: DataTypes.STRING,
  },
  addressProvince: {
    type: DataTypes.STRING,
  },
  TA: {
    type: DataTypes.BOOLEAN,
  },
  status: {
    type: DataTypes.STRING,
  },
});


const Course = sequelize.define('Course', {
  courseId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  courseCode: {
    type: DataTypes.STRING,
  },
  courseDescription: {
    type: DataTypes.STRING,
  },
});


Course.hasMany(Student, { foreignKey: 'course' });


(async () => {
  try {
    await sequelize.sync();
    console.log('Database and tables created!');
  } catch (error) {
    console.error('Error creating database tables:', error);
  }
})();
 




module.exports.initialize = initialize;
module.exports.getCourses = getCourses;
module.exports.getAllStudents = getAllStudents;
module.exports.getStudentsByCourse = getStudentsByCourse;
module.exports.getStudentByNum = getStudentByNum;
module.exports.addStudent = addStudent;
module.exports.getCourseById = getCourseById;
module.exports.updateStudent = updateStudent;
module.exports.addCourse = addCourse;
module.exports.updateCourse = updateCourse;
module.exports.deleteCourseById = deleteCourseById;
module.exports.deleteStudentByNum =deleteStudentByNum;