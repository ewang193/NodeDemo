var WorkflowShape = new Object();

/**
 * start point template
 * @type {*[]}
 */
var startJson = [{
  "type": "WorkflowShape.WorkflowStart",
  //"id": draw2d.util.UUID.create(),
  "x": 100,
  "y": 100,
  "width": 100,
  "height": 100,
  "alpha": 1,
  "angle": 0,
  "userData": {},
  "cssClass": "WorkflowShape_WorkflowStart",
  "ports": [{
    //"id": draw2d.util.UUID.create(),
    "name": "output0",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthPortLocator"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output1",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthPortLocator"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output2",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.EastPortLocator"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output3",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.WestPortLocator"
  }, {
    "name": "output4",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthWestPortLocator"
  }, {
    "name": "output5",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthEastPortLocator"
  }, {
    "name": "output6",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthWestPortLocator"
  }, {
    "name": "output7",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthEastPortLocator"
  }],
  "bgColor": "#228B22",
  "color": "#000000",
  "stroke": 1,
  "dasharray": null,
  "labels": [{
    labelData: {
      //"id": draw2d.util.UUID.create(),
      "text": "start\n(id)"
    },
    "locator": "draw2d.layout.locator.CenterLocator",
    "type": "WorkflowShape.EditWithPopupLabel"
  }]
}];

/**
 * json template for end flow
 * @type {*[]}
 */
var endJson = [{
  "type": "WorkflowShape.WorkflowEnd",
  //"id": draw2d.util.UUID.create(),
  "x": 100,
  "y": 100,
  "width": 100,
  "height": 100,
  "alpha": 1,
  "angle": 0,
  "userData": {},
  "cssClass": "WorkflowShape_WorkflowEnd",
  "ports": [{
    //"id": draw2d.util.UUID.create(),
    "name": "output0",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthPortLocator"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output1",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthPortLocator"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output2",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.EastPortLocator"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output3",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.WestPortLocator"
  }, {
    "name": "output4",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthWestPortLocator"
  }, {
    "name": "output5",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthEastPortLocator"
  }, {
    "name": "output6",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthWestPortLocator"
  }, {
    "name": "output7",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthEastPortLocator"
  }],
  "bgColor": "#C9302C",
  "color": "#000000",
  "stroke": 1,
  "dasharray": null,
  "labels": [{
    labelData: {
      //"id": draw2d.util.UUID.create(),
      "text": "end\n(id)"
    },
    "locator": "draw2d.layout.locator.CenterLocator",
    "type": "WorkflowShape.EditWithPopupLabel"
  }]
}];
/**
 * json template for process flow
 * @type {*[]}
 */
var processJson = [{
  "type": "WorkflowShape.WorkflowProcess",
  //"id": draw2d.util.UUID.create(),
  "x": 100,
  "y": 100,
  "width": 120,
  "height": 60,
  "alpha": 1,
  "angle": 0,
  "userData": {},
  "cssClass": "WorkflowShape_WorkflowProcess",
  "ports": [{
    "name": "output0",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthPortLocator1"
  }, {
    "name": "output1",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthPortLocator2"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output2",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthPortLocator1"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output3",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthPortLocator2"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output4",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.EastPortLocator1"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output5",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.EastPortLocator2"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output6",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.WestPortLocator1"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output7",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.WestPortLocator2"
  }],
  "bgColor": "#74B2E2",
  "color": "#000000",
  "stroke": 1,
  "dasharray": null,
  "labels": [{
    labelData: {
      //"id": draw2d.util.UUID.create(),
      "text": "process\n(id)"
    },
    "locator": "draw2d.layout.locator.CenterLocator",
    "type": "WorkflowShape.EditWithPopupLabel"
  }]
}];
/**
 * json template for process Queue flow
 * @type {*[]}
 */
