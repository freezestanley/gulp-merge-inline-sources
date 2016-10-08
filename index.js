'use strict';
var gutil = require('gulp-util');
var File = gutil.File;
var fs = require('fs');
var path = require('path');
var throughgulp = require('through-gulp'),
    cheerio = require('cheerio'),
    htmlclean   = require('htmlclean');
var process = require('process');


var PluginError = gutil.PluginError;



module.exports =function(option){
    var sassMerge = option?(option.sassMerge || false):false;
    var jsMerge = option?(option.jsMerge || false):false;
    var prefix = option.prefix || '_';
    function log( msg ){       
        gutil.log('gulp-split-sass-js:' , msg );
    }
    function logError ( msg ){   
         gutil.log( gutil.colors.red('gulp-split-sass-js:' ), msg );
    };

    var dir = {};

    function transFun(file,encoding,callback){
            var hml = file.contents.toString();
            var upath = path.dirname(path.relative(path.join(process.cwd(),option.In),file.path));
            var sasslist='',amd='',
                filePath = path.dirname(file.path),
                filename = prefix+path.basename(file.path,'.html');
            
            if(!dir[upath]){
                    
                    dir[upath]={sass:'',js:'',name:(filePath.split('/')[filePath.split('/').length-1])};
                }
            
           if ( file.isNull()) {
                return callback( null, file );
            }
            if(file.isDirectory()){
                
                return callback( null, file );
            }
            if ( file.isStream() ) {
                return callback(new gutil.PluginError('gulp-split-sass-js', 'Streaming not supported') );
            }
            if(file.isBuffer()){
                var $ = cheerio.load(hml,{decodeEntities: false});
                $('script[type="text/sass"]').each(function(index,ele){
                    var sass = $(ele).html();
                    $(ele).remove();
                    sasslist+=sass;
                });
                $('script[type="text/js"]').each(function(index,ele){
                    amd = $(ele).html();
                    $(ele).remove();
                    
                });
                
                //var upath = '../'+path.relative(process.cwd()+'/dev',filePath)+'/';
                
                if(amd){
                    if(!jsMerge){
                        var jsFile = new File({path:upath+'/'+filename+'.js'});
                        jsFile.contents = new Buffer(amd,'utf8');
                        this.push(jsFile);
                    };
                    dir[upath].js += '/* include '+file.path+'*/'+amd;
                };
                if(sasslist){
                    if(!sassMerge){
                        var saFile = new File({path:upath+'/'+filename+'.scss'});
                        saFile.contents = new Buffer(sasslist,'utf8');
                        this.push(saFile);
                    }
                    dir[upath].sass += '/* include '+filename+'.sass */'+sasslist;
                };


                if(!sassMerge){
                    $('head').append('<link rel="stylesheet" href="'+upath+'/'+filename+'.css">');
                }else{
                    $('head').append('<link rel="stylesheet" href="./'+(filePath.split('/')[filePath.split('/').length-1])+'.css">');
                };
                

                file.contents = new Buffer($.html(),'utf8');
                this.push(file);
                callback(null,file);
            }; 
     };
     function flurFun(callback){
           for(var i in dir){
                var sassString = dir[i].sass;
                var jsString = dir[i].js;
               
                var name = i.split('/');
                var fileName = '/'+prefix+dir[i].name;

                if(jsMerge){
                    if(sassString){
                        var jsFile = new File({path:i+fileName+'.js'});
                        jsFile.contents = new Buffer(jsString,'utf8');
                        this.push(jsFile);
                    };
                };
                if(sassMerge){
                    if(jsString){
                        var saFile = new File({path:i+fileName+'.scss'});
                        saFile.contents = new Buffer(sassString,'utf8');
                        this.push(saFile);
                    };
                };
            };
            callback();
     }

    return throughgulp(transFun,flurFun);    
};
