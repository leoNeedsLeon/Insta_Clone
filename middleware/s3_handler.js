var AWS = require('aws-sdk');
var multer  = require('multer');
AWS.config.update({region: 'us-east-1'});

var upload = multer({
	storage: multer.memoryStorage()
}).single();

const BucketName = 'pkg-insta-clone';
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var params = {Bucket: BucketName, Key: 'key', Body: 'fasd', ACL:'public-read'};

// var s3upload = (type)=> {
//     return function(req, res, next) {
//         upload(req,res,function(err) {
//             if(err) {
//                 console.log(err);
//                 return res.end("Error uploading file.");
//             } else {
//                 if(type=='dp')
//                 parmas.Key = req.user.username + '/' + type;
//             else
//                 params.Key = req.user.username + '/' + req.file.originalname;
//             params.Body = req.file.buffer;
//             s3.upload(params,(err,data)=>{
//                 if(err)
//                     console.log(err);
//                 req.imgloc = data;
//                 return next();
//             });
//             }
//         });
//     }
// }

var userDpUpload = function(req, res, next){
    //console.log('in dp'+req.body);
    params.Key = req.body.username + '/dp.jpg';
    params.Body = req.file.buffer;
	s3.upload(params,function(err, data) {
        console.log('yofasdf'+data);
        req.dplocation = data.Location;
        next();
    });
}

module.exports={userDpUpload};