var processQueueJson = [{
  "type": "WorkflowShape.WorkflowProcess",
  //"id": draw2d.util.UUID.create(),
  "x": 100,
  "y": 100,
  "width": 150,
  "height": 60,
  "alpha": 1,
  "angle": 0,
  "userData": {},
  //"cssClass": "WorkflowShape_WorkflowProcess",
  "cssClass": "WorkflowShape_WorkflowProcessqueue",
  "ports": [{
    //"id": draw2d.util.UUID.create(),
    "name": "output0",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthPortLocator1"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output1",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.NorthPortLocator2"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output2",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthPortLocator1"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output3",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.SouthPortLocator2"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output4",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.EastPortLocator1"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output5",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.EastPortLocator2"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output6",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.WestPortLocator1"
  }, {
    //"id": draw2d.util.UUID.create(),
    "name": "output7",
    "port": "WorkflowShape.HybridPort",
    "locator": "WorkflowShape.WestPortLocator2"
  }],
  "bgColor": "#2b669a",
  "color": "#000000",
  "stroke": 1,
  "radius": 10,
  "dasharray": null,
  "labels": [{
    labelData: {
      //"id": draw2d.util.UUID.create(),
      "text": "process\n(id)"
    },
    "locator": "draw2d.layout.locator.CenterLocator",
    "type": "WorkflowShape.EditWithPopupLabel"
  }]
}];

var connectionJson = [{
  "type": "WorkflowShape.Connection",
  //"id": "47e38e43-a50f-26af-7edd-dd5c0cb03f0f",
  "alpha": 1,
  "angle": 0,
  "userData": {},
  "cssClass": "WorkflowShape_Connection",
  "stroke": 2,
  "color": "#00A8F0",
  "outlineStroke": 1,
  "outlineColor": "#303030",
  "policy": "draw2d.policy.line.OrthogonalSelectionFeedbackPolicy",
  // "vertex": [{"x": 560.5, "y": 128}, {"x": 560.5, "y": 293.5}, {"x": 661, "y": 293.5}],
  "router": "draw2d.layout.connection.InteractiveManhattanConnectionRouter",
  "radius": 2,
  "routingMetaData": {
    "routedByUserInteraction": false,
    "fromDir": 2,
    "toDir": 3
  },
  "source": {
    "node": "cb1940ef-d29b-498b-3223-d32b8279bb37",
    "port": "output1"
  },
  "target": {
    "node": "0ae6559a-3e29-6406-efd1-c0d813b6dc45",
    "port": "output3",
    "decoration": "draw2d.decoration.connection.ArrowDecorator"
  },
  "labels": [{
    "labelData": {
      "id": "ead8dfd6-9672-64a1-d224-cfad38eae780",
      "text": "dispatch(3-1)"
    },
    "locator": "draw2d.layout.locator.ManhattanMidpointLocator",
    "type": "WorkflowShape.EditWithPopupLabel"
  }]
}];


/**
 * @class
 * override label, with a customized editor
 */
WorkflowShape.EditWithPopupLabel = draw2d.shape.basic.Label.extend({
  NAME: "WorkflowShape.EditWithPopupLabel",
  DEFAULT_FONT_COLOR: "#ffffff",
  init: function(attr) {
    this._super($.extend({
      stroke: 0,
      width: 1,
      height: 1,
      resizeable: false,
      fontColor: this.DEFAULT_FONT_COLOR,
      text: "action(id)",
      fontSize: 18
    }, attr));
  },
  onDoubleClick: function() {

    if (this.parent.cssClass !== "WorkflowShape_Connection") {
      this.parent.userData.editDialog(this.parent);
    } else {
      //is Connection
      this.parent.getSource().parent.userData.editDialog(this);
    }
  }
});


/**
 * start flow class
 * @class
 * override start node
 */
