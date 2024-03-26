import express from 'express'
import nodemailer from 'nodemailer'
import bodyParser from 'body-parser'
import pg from 'pg'
import 'dotenv/config'


import { fileURLToPath } from 'url'
import { dirname } from 'path'


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});


const client = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: 'new_project',
  password: '123456',
  port: 5432,
})





const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express()

app.use(express.static(__dirname+'\\public'))

app.use(bodyParser.urlencoded({extended: true}))


app.get('/', function (req, res) {
  res.render('index.ejs',{
    'user': ' '
  })
})

app.post('/', function (req, res){
var query1 = "insert into project_info(user_id,password,email) values ('"+req.body.user+"','"+req.body.password+"','"+req.body.email+"')"

var query2 = "select * from project_info"

  var mailOptions = {
    from: 'madhurima.v@somaiya.edu',
    to: 'darsh10@somaiya.edu',
    subject: 'Welcome',
    text: 'Thank You For Registering ' + req.body.user + ' please visit again'
  };

  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
  res.render('final.ejs', { 
    'user': req.body.user
  })

  client.connect(async function(err) {

    if (err) throw err;
    console.log("Connected!");
    var data = await client.query(query2)
    var rows = data['rows']
    var length = rows.length

    for(let i=0; i<length; i++){
      console.log(rows[i]['email'])
      
    }
    
  });

})


app.listen(7000, function(req, res){
    console.log('server started')
})