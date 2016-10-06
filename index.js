'use strict';
var gutil = require('gulp-util');
var File = gutil.File;
var fs = require('fs');
var path = require('path');
var throughgulp = require('through-gulp'),
    cheerio = require('cheerio'),
    htmlclean   = require('htmlclean');

var PluginError = gutil.PluginError;



module.exports =function(option){
    function log( msg ){       
        gutil.log('gulp-merge-inline-resources:' , msg );
    }
    function logError ( msg ){   
         gutil.log( gutil.colors.red('gulp-merge-inline-resources:' ), msg );
    };
    
    var pathurl = path.resolve(process.cwd(),'./');
    function transFun(file,encoding,callback){
            var sasslist = [],
                amd,
                filePath = path.dirname(file.path),
                filename = path.basename(file.path,'.html');

           if ( file.isNull() || file.isDirectory() ) {
                return callback( null, file );
            }
            if ( file.isStream() ) {
                return callback(new gutil.PluginError('gulp-merge-inline-resources', 'Streaming not supported') );
            }
            if(file.isBuffer()){
                var hml = file.contents.toString();
                var $ = cheerio.load(hml);
              
                $('script[type="text/sass"]').each(function(index,ele){
                    var sass = $(ele).html();
                    $(ele).remove();
                    sasslist.push(sass);
                });
                $('script[type="text/amd"]').each(function(index,ele){
                    amd = $(ele).html();
                    $(ele).remove();
                });
                var jsFile = new File({path:'./'+filename+'.js'});
                jsFile.contents = new Buffer(amd);
                this.push(jsFile);
                var saFile = new File({path:'./'+filename+'.scss'});
                saFile.contents = new Buffer(sasslist.join());
                this.push(saFile);
                file.contents = new Buffer($.html());
                callback(null,file);
                this.push(file);
            }; 
     };
     function flurFun(callback){
            console.log('end');
     }

    return throughgulp(transFun,flurFun);    
};