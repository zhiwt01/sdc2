var Pool = require('pg-pool');

var pool2 = new Pool({
  database: 'faq',
  user: 'ubuntu',
  password: 'password',
  host: '184.72.96.86',
  port: 5432,
  // max: 20, // set pool max size to 20
  // idleTimeoutMillis: 1000, // close idle clients after 1 second
  // connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established
  // maxUses: 7500, // close (and replace) a connection after it has been used 7500 times (see below for discussion)
});

pool2.connect((err, pool2, release) => {
  if (err) {
    console.log(err);
    return;
  }
  pool2.query('SELECT NOW()').then((res) => console.log(res.rows));
});

module.exports = pool2;

// var mysql = require('mysql2');

// var con = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   database: 'chat'
// });

// con.connect(function(err) {
//   if (err) { throw err; }
//   console.log('Connected!');
// });
// // con.execute(
// //   'SELECT * FROM `messages`',
// //   function(err, results, fields) {
// //     console.log(results); // results contains rows returned by server
// //     console.log(fields); // fields contains extra meta data about results, if available

// //     // If you execute same statement again, it will be picked from a LRU cache
// //     // which will save query preparation time and give better performance
// //   }
// // );
// // Create a database connection and export it from this file.
// // Confirm that the credentials supplied for the connection are correct.
// // On Campus at pairing stations you'll use
// // user: 'student', password: 'student'
// // On your personal computer supply the correct credentials for your mySQL account -- likely
// // user: 'root', password: ''
// // OR
// // user: 'root', password: 'some_password_you_created_at_install'

// // mysql -u root < path/to/schema.sql;
// module.exports = con;