WorkflowShape.WorkflowStart = draw2d.shape.basic.Circle.extend({
  NAME: "WorkflowShape.WorkflowStart",
  DEFAULT_COLOR: new draw2d.util.Color("#228B22"),
  init: function(attr, setter, getter) {
    this._super($.extend({
      bgColor: this.DEFAULT_COLOR,
      color: this.DEFAULT_COLOR.darker(),
      radius: 50,
      x: 100,
      y: 100
    }, attr), setter, getter);

  },
  getPersistentAttributes: function() {

    var memento = this._super();

    memento.labels = [];
    memento.ports = [];
    memento.userData = $.extend(true, {}, this.userData);
    memento.userData.editDialog = "[[JSON_FUN_PREFIX_" + this.userData.editDialog.toString() + "_JSON_FUN_SUFFIX]]";
    memento.userData.createConnection = "[[JSON_FUN_PREFIX_" + this.userData.createConnection.toString() + "_JSON_FUN_SUFFIX]]";

    this.getPorts().each(function(i, port) {

      memento.ports.push({
        id: port.getId(),
        name: port.getName(),
        port: port.NAME,
        locator: port.getLocator().NAME
      });
    });

    this.children.each(function(i, e) {
      if (e.figure.NAME == "WorkflowShape.EditWithPopupLabel") {
        memento.labels.push({
          labelData: {
            id: e.figure.getId(),
            text: e.figure.getText()
          },
          locator: e.locator.NAME,
          type: e.figure.NAME,
        });
      }

    });
    return memento;
  },
  setPersistentAttributes: function(memento) {

    this._super(memento);
    if (this.id === undefined) {
      this.id = draw2d.util.UUID.create();

    } else {
      this.userData = memento.userData;
      this.userData.editDialog = eval("(" + memento.userData.editDialog.replace("[[JSON_FUN_PREFIX_", "").replace("_JSON_FUN_SUFFIX]]", "") + ")");
      this.userData.createConnection = eval("(" + memento.userData.createConnection.replace("[[JSON_FUN_PREFIX_", "").replace("_JSON_FUN_SUFFIX]]", "") + ")");
    }

    this.resetChildren();

    if (typeof memento.ports !== "undefined") {
      this.resetPorts();
      $.each(memento.ports, $.proxy(function(i, e) {
        var port = eval("new " + e.port + "()");
        var locator = eval("new " + e.locator + "()");
        port.setParent(this);
        this.addPort(port, locator);
        port.setName(e.name);
        port.setId(e.id === undefined ? draw2d.util.UUID.create() : e.id);

        if (e.locator === "WorkflowShape.NorthWestPortLocator" || e.locator === "WorkflowShape.NorthEastPortLocator") {
          port.setConnectionDirection(0);
        }

      }, this));
    }
    $.each(memento.labels, $.proxy(function(i, e) {
      var label = eval("new " + e.type + "( )");
      var locator = eval("new " + e.locator + "(this)");
      label.setId(e.labelData.id === undefined ? draw2d.util.UUID.create() : e.labelData.id);
      label.setText(e.labelData.text);
      this.add(label, locator);
    }, this));
  },
  setNameAndCustomerID: function(text) {

    this.getChildren().get(0).setText(text);
  }

});


