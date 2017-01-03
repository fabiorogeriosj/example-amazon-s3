var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
var express = require('express');
var multer  = require('multer');
var app = express();
var upload = multer({ dest: './upload/'});

//instanciando classe S3
var s3 = new AWS.S3();
var bucketFotos = 'appfotosp';
//var urlBucketFotos = 'https://s3-us-west-2.amazonaws.com/appfotos/';
var urlBucketFotos = 'http://appfotosp.s3-accelerate.amazonaws.com/';
//var urlBucketFotos = 'https://s3-sa-east-1.amazonaws.com/appfotosp/';

//config express
app.use(express.static(__dirname));
app.set('views', __dirname);
app.set('view engine', 'jade');

//rotas
app.get('/', function (req, res) {
  var params = {
    Bucket: bucketFotos,
    EncodingType: 'url'
  };
  s3.listObjects(params, function(err, data) {
    if (err){
        console.log(err, err.stack);
        res.render('index', { erro: err });
    } else {
        res.render('index', { dados: data, url: urlBucketFotos });
    }
  })
})

app.post('/', upload.single('foto'), function(req, res){
  var stream = fs.createReadStream(req.file.path);
  var ext = path.extname(req.file.originalname);
  var params = {
    Bucket: bucketFotos,
    Key: req.file.filename + ext,
    Body: stream,
    ACL: 'public-read-write'
  };
  s3.upload(params, function(err, data) {
    if(err){
      res.render('index', { erro: err });
    } else {
      res.redirect('/');
    }
  })
})

app.listen(80, function () {
  console.log('appfotos rodando na porta 80!')
});

