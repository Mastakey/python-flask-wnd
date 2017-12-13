var myf = function(){
    console.log('test');
}

var addEntry = function(type, args){
    if (type === 'work'){
        addWork(args);
    }
}

var addWork = function(args){
    name = args['name'];
    content = args['content'];
    console.log(content);
}