jsPlumb.ready(function () {
  var $canvas = $('.flows-canvas');
  var jsp = jsPlumb.getInstance({
    Endpoint: ["Dot", {
      radius: 1
      , cssClass: 'hidden'
    }],
    // Endpoints : [ [ "Blank", {} ], [ "Dot", { radius:5 } ] ],
    Connector: ["Flowchart",
      {
        gap: 0,
        cornerRadius: 4
      }
    ],
    ConnectionOverlays: [
      ["Arrow", {
        location: 1,
        visible: true,
        width: 5,
        length: 10,
        id: "ARROW",
        events: {
          click: function () {
            alert("you clicked on the arrow overlay")
          }
        }
      }]
      // ,
      // [ "Label", {
      //   location: 0.1,
      //   id: "label",
      //   cssClass: "aLabel",
      //   events:{
      //     tap:function() { alert("hey"); }
      //   }
      // }]
    ],
    Container: $canvas
  });

  jsp.registerConnectionTypes({
    "basic": {
      anchors: [["Right"], ["Continuous", { faces:[ "top", "left", "bottom" ] }]],
      connector: ["Flowchart",
        {
          gap: 0,
          cornerRadius: 8
        }
      ],
      paintStyle: {stroke: "#808080", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4},
      // hoverPaintStyle: { stroke: "#0044f7" },
      overlays: [
        ["Arrow", {width: 5, length: 10, location: 1, visible: true}]
      ]
    },
    "drag": {
      // anchor: "Right",
      connector: ["Straight"],
      paintStyle: {stroke: "#2e0085", strokeWidth: 2},
      overlays: [
        ["Arrow", {width: 5, length: 10, location: 1}]
      ]
    },
    "selected": {
      paintStyle: {stroke: "#0478ff", strokeWidth: 2},
    }
  });

  var optionsSource = {
    anchor: "Right",
    // ,
    // connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
    // connector:"StateMachine"
  };
  jsp.makeSource("box1out1", optionsSource);
  jsp.makeSource("box1out2", optionsSource);
  jsp.makeSource("box2out1", optionsSource);
  jsp.makeSource("box2out2", optionsSource);
  jsp.makeSource("box3out1", optionsSource);

  var optionsTarget = {
    anchor: "Continuous",
    // connectionType: 'basic',
    // connectorStyle: { stroke: "#808080", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
    dropOptions:{
      drop:function(e, ui) {
        // alert('drop!');
      }
    }
  };
  jsp.makeTarget("box1", optionsTarget);
  jsp.makeTarget("box2", optionsTarget);
  jsp.makeTarget("box3", optionsTarget);


  jsp.draggable($('.flows-box'), {
    handle: '.flows-box__header__handle'
  });
  jsp.bind('connection',function(info){
    console.log(info);
    var con = info.connection;
    var arr = jsp.select({source:con.sourceId,target:con.targetId});
    console.log(arr);
    if(arr.length>1){
      jsp.deleteConnection(con);
    }
    else {
      con.bind("click", function () {
        con.toggleType("selected");
      });
    }
  });
  // jsp.bind('beforeDrop',function(info){
  //   console.log(info);
  //   var con = info.connection;
  //   var arr = jsp.select({source:info.sourceId,target:info.targetId});
  //   console.log(arr);
  //   if(arr.length>1){
  //     jsp.deleteConnection(con);
  //   }
  //   else {
  //     con.bind("click", function () {
  //       con.toggleType("selected");
  //     });
  //   }
  // });
  var connection = jsp.connect({
    source: "box1out1",
    target: "box2",
    type: "basic",
    // endpoint: ["Rectangle", {
    //   cssClass: "myEndpoint",
    //   width: 10,
    //   height: 10
    // }]

  });
  // connection.bind("click", function () {
  //   connection.toggleType("selected");
  // });
  jsp.bind("connectionDrag", function (connection) {
    // console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
    connection.removeType("basic");
    connection.setType("drag");
  });
  jsp.bind("connectionDragStop", function (connection, origEvent) {
    console.log(connection, origEvent);
    // console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
    connection.removeType("drag");
    connection.setType("basic");
  });
});
