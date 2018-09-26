var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var AWS = require('aws-sdk');
var multer  = require('multer');
var app = express();

AWS.config.update({region: 'us-east-1'});
app.use(express.static(path.join(__dirname, 'public')));

var upload = multer({
	storage: multer.memoryStorage()
});

const BucketName = 'pkg-insta-clone';
var s3 = new AWS.S3({apiVersion: '2006-03-01'});

// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	var username = req.user.username+"/";
	//console.log(req.user);
	s3.listObjects({Bucket: BucketName, Prefix:username},(err, data)=>{
		if(err)
			console.log(err);
		console.log(data);
		// console.log(data.Contents);
		res.render('index',{userImages: data.Contents, name:req.user.name});
	});
});

router.get('/upload', ensureAuthenticated, function(req, res){
	console.log(req.user.username);
	res.render('upload');
});
var params = {Bucket: BucketName, Key: 'key', Body: 'data', ACL:'public-read'};
router.post('/upload', ensureAuthenticated, upload.single('newimage'), function(req, res){
	params.Key = req.user.username+'/'+req.file.originalname;
	params.Body = req.file.buffer;
	s3.upload(params,function(err, data) {
			console.log(err, data);
		});
	res.redirect("/");
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}

module.exports = router;