WorkflowShape.WorkflowEnd = draw2d.shape.basic.Circle.extend({
  NAME: "WorkflowShape.WorkflowEnd",
  DEFAULT_COLOR: new draw2d.util.Color("#C9302C"),
  init: function(attr, setter, getter) {
    this._super($.extend({
      bgColor: this.DEFAULT_COLOR,
      color: this.DEFAULT_COLOR.darker(),
      radius: 50,
      x: 100,
      y: 100
    }, attr), setter, getter);

  },
  getPersistentAttributes: function() {

    var memento = this._super();

    memento.labels = [];
    memento.ports = [];
    memento.userData = $.extend(true, {}, this.userData);
    memento.userData.editDialog = "[[JSON_FUN_PREFIX_" + this.userData.editDialog.toString() + "_JSON_FUN_SUFFIX]]";
    memento.userData.createConnection = "[[JSON_FUN_PREFIX_" + this.userData.createConnection.toString() + "_JSON_FUN_SUFFIX]]";

    this.getPorts().each(function(i, port) {

      memento.ports.push({
        id: port.getId(),
        name: port.getName(),
        port: port.NAME,
        locator: port.getLocator().NAME
      });
    });

    this.children.each(function(i, e) {
      if (e.figure.NAME == "WorkflowShape.EditWithPopupLabel") {
        memento.labels.push({
          labelData: {
            id: e.figure.getId(),
            text: e.figure.getText()
          },
          locator: e.locator.NAME,
          type: e.figure.NAME,
        });
      }

    });
    return memento;
  },
  setPersistentAttributes: function(memento) {

    this._super(memento);
    if (this.id === undefined) {
      this.id = draw2d.util.UUID.create();

    } else {
      this.userData = memento.userData;
      this.userData.editDialog = eval("(" + memento.userData.editDialog.replace("[[JSON_FUN_PREFIX_", "").replace("_JSON_FUN_SUFFIX]]", "") + ")");
      this.userData.createConnection = eval("(" + memento.userData.createConnection.replace("[[JSON_FUN_PREFIX_", "").replace("_JSON_FUN_SUFFIX]]", "") + ")");
    }
    this.resetChildren();

    if (typeof memento.ports !== "undefined") {
      this.resetPorts();
      $.each(memento.ports, $.proxy(function(i, e) {
        var port = eval("new " + e.port + "()");
        var locator = eval("new " + e.locator + "()");
        port.setParent(this);
        this.addPort(port, locator);
        port.setName(e.name);
        port.setId(e.id === undefined ? draw2d.util.UUID.create() : e.id);
        if (e.locator === "WorkflowShape.NorthWestPortLocator" || e.locator === "WorkflowShape.NorthEastPortLocator") {
          port.setConnectionDirection(0);
        }
      }, this));
    }
    $.each(memento.labels, $.proxy(function(i, e) {
      var label = eval("new " + e.type + "( )");
      var locator = eval("new " + e.locator + "(this)");
      label.setId(e.labelData.id === undefined ? draw2d.util.UUID.create() : e.labelData.id);
      label.setText(e.labelData.text);
      this.add(label, locator);
    }, this));
  },
  setNameAndCustomerID: function(text) {

    this.getChildren().get(0).setText(text);
  }

});


