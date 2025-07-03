// This section loads modules. It loads the Express server and stores
// it in "express", then creates an application, a router, and a path handler
const express = require('express');
const app = express();
const router = express.Router();
const path = require('path');

// This part sets up the database
const { Pool } = require('pg');
// You may need to modify the password or database name in the following line:
const connectionString = `postgres://postgres:CTI_110_WakeTech@localhost/Gradebook`;
// The default password is CTI_110_WakeTech
// The default database name is Gradebook
const pool = new Pool({ connectionString: connectionString });

// Serve static files from "public"
app.use(express.static(path.join(__dirname, 'public')));

// Route for the root URL
router.get('/', function (req, res) {
  // Strictly by PDF: gradebook.html is in the same folder as cti_110_node.js
  res.sendFile(path.join(__dirname, 'gradebook.html'));
});

app.use("/", router);

// API route to get grades
router.get('/api/grades', function (req, res) {
  pool.query(
    `SELECT Students.student_id, first_name, last_name, AVG(assignments.grade) as total_grade 
     FROM Students 
     LEFT JOIN Assignments ON Assignments.student_id = Students.student_id 
     GROUP BY Students.student_id 
     ORDER BY total_grade DESC`,
    [],
    function (err, result) {
      if (err) {
        console.error(err);
      }

      result.rows.forEach(function (row) {
        console.log(`Student Name: ${row.first_name} ${row.last_name}`);
        console.log(`Grade: ${row.total_grade}`);
      });

      res.status(200).json(result.rows);
    }
  );
});

// Start the server
let server = app.listen(3000, function () {
  console.log("App Server via Express is listening on port 3000");
  console.log("To quit, press CTRL + C");
});
