var express = require('express');
var { getQuestions, postQuestion, postAnswer } = require('./controller.js');

// Router
// var router = require('./routes.js');

var app = express();
module.exports.app = app;

// Set what we are listening on.
app.set('port', 3000);

// Logging and parsing
// app.use(morgan('dev'));
// app.use(cors());
app.use(express.json());

// Set up our routes
// app.use('/classes', router);

// Serve the client files
app.use(express.static(__dirname + '/../client'));

// api proxy
app.get(`/qa/questions`, getQuestions);
app.post(`/qa/questions`, postQuestion);

// app.get(`/qa/questions`, getQuestions);

// If we are being run directly, run the server.
if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}