WorkflowShape.WorkflowProcess = draw2d.shape.basic.Rectangle.extend({
  NAME: "WorkflowShape.WorkflowProcess",
  DEFAULT_COLOR: new draw2d.util.Color("#74B2E2"),
  init: function(attr, setter, getter) {
    this._super($.extend({
      bgColor: this.DEFAULT_COLOR,
      color: this.DEFAULT_COLOR.darker(),
      width: 120,
      height: 60,
      x: 200,
      y: 200
    }, attr), setter, getter);

  },
  getPersistentAttributes: function() {

    var memento = this._super();

    memento.labels = [];
    memento.ports = [];
    memento.userData = $.extend(true, {}, this.userData);
    memento.userData.editDialog = "[[JSON_FUN_PREFIX_" + this.userData.editDialog.toString() + "_JSON_FUN_SUFFIX]]";
    memento.userData.createConnection = "[[JSON_FUN_PREFIX_" + this.userData.createConnection.toString() + "_JSON_FUN_SUFFIX]]";

    this.getPorts().each(function(i, port) {

      memento.ports.push({
        id: port.getId(),
        name: port.getName(),
        port: port.NAME,
        locator: port.getLocator().NAME
      });
    });

    this.children.each(function(i, e) {
      if (e.figure.NAME == "WorkflowShape.EditWithPopupLabel") {
        memento.labels.push({
          labelData: {
            id: e.figure.getId(),
            text: e.figure.getText()
          },
          locator: e.locator.NAME,
          type: e.figure.NAME,
        });
      }

    });
    return memento;
  },
  setPersistentAttributes: function(memento) {

    this._super(memento);
    if (this.id === undefined) {
      this.id = draw2d.util.UUID.create();

    } else {
      this.userData = memento.userData;
      this.userData.editDialog = eval("(" + memento.userData.editDialog.replace("[[JSON_FUN_PREFIX_", "").replace("_JSON_FUN_SUFFIX]]", "") + ")");
      this.userData.createConnection = eval("(" + memento.userData.createConnection.replace("[[JSON_FUN_PREFIX_", "").replace("_JSON_FUN_SUFFIX]]", "") + ")");
    }
    this.resetChildren();

    if (typeof memento.ports !== "undefined") {
      this.resetPorts();
      $.each(memento.ports, $.proxy(function(i, e) {
        var port = eval("new " + e.port + "()");
        var locator = eval("new " + e.locator + "()");
        port.setParent(this);
        this.addPort(port, locator);
        port.setName(e.name);
        port.setId(e.id === undefined ? draw2d.util.UUID.create() : e.id);
      }, this));
    }
    $.each(memento.labels, $.proxy(function(i, e) {
      var label = eval("new " + e.type + "( )");
      var locator = eval("new " + e.locator + "(this)");
      label.setId(e.labelData.id === undefined ? draw2d.util.UUID.create() : e.labelData.id);
      label.setText(e.labelData.text);
      this.add(label, locator);
    }, this));
  },
  setNameAndCustomerID: function(text) {

    this.getChildren().get(0).setText(text);
  }
});


WorkflowShape.WorkflowProcessQueue = draw2d.shape.basic.Rectangle.extend({
  NAME: "WorkflowShape.WorkflowProcessQueue",
  DEFAULT_COLOR: new draw2d.util.Color("#2b669a"),
  init: function(attr, setter, getter) {
    this._super($.extend({
      bgColor: this.DEFAULT_COLOR,
      color: this.DEFAULT_COLOR.darker(),
      width: 120,
      height: 60,
      x: 200,
      y: 200
    }, attr), setter, getter);
  },
  getPersistentAttributes: function() {

    var memento = this._super();

    memento.labels = [];
    memento.ports = [];
    memento.userData = $.extend(true, {}, this.userData);
    memento.userData.editDialog = "[[JSON_FUN_PREFIX_" + this.userData.editDialog.toString() + "_JSON_FUN_SUFFIX]]";
    memento.userData.createConnection = "[[JSON_FUN_PREFIX_" + this.userData.createConnection.toString() + "_JSON_FUN_SUFFIX]]";

    this.getPorts().each(function(i, port) {

      memento.ports.push({
        id: port.getId(),
        name: port.getName(),
        port: port.NAME,
        locator: port.getLocator().NAME
      });
    });

    this.children.each(function(i, e) {
      if (e.figure.NAME == "WorkflowShape.EditWithPopupLabel") {
        memento.labels.push({
          labelData: {
            id: e.figure.getId(),
            text: e.figure.getText()
          },
          locator: e.locator.NAME,
          type: e.figure.NAME,
        });
      }

    });
    return memento;
  },
  setPersistentAttributes: function(memento) {

    this._super(memento);
    if (this.id === undefined) {
      this.id = draw2d.util.UUID.create();

    } else {
      this.userData = memento.userData;
      this.userData.editDialog = eval("(" + memento.userData.editDialog.replace("[[JSON_FUN_PREFIX_", "").replace("_JSON_FUN_SUFFIX]]", "") + ")");
      this.userData.createConnection = eval("(" + memento.userData.createConnection.replace("[[JSON_FUN_PREFIX_", "").replace("_JSON_FUN_SUFFIX]]", "") + ")");
    }
    this.resetChildren();

    if (typeof memento.ports !== "undefined") {
      this.resetPorts();
      $.each(memento.ports, $.proxy(function(i, e) {
        var port = eval("new " + e.port + "()");
        var locator = eval("new " + e.locator + "()");
        port.setParent(this);
        this.addPort(port, locator);
        port.setName(e.name);
        port.setId(e.id === undefined ? draw2d.util.UUID.create() : e.id);
      }, this));
    }
    $.each(memento.labels, $.proxy(function(i, e) {
      var label = eval("new " + e.type + "( )");
      var locator = eval("new " + e.locator + "(this)");
      label.setId(e.labelData.id === undefined ? draw2d.util.UUID.create() : e.labelData.id);
      label.setText(e.labelData.text);
      this.add(label, locator);
    }, this));
  },
  setNameAndCustomerID: function(text) {

    this.getChildren().get(0).setText(text);
  }
});


