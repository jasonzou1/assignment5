const Sequelize = require('sequelize');
var sequelize = new Sequelize('okzlxqnw', 'okzlxqnw', '69zWGFA1I62dt68UKtMeaKaVPxeDOUah', {
    host: 'stampy.db.elephantsql.com',
    dialect: 'postgres',
    port: 5432,
    dialectOptions: {
        ssl: { rejectUnauthorized: false }
    },
    query: { raw: true }
});


class Data {
    constructor(students, courses) {
        this.students = students;
        this.courses = courses;
    }
}

let dataCollection = null;

// Initialize
module.exports.initialize = function () {
    return sequelize.sync()
        .then(() => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject("unable to sync the database");
        });
};

// Get All Students
module.exports.getAllStudents = function () {
    return Student.findAll()
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((err) => {
            return Promise.reject("no results returned");
        });
};

// Get Students By Course
module.exports.getStudentsByCourse = function (course) {
    return Student.findAll({ where: { course: course } })
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((err) => {
            return Promise.reject("no results returned");
        });
};

// Get Student By Number
module.exports.getStudentByNum = function (num) {
    return Student.findAll({ where: { studentNum: num } })
        .then((data) => {
            return Promise.resolve(data[0]);
        })
        .catch((err) => {
            return Promise.reject("no results returned");
        });
};

// Get Courses
module.exports.getCourses = function () {
    return Course.findAll()
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((err) => {
            return Promise.reject("no results returned");
        });
};

// Get Course By Id
module.exports.getCourseById = function (id) {
    return Course.findAll({ where: { courseId: id } })
        .then((data) => {
            return Promise.resolve(data[0]);
        })
        .catch((err) => {
            return Promise.reject("no results returned");
        });
};

// Add Student
module.exports.addStudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    for (let prop in studentData) {
        if (studentData[prop] === "") studentData[prop] = null;
    }

    return Student.create(studentData)
        .then(() => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject("unable to create student");
        });
};

// Update Student
module.exports.updateStudent = function (studentData) {
    studentData.TA = (studentData.TA) ? true : false;
    for (let prop in studentData) {
        if (studentData[prop] === "") studentData[prop] = null;
    }

    return Student.update(studentData, { where: { studentNum: studentData.studentNum } })
        .then(() => {
            return Promise.resolve();
        })
        .catch((err) => {
            return Promise.reject("unable to update student");
        });
};


const Student = sequelize.define('Student', {
    studentNum: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING,
    email: Sequelize.STRING,
    addressStreet: Sequelize.STRING,
    addressCity: Sequelize.STRING,
    addressProvince: Sequelize.STRING,
    TA: Sequelize.BOOLEAN,
    status: Sequelize.STRING
});

const Course = sequelize.define('Course', {
    courseId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    courseCode: Sequelize.STRING,
    courseDescription: Sequelize.STRING
});

// Defining the hasMany relationship
Course.hasMany(Student, { foreignKey: 'course', onDelete: 'SET NULL' });

// Optional: Sync the models with the database
sequelize.sync();
