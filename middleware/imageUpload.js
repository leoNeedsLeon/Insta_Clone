var AWS = require('aws-sdk');
var multer  = require('multer');
AWS.config.update({region: 'us-east-1'});

var upload = multer({
	storage: multer.memoryStorage()
}).single();

const BucketName = 'pkg-insta-clone';
var s3 = new AWS.S3({apiVersion: '2006-03-01'});
var params = {Bucket: BucketName, Key: 'key', Body: 'fasd'};

var s3upload = (type)=> {
    return function(req, res, next) {
        upload(req,res,function(err) {
            if(err) {
                console.log(err);
                return res.end("Error uploading file.");
            } else {
                if(type=='dp')
                parmas.Key = req.user.username + '/' + type;
            else
                params.Key = req.user.username + '/' + req.file.originalname;
            params.Body = req.file.buffer;
            s3.upload(params,(err,data)=>{
                if(err)
                    console.log(err);
                req.imgloc = data;
                return next();
            });
            }
        });
    }
}

module.exports={s3upload};