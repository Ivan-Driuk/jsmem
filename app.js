
var express = require('express'),
    path = require('path'),
    MongoClient = require('mongodb').MongoClient;

var app = express();

MongoClient.connect('mongodb://localhost:27017/jsmemdb', function(err, db) {

    if(err) throw err;

    app.set('port', process.env.PORT || 3000);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');

    app.use(express.favicon());

    app.get('/', handleRequestHome);
    app.get('/home',  handleRequestHome);
    app.get('/:pageName', handleRequest);

    app.listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'));
    });

    function handleRequestHome(req,res){
        db.collection('pages').find({},{'_id':0,'pageName':1,'pageArea':1,'description':1,'books':1})
            .sort([['pageArea',1],['pageName',1]]).toArray(function(err,pages){
                res.render('home', {
                    pages:pages
                });
            });
    }

    function handleRequest(req,res){
        var pageName = req.params.pageName;
        var pages = db.collection('pages');
        pages.findOne({'pageName':pageName}, function(err,page){
            if(!page){
                res.send("нема нифига");
                return 0;
            }
            res.render('index', {
                title: page.pageName,
                pageName: page.pageName,
                codeTxt: page.code.txt,
                codeImg: page.code.img,
                associationTxt: page.association.txt,
                associationImg: page.association.img,
                linksTo: page.links.to,
                linksOut: page.links.out,
                schemaTxt: page.schema.txt,
                schemaImg: page.schema.img
            })
        })
    };

});
