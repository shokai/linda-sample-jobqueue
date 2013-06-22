var io = new RocketIO().connect(config.linda.base);
var linda = new Linda(io);
var ts = new linda.TupleSpace(config.linda.space);

io.on("connect", function(){
  ts.watch(["calc_sample", "response"], function(tuple){
    if(tuple.length !== 4) return;
    $("#logs").prepend(
      $("<li>").text("response : "+tuple[2]+" = "+tuple[3]).fadeIn(600)
    );
  });
});

$(function(){
  $("#btn_request").click(function(){
    var tasks = calc.tasks();
    for(var i = 0; i < tasks.length; i++){
      var task = tasks[i];
      ts.write(["calc_sample","request",task]);
      $("#logs").prepend(
        $("<li>").text("request : "+task).fadeIn(600)
      );
    }
  });
  $("#btn_random").click(calc.random);
  calc.random();
})

var calc = (new function(){
  this.random = function(){
    var tasks = [];
    for(var i = 0; i < 15; i++){
      tasks.push(
        [i, "+", random_num(), random_ops(), random_num(), random_ops(), random_num()].join(" ")
      );
    }
    $("#tasks").val(tasks.join("\n"));
  };
  var random_ops = function(){
    var ops = ["+","-","*","/"];
    return ops[ Math.floor(Math.random()*ops.length) ];
  };
  var random_num = function(){
    return Math.floor(Math.random()*100)
  };
  this.tasks = function(){
    return tasks = $("#tasks").val().split(/[\r\n]/);
  };
}())

io.on("connect", function(){
  $("#status").text(io.type+" connect");
});

io.on("disconnect", function(){
  $("#status").text("disconnect");
});
