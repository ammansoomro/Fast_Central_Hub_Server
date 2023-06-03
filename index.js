const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const courseRoute = require('./routes/courses');
const facultyRoute = require('./routes/facultys');
const materialRoute = require('./routes/materials');
const reviewCourseRoute = require('./routes/reviewcourses');
const departmentRoute = require('./routes/departments');
const reviewFacultyRoute = require('./routes/reviewfaculties');
const societyRoute = require('./routes/societies');
const eventRoute = require('./routes/events');
const projectRoute = require('./routes/projects');
const announcementRoute = require('./routes/announcements');
dotenv.config();

mongoose.connect(process.env.MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log('Connected to Backend (MongoDB)');
}).catch((err) => {
    console.log(err);
});

app.use(express.json());
app.use('/api/auth', authRoute);
app.use('/api/users', userRoute);
app.use('/api/courses', courseRoute);
app.use('/api/facultys', facultyRoute);
app.use('/api/materials', materialRoute);
app.use('/api/reviewCourses', reviewCourseRoute);
app.use('/api/departments', departmentRoute);
app.use('/api/reviewfaculties', reviewFacultyRoute);
app.use('/api/societies', societyRoute);
app.use('/api/events', eventRoute);
app.use('/api/projects', projectRoute);
app.use('/api/announcements', announcementRoute);
const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log('Backend Server is Running : 8800');
}
);