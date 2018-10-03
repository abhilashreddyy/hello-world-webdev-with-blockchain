var express    = require("express")
var app = express();
var path    = require("path");
app.use(express.static("public"));
app.use(express.static("hello_world"));

app.get("/",function(req,res){
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.listen(3007,function(){

  console.log("The Blog Server is running at localhost 3007");

});
