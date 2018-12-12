class FlowsCanvas {
  constructor(canvas){
    const that = this;
    const jsp = this.jsp = jsPlumb.getInstance({
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
      Container: canvas
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

    jsp.bind('connection', function(info){
      let connection = info.connection;
      let arr = jsp.select({
        source: connection.sourceId,
        target: connection.targetId
      });
      if(arr.length > 1 || $(connection.target).has(connection.source).length){
        jsp.deleteConnection(connection);
      }
      else {
        jsp.fire('connectionAdd', connection);
        connection.bind("click", function () {
          if(connection.hasType('selected')){
            connection.removeType("selected");
          }
          else {
            jsp.getAllConnections().forEach(function (conn) {
              conn.removeType('selected')
            });
            connection.addType("selected");
          }
        });
      }
    });

    jsp.bind("connectionDrag", function (connection) {
      connection.removeType("basic");
      connection.setType("drag");
      connection.addClass('flows-drag');
    });

    jsp.bind("connectionDragStop", function (connection, origEvent) {
      connection.removeType("drag");
      connection.setType("basic");
      connection.removeClass('flows-drag');
    });

    $(document).on('keyup', function (e) {
      //deleting selected connection on press DEL
      if(e.keyCode === 46){
        for(let i = 0, all = jsp.getAllConnections(), allLength = all.length; i < allLength; i++) {
          if(all[i].hasType('selected')){
            that.deleteConnection(all[i]);
            break;
          }
        }
      }
    });
  }

  deleteConnection(connection){
    this.jsp.deleteConnection(connection);
    this.jsp.fire('connectionDelete', connection);
  }

  connect(source, target){
    this.jsp.connect({
      source: source,
      target: target,
      type: "basic"
    });
  }

  makeItem(elem){
    let that = this;
    let jsp = this.jsp;
    this.jsp.makeTarget(elem, {
      anchor: "Continuous"
    });
    this.jsp.draggable(elem, {
      handle: '.flows-box__header__handle',
      start: function (ui, e) {
        elem.addClass('flows-active');
      }
    });
    elem.find('.flows-box__output').each(function () {
      jsp.makeSource($(this), {
        anchor: "Right"
      });
    });
    elem.find('.flows-box__header__close').on('click', function () {
      that.deleteItem(elem);
    });
    elem.on('mousedown', function () {
      if(elem.hasClass('flows-active')){
        elem.removeClass('flows-active');
      }
      else {
        let container = jsp.getContainer();
        $(container)
          .find('.flows-active')
          .removeClass('flows-active');
        elem.addClass('flows-active');
      }
    });
  }

  deleteItem(elem){
    this.jsp.remove(elem);
    this.jsp.fire('itemDelete', elem);
  }
}

jsPlumb.ready(function () {
  $('.flows-canvas').each(function () {
    const base = $(this);
    const canvas = new FlowsCanvas(base);
    const boxes = base.find('.flows-box');
    boxes.each(function () {
      canvas.makeItem($(this));
    });
    canvas.connect('box1out1','box2');
    canvas.connect('box3out1','box2');
    canvas.jsp.bind('connectionDelete', function (connection) {
      console.log('connectionDelete:', connection);
    });
    canvas.jsp.bind('connectionAdd', function (connection) {
      console.log('connectionAdd:', connection);
    });
    canvas.jsp.bind('itemDelete', function (elem) {
      console.log('itemDelete:', elem);
    });

  });
});
