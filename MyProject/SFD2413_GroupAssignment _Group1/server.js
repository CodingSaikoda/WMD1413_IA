const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

//to allow frontend to send data
app.use(cors());          //Allow frontend to talk to backend
app.use(express.json());  //backend server


//MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Tommyliu200555mysql',      // Change to your own MySQL password
    database: 'scms_database'             // Use this name
});


//Test database connection  (will show in cmd)
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL');
});


//For API endpoint to handle form submission

//POST API Endpoint//
// register student (POST API)
app.post('/api/student', (req, res) => {

    //Take data from req.body(front-end) and store it into variables.
    const { name, email, phoneNum, password } = req.body;

    //Prepare an SQL query to insert a new student with name, email, phone number, and password
    const sql = `
    INSERT INTO student (name,email,phoneNum,password)
    VALUES(?,?,?,?)`;

    //Execute the SQL query with user data, and handle any errors via the callback
    db.query(sql,[name.trim(),email.trim(),phoneNum.trim(),password.trim()],err =>{
        if (err){
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({      // status 409 = conflict if email is already registered
                    message: 'Email already registered'
                });            
            }   
            // will show it in cmd
            console.error('DB Error:',err);
            return res.status(500).json({     // status 500 = internal server error
                message:'Error saving data'   
            });
        }

        // if no error, directly go here
        res.status(201).json({     // status 201 = created
            message:'Registered successfully'
        });
    });    
});         
/// POST API endpoint


//GET API Endpoint//
//Get All student (GET API)
app.get('/api/student',(req,res) => {

    //Prepare an SQL query to select all students from the database
    const sql ='SELECT * FROM student';

    //Execute the SQL query and handle any errors in the callback
    db.query(sql,(err,results) =>{
        if(err){
            console.error('DB Error',err);
            return res.status(500).json({     // status 500 = internal server error
                message:'Error fetching users'
            });
        }

        //Send the query results as a JSON response to the client
        res.json(results);
    });
});     
///GET API endpoint


///POST API endpoint
// Login student (POST API)
app.post('/api/login', (req, res) => {

    //Take data from req.body(front-end) and store it into variables.
    const { email, password } = req.body;

    //Query the database for a student record matching the provided email.
    const sql = "SELECT * FROM student WHERE email = ?";
    db.query(sql, [email.trim()], (err, results) => {
        if (err) {
            console.error("DB Error:", err);
            return res.status(500).json({    // status 500 = internal server error
                success: false,
                message: "Server error"
            });
        }

        if (results.length === 0) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const user = results[0];

        if (user.password !== password.trim()) {
            return res.json({
                success: false,
                message: "Invalid password"
            });
        }

        res.json({
            success: true,
            message: "Login successful"
        });
    });
});
//POST API endpoint


///To Start API Server

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
