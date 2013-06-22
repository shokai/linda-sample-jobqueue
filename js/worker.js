var io = new RocketIO().connect(config.linda.base);
var linda = new Linda(io);
var ts = new linda.TupleSpace(config.linda.space);

var work = function(){
  ts.take(["calc_sample","request"], function(tuple){
    if (tuple.length === 3){
      var task = tuple[2];
      var res = eval(task);
      $("#logs").prepend(
        $("<li>").text(task+" = "+res).fadeIn(600)
      );
      ts.write(["calc_sample","response", task, res])
    }
    work();
  });
};

io.on("connect", function(){
  $("#status").text(io.type+" connect");
  work();
});

io.on("disconnect", function(){
  $("#status").text("disconnect");
});
