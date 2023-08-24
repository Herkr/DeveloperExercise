//-----------------------------SET-UP------------------------------------
// CONNECT TO DATABASE
const { createPool } = require('mysql2');

const pool = createPool({
    host: '127.0.0.1',
    user: 'root',
    password: '1234',
    database: 'globeTracker',
    connectionLimit: 10
})

// USE EXPRESS FOR MIDDLEWARE IN WEB SERVICE
const express = require('express');
const app = express();
const PORT = 8080;

// middleware - use json for body
app.use(express.json())

// check if port is alive
app.listen(
    PORT,
    () => console.log(`it's on http://localhost:${PORT}`)
)
//-----------------------------FUNCTIONS------------------------------------
// check if user input is correct
function checkUserInput(first_name, last_name, email_, phone_number, user_type, result){
    // check has number
    var hasNumber = /\d/;
    // check email format
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    // first name only letters
    if(hasNumber.test(first_name)){
        result.status(418).send({message: `First name shouldn't contain numbers`})
    }
    // last name only letters
    if(hasNumber.test(last_name)){
        result.status(418).send({message: `Last name shouldn't contain numbers`})
    }
    // email only email format
    if(!emailRegex.test(email_)){
        result.status(418).send({message: `Email format is incorrect`})
    }
    // phone number only numbers
    if(isNaN(phone_number)){
        result.status(418).send({message: `Phone number should only contain numbers`})
    }
    // user type only 'Basic', 'Extended' or 'Advanced'
    if(user_type == "Basic" || user_type == "Extended" || user_type == "Advanced"){
        
    }else{
        result.status(418).send({message: `User type should be either 'Basic', 'Extended' or 'Advanced'`})
    }
}

//-----------------------------API------------------------------------
// GET ALL USERS
app.get('/users', (req, res) => {

    // SQL statement to get all users
    pool.query(`select * from user_info`, (err, result, fields)=>{
        if(err){
            res.status(418).send({message: 'Something went wrong!'})
        }

        // return list
        res.status(200).send({
            message: result
        })
    })
});

// GET USER WHERE ID IS ?
app.get('/user/:id', (req, res) => {

    // get id from url
    const { id } = req.params;

    // SQL statement to get a user from id
    pool.query(`select * from user_info where id = ${id}`, (err, result, fields)=>{
        if(err){
            res.status(418).send({message: 'Something went wrong!'})
        }
        
        // return user
        res.send({
            id: result[0].id,
            firstName: result[0].firstName,
            lastName: result[0].lastName,
            email: result[0].email,
            phoneNumber: result[0].phoneNumber,
            userType: result[0].userType
        });
    })

});

// ADD A USER BY WRITING IN BODY
app.post('/addUser', (req, res) => {

    // get json body
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;
    const { phoneNumber } = req.body;
    const { userType } = req.body;

    // use function to check input format
    checkUserInput(firstName, lastName,email, phoneNumber,userType, res);

    // SQL statement to add a user
    pool.query(`insert into user_info (firstName, lastName, email, phoneNumber, userType) values ('${firstName}', '${lastName}', '${email}', ${phoneNumber}, '${userType}')`, (err, result, fields)=>{
        if(err){
            res.status(418).send({message: 'Something went wrong!'})
        }

        // return OK
        res.status(200).send({
            message: 'A new user is added'
        })
    })
})

// EDIT USER WHERE ID IS ?
app.put('/editUser/:id', (req, res) => {

    // get json body
    const { id } = req.params;
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;
    const { phoneNumber } = req.body;
    const { userType } = req.body;

    // use function to check input format
    checkUserInput(firstName, lastName, email, phoneNumber, userType, res);

    // SQL statement to edit user
    pool.query(`update user_info set firstName = '${firstName}', lastName = '${lastName}', email = '${email}', phoneNumber = ${phoneNumber}, userType = '${userType}' where id = ${id}`, (err, result, fields) =>{
        if(err){
            res.status(418).send({message: 'Something went wrong!'})
        }

        // return OK
        res.status(200).send({
            message: 'User with id ' + id +' is updated'
        })
    })
})

// DELETE USER WHERE ID IS ?
app.delete('/deleteUser/:id', (req, res) => {

    // get id from url
    const { id } = req.params;

    // SQL statement to delete user with id
    pool.query(`delete from user_info where id = ${id}`, (err, result, fields) =>{
        if(err){
            res.status(418).send({message: 'Something went wrong!'})
        }

        // return OK
        res.status(200).send({
            message: 'User with id ' + id + ' is deleted'
        })
    })
})