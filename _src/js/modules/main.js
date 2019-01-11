class FlowsCanvas {
  constructor(canvas) {
    const that = this;
    const props = {
      arrow: {
        location: 1,
        visible: true,
        width: 5,
        length: 10,
        id: "ARROW"
      },
      flowchart: {
        gap: 0,
        cornerRadius: 8
      }
    };
    const jsp = this.jsp = jsPlumb.getInstance({
      Connector: ["Flowchart", props.flowchart],
      ConnectionOverlays: [
        ["Arrow", props.arrow]
      ],
      PaintStyle: {stroke: "#808080", strokeWidth: 2, outlineStroke: "transparent", outlineWidth: 5},
      Container: canvas
    });

    jsp.registerConnectionTypes({
      "drag": {
        paintStyle: {stroke: "#2e0085", strokeWidth: 2},
      },
      "selected": {
        paintStyle: {stroke: "#0478ff", strokeWidth: 2},
      }
    });

    jsp.bind('connection', function (info) {
      let connection = info.connection;
      let arr = jsp.select({
        source: connection.sourceId,
        target: connection.targetId
      });
      if (arr.length > 1 || $(connection.target).has(connection.source).length) {
        jsp.deleteConnection(connection);
      }
      else {
        connection.unbind('click');
        connection.bind("click", function () {
          if (connection.hasType('selected')) {
            connection.removeType("selected");
          }
          else {
            for (let i = 0, all = jsp.getAllConnections(), allLength = all.length; i < allLength; i++) {
              if (all[i].hasType('selected')) {
                all[i].removeType('selected');
                break;
              }
            }
            connection.addType("selected");
          }
          connection.removeOverlay(props.arrow.id);
          connection.addOverlay(["Arrow", props.arrow]);
        });

        jsp.fire('connectionAdd', connection);
      }
    });

    jsp.bind("connectionDrag", function (connection) {
      connection.addType("drag");
      connection.setConnector(["Straight"]);
      connection.addOverlay(["Arrow", props.arrow]);
      connection.addClass('flows-drag');
    });

    jsp.bind("connectionDragStop", function (connection, origEvent) {
      connection.removeType("drag");
      connection.setConnector(["Flowchart", props.flowchart]);
      connection.addOverlay(["Arrow", props.arrow]);
      connection.removeClass('flows-drag');
    });

    $(document).on('keyup', function (e) {
      //deleting selected connection on press DEL
      if (e.keyCode === 46) {
        for (let i = 0, all = jsp.getAllConnections(), allLength = all.length; i < allLength; i++) {
          if (all[i].hasType('selected')) {
            that.deleteConnection(all[i]);
            break;
          }
        }
      }
    });
  }

  deleteConnection(connection) {
    this.jsp.deleteConnection(connection);
    this.jsp.fire('connectionDelete', connection);
  }

  connect(source, target) {
    this.jsp.connect({
      source: source,
      target: target
    });
  }

  makeItem(elem) {
    let that = this;
    this.jsp.makeTarget(elem, {
      anchor: ["Continuous", {faces: ["top", "left", "bottom"]}],
      endpoint: ["Rectangle", {width: 10, height: 10, cssClass: 'flows-endpoint'}],
      paintStyle: {fill: "blue"}
    });
    this.jsp.draggable(elem, {
      handle: '.flows-box__header__handle',
      start: function (ui, e) {
        elem.addClass('flows-active');
      }
    });
    elem.find('.flows-box__output').each(function () {
      that.jsp.makeSource($(this), {
        anchor: "Right",
        endpoint: 'Blank'
      });
    });
    elem.find('.flows-box__header__close').on('click', function () {
      that.deleteItem(elem);
    });
    elem.on('mousedown', function () {
      if (elem.hasClass('flows-active')) {
        elem.removeClass('flows-active');
      }
      else {
        let container = that.jsp.getContainer();
        $(container)
          .find('.flows-active')
          .removeClass('flows-active');
        elem.addClass('flows-active');
      }
    });
  }

  deleteItem(elem) {
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

    canvas.jsp.bind('connectionDelete', function (connection) {
      console.log('connectionDelete:', connection);
    });
    canvas.jsp.bind('connectionAdd', function (connection) {
      // console.log('connectionAdd:', connection);
    });
    canvas.jsp.bind('itemDelete', function (elem) {
      console.log('itemDelete:', elem);
    });

    canvas.connect('box1out1', 'box2');
    canvas.connect('box3out1', 'box2');

  });
});
