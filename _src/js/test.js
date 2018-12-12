jsPlumb.ready(function () {

  var instance = window.jsp = jsPlumb.getInstance({
    // default drag options
    DragOptions: { cursor: 'pointer', zIndex: 2000 },
    // the overlays to decorate each connection with.  note that the label overlay uses a function to generate the label text; in this
    // case it returns the 'labelText' member that we set on each connection in the 'init' method below.
    ConnectionOverlays: [
      [ "Arrow", {
        location: 1,
        visible:true,
        width:11,
        length:11,
        id:"ARROW",
        events:{
          click:function() { alert("you clicked on the arrow overlay")}
        }
      } ],
      [ "Label", {
        location: 0.1,
        id: "label",
        cssClass: "aLabel",
        events:{
          tap:function() { alert("hey"); }
        }
      }]
    ],
    Container: "testcanvas"
  });

  var basicType = {
    connector: "StateMachine",
    paintStyle: { stroke: "red", strokeWidth: 4 },
    hoverPaintStyle: { stroke: "blue" },
    overlays: [
      "Arrow"
    ]
  };
  instance.registerConnectionType("basic", basicType);

  // this is the paint style for the connecting lines..
  var connectorPaintStyle = {
      strokeWidth: 2,
      stroke: "#61B7CF",
      joinstyle: "round",
      outlineStroke: "white",
      outlineWidth: 2
    },
    // .. and this is the hover style.
    connectorHoverStyle = {
      strokeWidth: 3,
      stroke: "#216477",
      outlineWidth: 5,
      outlineStroke: "white"
    },
    endpointHoverStyle = {
      fill: "#216477",
      stroke: "#216477"
    },
    // the definition of source endpoints (the small blue ones)
    sourceEndpoint = {
      endpoint: "Dot",
      paintStyle: {
        stroke: "#7AB02C",
        fill: "transparent",
        radius: 7,
        strokeWidth: 1
      },
      isSource: true,
      connector: [ "Flowchart", { stub: [40, 60], gap: 10, cornerRadius: 5, alwaysRespectStubs: true } ],
      connectorStyle: connectorPaintStyle,
      hoverPaintStyle: endpointHoverStyle,
      connectorHoverStyle: connectorHoverStyle,
      dragOptions: {},
      overlays: [
        [ "Label", {
          location: [0.5, 1.5],
          label: "Drag",
          cssClass: "endpointSourceLabel",
          visible:false
        } ]
      ]
    },
    // the definition of target endpoints (will appear when the user drags a connection)
    targetEndpoint = {
      endpoint: "Dot",
      paintStyle: { fill: "#7AB02C", radius: 7 },
      hoverPaintStyle: endpointHoverStyle,
      maxConnections: -1,
      dropOptions: { hoverClass: "hover", activeClass: "active" },
      isTarget: true,
      overlays: [
        [ "Label", { location: [0.5, -0.5], label: "Drop", cssClass: "endpointTargetLabel", visible:false } ]
      ]
    },
    init = function (connection) {
      connection.getOverlay("label").setLabel(connection.sourceId.substring(15) + "-" + connection.targetId.substring(15));
    };

  var _addEndpoints = function (toId, sourceAnchors, targetAnchors) {
    for (var i = 0; i < sourceAnchors.length; i++) {
      var sourceUUID = toId + sourceAnchors[i];
      instance.addEndpoint("flowchart" + toId, sourceEndpoint, {
        anchor: sourceAnchors[i], uuid: sourceUUID
      });
    }
    for (var j = 0; j < targetAnchors.length; j++) {
      var targetUUID = toId + targetAnchors[j];
      instance.addEndpoint("flowchart" + toId, targetEndpoint, { anchor: targetAnchors[j], uuid: targetUUID });
    }
  };

  // suspend drawing and initialise.
  instance.batch(function () {

    _addEndpoints("Window4", ["TopCenter", "BottomCenter"], ["LeftMiddle", "RightMiddle"]);
    _addEndpoints("Window2", ["LeftMiddle", "BottomCenter"], ["TopCenter", "RightMiddle"]);
    _addEndpoints("Window3", ["RightMiddle", "BottomCenter"], ["LeftMiddle", "TopCenter"]);
    _addEndpoints("Window1", ["LeftMiddle", "RightMiddle"], ["TopCenter", "BottomCenter"]);

    // listen for new connections; initialise them the same way we initialise the connections at startup.
    instance.bind("connection", function (connInfo, originalEvent) {
      init(connInfo.connection);
    });

    // make all the window divs draggable
    instance.draggable(jsPlumb.getSelector(".flowchart-demo .window"), { grid: [20, 20] });
    // THIS DEMO ONLY USES getSelector FOR CONVENIENCE. Use your library's appropriate selector
    // method, or document.querySelectorAll:
    //jsPlumb.draggable(document.querySelectorAll(".window"), { grid: [20, 20] });

    // connect a few up
    instance.connect({uuids: ["Window2BottomCenter", "Window3TopCenter"], editable: true});
    instance.connect({uuids: ["Window2LeftMiddle", "Window4LeftMiddle"], editable: true});
    instance.connect({uuids: ["Window4TopCenter", "Window4RightMiddle"], editable: true});
    instance.connect({uuids: ["Window3RightMiddle", "Window2RightMiddle"], editable: true});
    instance.connect({uuids: ["Window4BottomCenter", "Window1TopCenter"], editable: true});
    instance.connect({uuids: ["Window3BottomCenter", "Window1BottomCenter"], editable: true});
    //

    //
    // listen for clicks on connections, and offer to delete connections on click.
    //
    instance.bind("click", function (conn, originalEvent) {
      // if (confirm("Delete connection from " + conn.sourceId + " to " + conn.targetId + "?"))
      //   instance.detach(conn);
      conn.toggleType("basic");
    });

    instance.bind("connectionDrag", function (connection) {
      console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
    });

    instance.bind("connectionDragStop", function (connection) {
      console.log("connection " + connection.id + " was dragged");
    });

    instance.bind("connectionMoved", function (params) {
      console.log("connection " + params.connection.id + " was moved");
    });
  });

  jsPlumb.fire("jsPlumbDemoLoaded", instance);

});


