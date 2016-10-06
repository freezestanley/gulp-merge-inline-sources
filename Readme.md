Split sass or js in HTML file.
--------------------------------------------------------------
demo
<html>
<head></head>
<body>
    <script type="text/sass">
           //sass
           .body{background:$red};
    </script>
    <script type="text/amd">
           //js
           define([],function(){
              return function(){}; 
           });
    </script>
</body>
</html>
----------------------------------------------------------------
dir                   dir
 |-a.html  => split => |-a.html
                       |-a.sass
                       |-a.js
