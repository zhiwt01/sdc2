var express = require('express');
var { getQuestions, postQuestion, postAnswer } = require('./controller.js');

var app = express();
module.exports.app = app;


app.set('port', 3000);

app.use(express.json());

app.use(express.static(__dirname + '/../client'));

// api proxy
app.get(`/qa/questions`, getQuestions);
app.post(`/qa/questions`, postQuestion);


if (!module.parent) {
  app.listen(app.get('port'));
  console.log('Listening on', app.get('port'));
}
