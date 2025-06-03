import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import session from 'express-session';
import { Class } from './attendance_database/class_schema.js';
import { checkId } from "./attendance_database/checkId_schema.js"
import { Student } from "./attendance_database/student_schema.js"
import { Subject } from './attendance_database/subject_schema.js';
import { Attendance } from './attendance_database/attendance_schema.js';

mongoose.connect("mongodb+srv://realmiphone0001:<db_password>@cluster0.brgo1fa.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("connected to collection"))
  .catch((e) => console.log("failed to connect the collection"))

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../Frontend/StyleSheets')));
app.use(express.static(path.join(__dirname, '../Frontend/assets')));
app.use(express.static(path.join(__dirname, '../Frontend/frontend-js')));
app.use(session({
  secret: 'this-is-admin',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}));

app.set('views', path.join(__dirname, '../Frontend/template'));
app.set(`view engine`, `ejs`);

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    next();
  }
  else {
    res.redirect('/');
  }
}


app.get('/', async (req, res) => {
  if (req.session.user) {
    try {
      const classes = await Class.find(); 
      res.render('take-attendance', { classes }); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
  else {
    res.render('login');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await checkId.findOne({ username: username, password: password });

  if (user) {
    req.session.user = username;
    try {
      const classes = await Class.find(); 
      res.render('take-attendance', { classes }); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  } else {
    res.render('login', { error: "invalid username or password" });
  }
})


app.get('/take-attendance', isAuthenticated, async (req, res) => {
  try {
    const classes = await Class.find();
    res.render('take-attendance', { classes });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/api/subjects', async (req, res) => {
  const classId = req.query.classId;
  if (!classId) return res.status(400).json({ error: 'Missing classId' });

  try {

    const subjects = await Subject.find({ ClassID: classId });

    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

app.get('/api/students', async (req, res) => {
  const ClassId = req.query.classId;
  if (!ClassId) return res.status(400).json({ error: 'Missing classId' });

  try {
    const students = await Student.find({ ClassId });
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch students' });
  }
});

app.post('/attendance', async (req, res) => {
  const { Date, SubjectId, students } = req.body;

  try {


    const attendanceData = students.map(({ StudentId, AttendanceStatus }) => ({
      StudentId,
      Date,
      SubjectId,
      AttendanceStatus,
    }));

    await Attendance.insertMany(attendanceData);

    const classes = await Class.find();
    res.send('successfully saved')

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving attendance' });
  }
});


app.get('/get-report', isAuthenticated, async (req, res) => {
  try {
    const classes = await Class.find(); 
    res.render('get-report', { classes }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
})

app.get('/add-student', isAuthenticated, async (req, res) => {
  try {
    const classes = await Class.find();
    res.render('add-student', { classes }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
})

app.get('/add-class', isAuthenticated, async (req, res) => {
  try {
    const classes = await Class.find(); 
    res.render('add-class', { classes }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
})

app.post('/add-student', isAuthenticated, async (req, res) => {
  const { RollNo, Name, Email, ClassId } = req.body;
  try {
    const student = new Student({ RollNo, Name, Email, ClassId });
    await student.save();
    try {
      const classes = await Class.find(); 
      res.render('add-student', { classes }); 
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
  catch (err) {
    console.error('Error adding student:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/remove-student', isAuthenticated, async (req, res) => {
  const { RollNo } = req.body;

  try {
    let stu = await Student.findOne({ RollNo: RollNo });
    if (!stu) {
      return res.status(404).json({ error: 'Student not found with Roll No: ' + RollNo });
    }
    res.status(200).json({ message: 'Student deleted successfully' });
    await Student.deleteOne({ RollNo: RollNo });
    await Attendance.deleteMany({ StudentId: stu._id })
  } catch (err) {
    console.error('Error removing student:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/api/del-class', async (req, res) => {
  const { classID } = req.body;
  try {

    await Class.deleteOne({ _id: classID });
    await Subject.deleteMany({ ClassID: classID });

    res.status(200).json({ message: 'Class deleted successfully' });

  } catch (err) {
    console.error('Error adding class:', err);

    if (err.code === 11000) {
      res.status(400).json({ message: 'Class with this name already exists.' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

});

app.post('/add-class', isAuthenticated, async (req, res) => {
  const { className, subjects } = req.body;

  
  if (!className || !Array.isArray(subjects) || subjects.length === 0) {
    return res.status(400).json({ message: 'Class name and subjects are required' });
  }

  try {
    
    const newClass = new Class({ ClassName: className });
    const savedClass = await newClass.save();

    
    const subjectDocs = subjects.map(name => ({
      SubjectName: name,
      ClassID: savedClass._id
    }));

    await Subject.insertMany(subjectDocs);

    res.status(200).json({ message: 'Class and subjects added successfully' });

  } catch (err) {
    console.error('Error adding class:', err);

    if (err.code === 11000) {
      res.status(400).json({ message: 'Class with this name already exists.' });
    } else {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
});


app.post('/api/get-st-report', async (req, res) => {
  const { Date: dateStr, SubjectId } = req.body;

  try {
    const report = await Attendance.aggregate([
      {
        $match: {
          Date: new Date(dateStr),
          SubjectId: new mongoose.Types.ObjectId(SubjectId)
        }
      },
      {
        $lookup: {
          from: 'Student',
          localField: 'StudentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $unwind: '$student' 
      },
      {
        $project: {
          _id: 1,
          StudentId: 1,
          Date: 1,
          SubjectId: 1,
          AttendanceStatus: 1,
          student: {
            Name: '$student.Name',
            RollNo: '$student.RollNo',
            Email: '$student.Email' 
          }
        }
      }
    ]);

    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/get-semester-report', async (req, res) => {
  const { SubjectId } = req.body;

  try {
    const subjectObjectId = new mongoose.Types.ObjectId(SubjectId);

    const report = await Attendance.aggregate([
      {
        $match: { SubjectId: subjectObjectId }
      },
      {
        $group: {
          _id: {
            StudentId: '$StudentId',
            status: '$AttendanceStatus'
          },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: '$_id.StudentId',
          presentCount: {
            $sum: {
              $cond: [{ $eq: ['$_id.status', 'present'] }, '$count', 0]
            }
          },
          totalCount: { $sum: '$count' }
        }
      },
      {
        $lookup: {
          from: 'Student',
          localField: '_id',
          foreignField: '_id',
          as: 'student'
        }
      },
      {
        $unwind: '$student'
      },
      {
        $project: {
          StudentId: '$_id',
          Name: '$student.Name',
          RollNo: '$student.RollNo',
          PresentCount: '$presentCount',
          TotalClasses: '$totalCount',
          Percentage: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$presentCount', '$totalCount'] },
                  100
                ]
              },
              2
            ]
          }
        }
      },
      {
        $sort: { RollNo: 1 }  
      }
    ]);

    res.json(report);
  } catch (err) {
    console.error('Error generating semester report:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/promote-student', isAuthenticated, async (req, res) => {
  try {
    const classes = await Class.find(); 
    res.render('promote-student', { classes }); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.post('/api/shift-students', async (req, res) => {
  const { studentIds, newClassId } = req.body;

  try {
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { $set: { ClassId: newClassId } }
    );
    await Attendance.deleteMany({
      StudentId: { $in: studentIds }
    });
    res.status(200).send("Students shifted");
  } catch (err) {
    console.error("Shift error:", err);
    res.status(500).send("Internal Server Error");
  }
});


app.listen(port, () => {
  console.log(`app is running on localhost ${port}`);
});
