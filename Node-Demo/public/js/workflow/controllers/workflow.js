window.targetProperty = new Object();
window.project = new Object();

//for data transfer
var self = {
  flowPoint: function (obj) {
    var j = {
      uid: obj.id,
      type: obj.type, //obj.userData.type or obj.type
      name: obj.userData.name,
      print: obj.userData.name + "(" + obj.userData.customerID + ")",
      flowid: obj.userData.customerID,
      rGuid: obj.userData.rGuid,
      api: '',
      events: [],
      description: '',
      attributes: {
        x: obj.x,
        y: obj.y,
        height: obj.height,
        width: obj.width,
        color: obj.color,
        shape: obj.userData.type
      }
    }
    return j
  },
  flowEvent: function (obj) {
    var j = {
      uid: obj.id, //obj.labels.type
      type: obj.type,
      name: obj.userData.name,
      print: obj.labels.length > 0 ? obj.labels[0].labelData.text : "",
      flowid: obj.userData.customerID,
      api: '',
      endpoint: obj.target.node,
      description: '',
    }
    return j;

  },
  draw2dToModel: function (draw2dObj) {
    var flowEvents = [];
    var tempEvents = {};
    var tempPoints = {};
    var staticMapping = {
      "WorkflowShape.WorkflowStart": 1,
      "WorkflowShape.WorkflowEnd": 1,
      "WorkflowShape.WorkflowProcess": 1,
      "WorkflowShape.Connection": 2,
    }
    for (var i in draw2dObj) {
      var o = draw2dObj[i];
      if (staticMapping[o.type] === 1) {
        tempPoints[o.id] = self.flowPoint(o);
      } else {
        tempEvents[o.id] = o;
      }
    }


    for (var key in tempEvents) {
      var o = tempEvents[key];
      flowEvents.push(self.flowEvent(o));
      tempPoints[o.source.node].events.push(o.id);
    }

    var flowPoints = Object.keys(tempPoints).map(function (k) {
      return tempPoints[k]
    });

    return {"flowEvents": flowEvents, "flowPoints": flowPoints}

  }
}

