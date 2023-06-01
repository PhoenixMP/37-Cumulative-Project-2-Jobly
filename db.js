// "use strict";
// /** Database setup for jobly. */
// const { Client } = require("pg");
// const { getDatabaseUri } = require("./config");

// let db;

// if (process.env.NODE_ENV === "production") {
//   db = new Client({
//     connectionString: getDatabaseUri(),
//     ssl: {
//       rejectUnauthorized: false
//     }
//   });
// } else {
//   db = new Client({
//     connectionString: getDatabaseUri()
//   });
// }


// db.connect();

// module.exports = db;

/** Database config for books. */


const { Client } = require("pg");

let DB_URI = {
  user: 'phoen',
  host: 'localhost',
  database: '',
  port: 5432,
  password: 'myPassword'
}






if (process.env.NODE_ENV === "test") {
  DB_URI.database = "jobly_test";
} else {
  DB_URI.database = "jobly";
}





let db = new Client(DB_URI);



db.connect();

module.exports = db;