WorkflowShape.HybridPort = draw2d.HybridPort.extend({
  NAME: "WorkflowShape.HybridPort",
  init: function(attr, setter, getter) {
    this._super(attr, setter, getter);
    //this.locator=new draw2d.layout.locator.InputPortLocator();


    //this.setConnectionDirection(0);
  },
  onCatch: function(droppedFigure, x, y, shiftKey, ctrlKey) {

    this.parent.userData.createConnection(droppedFigure, this);
    // return false;
  }
});


WorkflowShape.Connection = draw2d.Connection.extend({
  NAME: "WorkflowShape.Connection",
  init: function(attr) {

    this._super(attr);

    this.setRouter(new draw2d.layout.connection.InteractiveManhattanConnectionRouter());
    this.setOutlineStroke(1);
    this.setOutlineColor("#303030");
    this.setStroke(2);
    this.setColor('#00A8F0');
    this.setRadius(2);
    //this.setSourceDecorator();
    this.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator());
    this.getStartAngle();
    this.getEndAngle();
    //add label
    this.add(new WorkflowShape.EditWithPopupLabel({
      fontColor: "#000000",
      bgColor: "#ffffff"
    }), new draw2d.layout.locator.ManhattanMidpointLocator(this));
    this.userData = {};


  },
  getPersistentAttributes: function() {

    var memento = this._super();

    memento.labels = [];

    this.children.each(function(i, e) {
      if (e.figure.NAME == "WorkflowShape.EditWithPopupLabel") {
        memento.labels.push({
          labelData: {
            id: e.figure.getId(),
            text: e.figure.getText()
          },
          locator: e.locator.NAME,
          type: e.figure.NAME,
        });
      }

    });
    return memento;
  },
  setPersistentAttributes: function(memento) {

    this._super(memento);
    // this.setStartPoint(memento.userData.sourcePort.x,memento.userData.sourcePort.y);
    this.resetChildren();


    $.each(memento.labels, $.proxy(function(i, e) {
      var label = eval("new " + e.type + "( )");
      var locator = eval("new " + e.locator + "(this)");
      label.setId(e.labelData.id);
      label.setText(e.labelData.text);
      label.setFontColor("#000000");
      label.setBackgroundColor("#ffffff");
      this.add(label, locator);
    }, this));
  },
  onDoubleClick: function() {

    /*if (this.parent.cssClass !== "WorkflowShape_Connection") {
     this.parent.userData.editDialog(this.parent);
     } else {
     //is Connection
     this.parent.getSource().parent.userData.editDialog(this);
     }*/
  }
});


/**
 * @class
 *
 * create my own implementation for the locators and use this for the port position
 * calculation
 */
WorkflowShape.NorthPortLocator = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.NorthPortLocator",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    this.applyConsiderRotation(figure, figure.getParent().getWidth() / 2, 0);
  }
});


WorkflowShape.SouthPortLocator = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.SouthPortLocator",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    var p = figure.getParent();
    this.applyConsiderRotation(figure, p.getWidth() / 2, p.getHeight());
  }
});