// jsPlumb.ready(function () {
//   var $canvas = $('.flows-canvas');
//   var jsp = jsPlumb.getInstance({
//     Endpoint: ["Dot", {radius: 1, cssClass: 'hidden'}],
//     // Endpoints : [ [ "Blank", {} ], [ "Dot", { radius:5 } ] ],
//     Connector: ["Flowchart",
//       {
//         gap: 0,
//         cornerRadius: 4
//       }
//     ],
//     ConnectionOverlays: [
//       ["Arrow", {
//         location: 1,
//         visible: true,
//         width: 5,
//         length: 10,
//         id: "ARROW",
//         events: {
//           click: function () {
//             alert("you clicked on the arrow overlay")
//           }
//         }
//       }]
//       // ,
//       // [ "Label", {
//       //   location: 0.1,
//       //   id: "label",
//       //   cssClass: "aLabel",
//       //   events:{
//       //     tap:function() { alert("hey"); }
//       //   }
//       // }]
//     ],
//     Container: $canvas
//   });
//
//   jsp.registerConnectionTypes({
//     "basic": {
//       anchors: [["Right"], ["Continuous", { faces:[ "top", "left", "bottom" ] }]],
//       connector: ["Flowchart",
//         {
//           gap: 0,
//           cornerRadius: 8
//         }
//       ],
//       paintStyle: {stroke: "#808080", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4},
//       // hoverPaintStyle: { stroke: "#0044f7" },
//       overlays: [
//         ["Arrow", {width: 5, length: 10, location: 1, visible: true}]
//       ]
//     },
//     "drag": {
//       // anchor: "Right",
//       connector: ["Straight"],
//       paintStyle: {stroke: "#2e0085", strokeWidth: 2},
//       overlays: [
//         ["Arrow", {width: 5, length: 10, location: 1}]
//       ]
//     },
//     "selected": {
//       paintStyle: {stroke: "#0478ff", strokeWidth: 2},
//     }
//   });
//
//   var optionsSource = {
//     anchor: "Right",
//     // ,
//     // connectorStyle: { stroke: "#5c96bc", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
//     // connector:"StateMachine"
//   };
//   jsp.makeSource("box1out1", optionsSource);
//   jsp.makeSource("box1out2", optionsSource);
//   jsp.makeSource("box2out1", optionsSource);
//   jsp.makeSource("box2out2", optionsSource);
//   jsp.makeSource("box3out1", optionsSource);
//
//   var optionsTarget = {
//     anchor: "Continuous",
//     // connectionType: 'basic',
//     // connectorStyle: { stroke: "#808080", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 4 },
//     dropOptions:{
//       drop:function(e, ui) {
//         // alert('drop!');
//       }
//     }
//   };
//   jsp.makeTarget("box1", optionsTarget);
//   jsp.makeTarget("box2", optionsTarget);
//   jsp.makeTarget("box3", optionsTarget);
//
//
//   jsp.draggable($('.flows-box'), {
//     handle: '.flows-box__header__handle'
//   });
//   jsp.bind('connection',function(info){
//     console.log(info);
//     var con = info.connection;
//     var arr = jsp.select({source:con.sourceId,target:con.targetId});
//     console.log(arr);
//     if(arr.length>1){
//       jsp.deleteConnection(con);
//     }
//     else {
//       con.bind("click", function () {
//         con.toggleType("selected");
//       });
//     }
//   });
//   // jsp.bind('beforeDrop',function(info){
//   //   console.log(info);
//   //   var con = info.connection;
//   //   var arr = jsp.select({source:info.sourceId,target:info.targetId});
//   //   console.log(arr);
//   //   if(arr.length>1){
//   //     jsp.deleteConnection(con);
//   //   }
//   //   else {
//   //     con.bind("click", function () {
//   //       con.toggleType("selected");
//   //     });
//   //   }
//   // });
//   var connection = jsp.connect({
//     source: "box1out1",
//     target: "box2",
//     type: "basic",
//     // endpoint: ["Rectangle", {
//     //   cssClass: "myEndpoint",
//     //   width: 10,
//     //   height: 10
//     // }]
//
//   });
//   // connection.bind("click", function () {
//   //   connection.toggleType("selected");
//   // });
//   jsp.bind("connectionDrag", function (connection) {
//     // console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
//     connection.removeType("basic");
//     connection.setType("drag");
//   });
//   jsp.bind("connectionDragStop", function (connection, origEvent) {
//     console.log(connection, origEvent);
//     // console.log("connection " + connection.id + " is being dragged. suspendedElement is ", connection.suspendedElement, " of type ", connection.suspendedElementType);
//     connection.removeType("drag");
//     connection.setType("basic");
//   });
// });