$(function () {
  var initClick = function () {
    saveProjectClick();
    btnCancelClick();
    btnStartClick();
    btnEndClick();
    btnProcessQueueClick();
    btnProcessPointClick();
    btnDeleteClick();
    savePropertyClick();
    btnSaveProjectClick();
  }


  /**
   * initial create and edit
   */
  var initial = function () {
    Workflow.init("canvas", targetProperty);

    window.flowUID = $("#flowUID").val();
    initialEdit(flowUID);
  };


// when edit
  var initialEdit = function (flowUID) {

    if (flowUID != undefined && flowUID.length > 0) {
      var sendData = {
        "flowUID": flowUID
      }
      $.ajax({
        url: __RAID__.APIRoot+"/workflow/getWorkflow",
        method: "post",
        data: sendData,
      }).done(function (res) {
        if(res.code == 0) {
          project = res.data;
          setWorkflowHeader();
          Workflow.readWorkflow(project.draw2d);
        } else {
          console.log(res);
        }
      }).fail(function (data) {
        console.log(data);
      });
    }
  }


  var setWorkflowHeader = function () {
    $("#projectName").html(project.name);
  }

  var saveProjectClick = function () {

    $("#btnSaveProject").click(function () {
      setProjectValueToDialog();
      $("#projectDialog").modal("show");
    });

  }


  var setProjectValueToDialog = function () {
    $("#projectID").val(project.name);
    $("#type").val(project.type);
    $("#description").html(project.description);
  }

  var btnDeleteClick = function () {

    $("#btnDelete").click(function () {
      Workflow.deleteSelectedFigure();
    });

  }


  var btnCancelClick = function () {

    $("#btnCancel").click(function () {
      location.href = __RAID__.APIRoot+"/workflow/workflows";
    });

  };


  var btnStartClick = function () {

    $("#start-button").click(function () {
      window.targetProperty = new Object();
      targetProperty.title = "Start Flow.";
      targetProperty.type = "startFlow";
      openCreateDialog(targetProperty);
    });
  }

//click end button
  var btnEndClick = function () {

    $("#end-button").click(function () {
      window.targetProperty = new Object();
      targetProperty.title = "End Flow.";
      targetProperty.type = "endFlow";
      openCreateDialog(targetProperty);
    });

  }

//click process button
  var btnProcessPointClick = function () {

    $("#process-point-button").click(function () {
      window.targetProperty = new Object();
      targetProperty.title = "Process Flow.";
      targetProperty.type = "processFLow";
      openCreateDialog(targetProperty);
    });
  }

//click processQueue button
  var btnProcessQueueClick = function () {
    $("#process-queue-button").click(function () {
      window.targetProperty = new Object();
      targetProperty.title = "Process Queue.";
      targetProperty.type = "processQueue";
      openCreateDialog(targetProperty);
    });
  }

  window.targetPropertyDialogInit=function() {
    $("#propertyDialogLabel").html(targetProperty.title);
    $("#propertyName").val(targetProperty.name);
    $("#propertyID").val(targetProperty.customerID);
    $("#processStartRole").val(targetProperty.rGuid);
  }

  var openCreateDialog = function (targetProperty) {
    targetProperty.name = "";
    targetProperty.customerID = "";
    targetProperty.editDialog = openEditDialog;
    targetPropertyDialogInit();
    $("#propertyDialog").modal("show");
  }




//save property
  var savePropertyClick = function () {

    $("#btnSaveProperty").click(function () {
      $("#propertyDialog").modal("hide");
      targetProperty.createConnection = createConnection;
      setTargetPropertyDialog();
      Workflow[targetProperty.type]($.extend(true, {}, targetProperty));
    });
  }

  var setTargetPropertyDialog = function () {
    targetProperty.name = $("#propertyName").val();
    targetProperty.customerID = $("#propertyID").val();
    targetProperty.rGuid = $("#processStartRole").val();
  }

  var createConnection = function (sPort, tPort) {
    targetProperty.type = "connection";
    targetProperty.title = "Connection";
    targetProperty.name = "";
    targetProperty.customerID = "";
    targetProperty.id = undefined;
    targetProperty.connection = {};
    targetProperty.connection.sourcePort = sPort;
    targetProperty.connection.targetPort = tPort;
    targetPropertyDialogInit();
    $("#propertyDialog").modal("show");
  }


  /**
   * click save project
   */
  var btnSaveProjectClick = function () {
    $("#btnSaveWorkflow").click(function () {
      var result = Workflow.writeWorkflow();
      var model = self.draw2dToModel(result);
      project.draw2d = JSON.stringify(result);
      project.flowEvents = model.flowEvents;
      project.flowPoints = model.flowPoints;
      setProjectValue();
      console.log(result);
      $.ajax({
        url: __RAID__.APIRoot+"/workflow/saveOrUpdateWorkflow",
        data: project,
        method: "post"
      }).done(function (data) {
        $("#projectDialog").modal("hide");
        console.log(data);
        setWorkflowHeader();
        $("#messageDialog").modal("show");
      }).fail(function (data) {
        console.log(data);
      });

    });

  }


  var setProjectValue = function () {
    project.name = $("#projectID").val();
    project.type = $("#type").val();
    project.description = $("#description").val();
  }


  var openEditDialog = function (setting) {
    window.targetProperty = new Object();
    $("#propertyDialog").modal("show");

    if (setting.cssClass == "WorkflowShape_EditWithPopupLabel") {
      targetProperty.id = setting.id;
      targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf("(") + 1, setting.text.lastIndexOf(")"));
      targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf("("));
      targetProperty.type = "connection";
      targetProperty.title = "Connection";
      targetProperty.label = setting;
    } else {
      targetProperty.id = setting.id;
      targetProperty.customerID = setting.userData.customerID;
      targetProperty.name = setting.userData.name;
      targetProperty.type = setting.userData.type;
      targetProperty.title = setting.userData.title;
      targetProperty.rGuid = setting.userData.rGuid;
    }
    targetPropertyDialogInit();
  }


  var howToUsebinding = function () {
    $("#btnHowToUse").click(function () {
      $("#howToUse").toggle();
    });
  }


  initial();
  initClick();
  howToUsebinding();
});
