var Workflow = {
  canvas: {},
  writer: new draw2d.io.json.Writer(),

  init: function(id, setting){
    Workflow.canvas = new draw2d.Canvas(id);

    Workflow.canvas.installEditPolicy(new draw2d.policy.canvas.CoronaDecorationPolicy());

    this.canvas.installEditPolicy(new draw2d.policy.connection.DragConnectionCreatePolicy({
      createConnection: function() {
        return new WorkflowShape.Connection();
      }
    }));
  },

  processQueue: function(setting){
    var reader = new draw2d.io.json.Reader();

    var flow = JSON.parse(JSON.stringify(processQueueJson));

    if(setting.id === undefined){
      setting.name = setting.name === "" ? "Process Queue": setting.name;
      setting.customerID = setting.customerID === "" ? "id": setting.customerID;

      flow[0].labels[0].labelData.text = setting.name + "\n(" + setting.customerID + ")";
      flow[0].userData = setting;

      reader.unmarshal(Workflow.canvas, flow);
    } else {
      var figure = Workflow.canvas.getFigure(setting.id);
      $.extend(figure.userData, setting);
      var text = setting.name + "\n(" + setting.customerID + ")";
      figure.setNameAndCustomerID(text);
    }
  },

  connection: function(setting){
    if(setting.id != undefined) {
      setting.label.setText(setting.name + "(" + setting.customerID + ")");
      setting.label.parent.userData = {"name": setting.name, "customerID": setting.customerID};
    } else {
      var sourceConnections = setting.connection.sourcePort.getConnections();
      var targetConnections = setting.connection.targetPort.getConnections();

      var commandConnection ={};

      $.each(sourceConnections.data, function(k, v){
        for(var i=0; i< targetConnections.data.length; i++) {
          if(v == targetConnections.data[i])
            commandConnection = v;
        }
      });
      commandConnection.userData = {"name": setting.name, "customerID": setting.customerID};
      var label = commandConnection.children.data[0];
      label.figure.setText(setting.name + "(" + setting.customerID + ")");
    }
  },

  startFlow: function(setting){
    var reader = new draw2d.io.json.Reader();
    var flow = JSON.parse(JSON.stringify((startJson)));

    if(setting.id === undefined) {
      setting.name = setting.name === "" ? "Start" : setting.name;
      setting.customerID = setting.customerID === "" ? "Id" : setting.customerID;

      flow[0].labels[0].labelData.text = setting.name + "\n(" + setting.customerID + ")";
      flow[0].userData = setting;

      reader.unmarshal(Workflow.canvas, flow);
    } else {
      var figure = Workflow.canvas.getFigure(setting.id);
      $.extend(figure.userData, setting);
      var text = setting.name + "\n(" + setting.customerID + ")";
      figure.setNameAndCustomerID(text);
    }
  },
  endFlow: function(setting){
    var reader = new draw2d.io.json.Reader();
    var flow = JSON.parse(JSON.stringify((endJson)));

    if (setting.id === undefined) {
      setting.name = setting.name === "" ? "End" : setting.name;
      setting.customerID = setting.customerID === "" ? "id" : setting.customerID;

      flow[0].labels[0].labelData.text = setting.name + "\n(" + setting.customerID + ")";
      flow[0].userData = setting;

      reader.unmarshal(Workflow.canvas, flow);
    } else {
      //edit

      var figure = Workflow.canvas.getFigure(setting.id);
      $.extend(figure.userData, setting);
      var text = setting.name + "\n(" + setting.customerID + ")";
      figure.setNameAndCustomerID(text);
    }
  },
  processFlow: function(setting){
    var reader = new draw2d.io.json.Reader();
    var flow = JSON.parse(JSON.stringify((processJson)));
    //
    if (setting.id === undefined) {
      setting.name = setting.name === "" ? "Process" : setting.name;
      setting.customerID = setting.customerID === "" ? "id" : setting.customerID;

      flow[0].labels[0].labelData.text = setting.name + "\n(" + setting.customerID + ")";
      flow[0].userData = setting;

      reader.unmarshal(Workflow.canvas, flow);
    } else {
      //edit

      var figure = Workflow.canvas.getFigure(setting.id);
      $.extend(figure.userData, setting);
      var text = setting.name + "\n(" + setting.customerID + ")";
      figure.setNameAndCustomerID(text);
    }
  },

  readWorkflow: function(workflow){
    Workflow.canvas.clear();
    var reader = new draw2d.io.json.Reader();
    reader.unmarshal(Workflow.canvas, workflow);
  },
  writeWorkflow: function(){
    var result = [];
    Workflow.canvas.getFigures().each(function(i, figure) {
      result.push(figure.getPersistentAttributes());
    });
    Workflow.canvas.getLines().each(function(i, element) {
      result.push(element.getPersistentAttributes());
    });
    var base64Content = draw2d.util.Base64.encode(JSON.stringify(result, null, 2));
    return result;
  },
  createImage: function(workflow){

  },
  deleteSelectedFigure: function(){
    this.canvas.getSelection().getAll().each(function(i, obj) {
      new draw2d.command.CommandDelete(obj).execute()
    });
  }

}