WorkflowShape.EastPortLocator = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.EastPortLocator",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    var p = figure.getParent();

    this.applyConsiderRotation(figure, p.getWidth(), p.getHeight() / 2);
  }
});

WorkflowShape.WestPortLocator = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.WestPortLocator",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    var p = figure.getParent();

    this.applyConsiderRotation(figure, 0, p.getHeight() / 2);
  }
});

WorkflowShape.NorthEastPortLocator = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.NorthEastPortLocator",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    this.applyConsiderRotation(figure, figure.getParent().getWidth() * (1 + Math.SQRT1_2) / 2, figure.getParent().getWidth() * (1 - Math.SQRT1_2) / 2);
  }
});

WorkflowShape.NorthWestPortLocator = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.NorthWestPortLocator",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    this.applyConsiderRotation(figure, figure.getParent().getWidth() * (1 - Math.SQRT1_2) / 2, figure.getParent().getWidth() * (1 - Math.SQRT1_2) / 2);
  }
});

WorkflowShape.SouthEastPortLocator = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.SouthEastPortLocator",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    this.applyConsiderRotation(figure, figure.getParent().getWidth() * (1 + Math.SQRT1_2) / 2, figure.getParent().getWidth() * (1 + Math.SQRT1_2) / 2);
  }
});

WorkflowShape.SouthWestPortLocator = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.SouthWestPortLocator",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    this.applyConsiderRotation(figure, figure.getParent().getWidth() * (1 - Math.SQRT1_2) / 2, figure.getParent().getWidth() * (1 + Math.SQRT1_2) / 2);
  }
});


/***
 * the gap
 * @type {number}
 */
WorkflowShape.LocatorGap = 10;

/***
 *  process port north
 * @type {*|void|Object}
 * create by wong
 */
WorkflowShape.NorthPortLocator1 = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.NorthPortLocator1",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    this.applyConsiderRotation(figure, figure.getParent().getWidth() / 2 + WorkflowShape.LocatorGap, 0);
  }
});

WorkflowShape.NorthPortLocator2 = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.NorthPortLocator2",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    this.applyConsiderRotation(figure, figure.getParent().getWidth() / 2 - WorkflowShape.LocatorGap, 0);
  }
});

WorkflowShape.SouthPortLocator1 = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.SouthPortLocator1",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    var p = figure.getParent();
    this.applyConsiderRotation(figure, p.getWidth() / 2 + WorkflowShape.LocatorGap, p.getHeight());
  }
});

WorkflowShape.SouthPortLocator2 = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.SouthPortLocator2",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    var p = figure.getParent();
    this.applyConsiderRotation(figure, p.getWidth() / 2 - WorkflowShape.LocatorGap, p.getHeight());
  }
});


WorkflowShape.EastPortLocator1 = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.EastPortLocator1",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    var p = figure.getParent();

    this.applyConsiderRotation(figure, p.getWidth(), p.getHeight() / 2 + WorkflowShape.LocatorGap);
  }
});

WorkflowShape.EastPortLocator2 = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.EastPortLocator2",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    var p = figure.getParent();

    this.applyConsiderRotation(figure, p.getWidth(), p.getHeight() / 2 - WorkflowShape.LocatorGap);
  }
});

WorkflowShape.WestPortLocator1 = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.WestPortLocator1",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    var p = figure.getParent();

    this.applyConsiderRotation(figure, 0, p.getHeight() / 2 + WorkflowShape.LocatorGap);
  }
});

WorkflowShape.WestPortLocator2 = draw2d.layout.locator.PortLocator.extend({
  NAME: "WorkflowShape.WestPortLocator2",
  init: function() {
    this._super();
  },
  relocate: function(index, figure) {
    var p = figure.getParent();

    this.applyConsiderRotation(figure, 0, p.getHeight() / 2 - WorkflowShape.LocatorGap);
  }
});
