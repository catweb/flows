class FlowsCanvas {
  constructor(canvas){
    this.canvas = canvas;

    this.setup();
  }

  setup() {

  }
}

jsPlumb.ready(function () {
  var jsp = jsPlumb.getInstance({
    Endpoint: ["Dot", {radius: 1, cssClass: 'flows-hidden'}],
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
        id: "ARROW"
      }]
    ],
    Container: $('.flows-canvas')
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
      overlays: [
        ["Arrow", {width: 5, length: 10, location: 1, visible: true}]
      ]
    },
    "drag": {
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

  jsp.bind('connection',function(info){
    var connection = info.connection;
    var arr = jsp.select({source:connection.sourceId,target:connection.targetId});
    if(arr.length>1){
      jsp.deleteConnection(connection);
    }
    else {
      connection.bind("click", function () {
        connection.toggleType("selected");
      });
    }
  });

  jsp.bind("connectionDrag", function (connection) {
    connection.removeType("basic");
    connection.setType("drag");
  });
  jsp.bind("connectionDragStop", function (connection, origEvent) {
    connection.removeType("drag");
    connection.setType("basic");
  });

  var optionsSource = {
    anchor: "Right"
  };
  jsp.makeSource("box1out1", optionsSource);
  jsp.makeSource("box1out2", optionsSource);
  jsp.makeSource("box2out1", optionsSource);
  jsp.makeSource("box2out2", optionsSource);
  jsp.makeSource("box3out1", optionsSource);

  var optionsTarget = {
    anchor: "Continuous"
  };
  jsp.makeTarget("box1", optionsTarget);
  jsp.makeTarget("box2", optionsTarget);
  jsp.makeTarget("box3", optionsTarget);


  jsp.draggable($('.flows-box'), {
    handle: '.flows-box__header__handle'
  });


  jsp.connect({
    source: "box1out1",
    target: "box2",
    type: "basic"
  });
});
