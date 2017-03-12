cronosAPIUrl = $('#CRONOS_API_URL').val();
pGuid = $('#CRONOS_PGUID').val();
uGuid = $('#currentUser').val();

$(function(){
  var resultsTable;
  var workflows;
  init();

  function init() {

    getWorkflows();

    $(".caseBtn").on("click", function(){
      getCase();
    });

    $("#assignButton").on("click", function(){
      addEvents();
    });

    $('#checkbox-selectAll').on('change', function(){
      //Get all row with search applied
      var rows = resultsTable.rows({'search': 'applied'}).nodes();
      //check/uncheck checkboxes for all rows in the table
      $('input:checkbox:enabled', rows).prop('checked', this.checked);
    });
  }

  function getWorkflows(){
    $.ajax({
      url: __CRONOS__.APIRoot + "/getWorkflows",
      success: function(res){
        workflows = JSON.parse(res).data;
        if(workflows){
          getWorkflowData(workflows);
        } else {
          getWorkflowData([]);
        }
      },
      error: function(err){
        console.log(err);
      }
    })
  }

  function getWorkflowData(data){
    var dataTableOption = {
      oLanguage: {
        sZeroRecords: "No records found. Create a workflow"
      },
      sDom: "t",
      iDisplayLength: 10,
      bAutoWidth: false,
      responsive: true,
      bSort: false,
      processing: false
    };
    dataTableOption.data = data;

    dataTableOption.columns = [{
      "data": "name"
    },{
      "data": "flowUID"
    }, {
      "data": "flowPoints"
    },
      {
        "data": "flowUID"
      }];

    dataTableOption.aoColumnDefs = [{
      fnCreatedCell: function(nTd, sData, oData, iRow, iCol){
        $(nTd).text(oData.flowPoints.length)
      },
      aTargets: [1]
    }, {
      fnCreatedCell: function(nTd, sData, oData, iRow, iCol){
        var sHtml = '<select class="removeFilter"><i class="fa fa-compress"></i>';
        for(var item in sData){
          sHtml += '<option value="' + sData[item].uid + '">' + sData[item].name + '</option>';
        }
        sHtml += '</select>';
        $(nTd).html(sHtml);
      },
      aTargets: [2]
    }, {
      fnCreatedCell: function(nTd, sData, oData, iRow, iCol){
        var sHtml = '<input type="radio" name="flowID" value="' + sData + '"/>';
        $(nTd).html(sHtml);
      },
      aTargets: [3]
    }];

    $("#workflowProcessTable").DataTable(dataTableOption);

    $("#workflowProcessTable").on("focus", 'select', function(){
      $('workflowProcessTable input').each(function(){
        $(this).attr("checked", false);
      });
      $(this).parent().parent().find("input").trigger("click");
      getNextEvent(workflows);
    })
    $("#workflowProcessTable").on("click", 'input', function(){
      getNextEvent(workflows);
    })
  }

  function getNextEvent(workflows){
    var nextEvents;
    var eventList = [];
    var btn = $("input[type='radio'][name='flowID']:checked");
    var sHtml = "<select><option>Select Event</option>";
    if(btn.length){
      var flowID = btn.val();
      var pointID = btn.parent().parent().find("select").val();
      for(var item in workflows){
        if(workflows[item].flowUID == flowID){
          for(var i in workflows[item].flowPoints){
            if(workflows[item].flowPoints[i].uid == pointID) {
              nextEvents = workflows[item].flowPoints[i].events;
            }
          }
          for(var i in nextEvents){
            for(var n in workflows[item].flowEvents) {
              if(nextEvents[i] == workflows[item].flowEvents[n].uid) {
                eventList.push(workflows[item].flowEvents[n]);
              }
            }
          }
        }
      }

      for(var item in eventList){
        sHtml += '<option value="' + eventList[item].uid + '">' + eventList[item].name + '</option>';
      }
      sHtml += "</select>";
      $("#nextEvent").find("select").html(sHtml);
    } else {
      sHtml += "</select>";
      $("#nextEvent").find("select").html(sHtml);
    }
  }

  function getCase() {
    var btn = $("input[type='radio'][name='flowID']:checked");
    var pointID = btn.parent().parent().find("select").val();
    var currentList = [];

    $.ajax({
      url: "/CRONOS/workflowProcess/getFilterTable",
      data: {
        pointId: pointID
      },
      method: 'get',
      success: function(res){
        console.log(res.msg);
        $("#searchCaseResult").DataTable().destory();
        if(res != null) {
          currentList.push(res);
          getCaseData(currentList);
        } else {
          getCaseData([]);
        }
      },
      error: function(err){
        console.log(err);
      }
    })
  }

  function getCaseData(data){
    var dataTableOption = {
      oLanguage: {
        sZeroRecords: "No records found"
      },
      sDom: '<"top"i>rt<"bottom"flp><"clear">',
      iDisplayLength: 10,
      bAutoWidth: false,
      responsive: true,
      bSort: false,
      processing: false
    };

    dataTableOption.data = JSON.parse(data);
    dataTableOption.columns = [{
      "data": "cnumber"
    }, {
      "data": "cownername"
    }, {
      "data": "cdate",
        render: function(data, type, full){
          return formatDate(data);
        }
    }, {
      "data": "type"
    }, {
      "data": "cstatus"
    }, {
      "data": "ctotalliability"
    }, {
      "data": "oguid"
    }];
    dataTableOption.aoColumnDefs = [{
      fnCreatedCell: function(nTd, sData, oData, iRow, iCol){
        var sHtml = '<input type="checkbox" value="' + sData +'"/>';
        $(nTd).html(sHtml);
      },
      aTargets: [6]
    }, {
      "aTargets": [0],
      "mRender": function(data, type, full){
        return '<a href="/CRONOS/case-summary/' + encodeURIComponent(full.oguid) + '">' + full.cnumber + '</a>';
      }
    }];

    resultsTable = $("#searchCaseResult").DataTable(dataTableOption);
  }

  function addEvents(){
    var rows = resultsTable.rows({'search': 'applied'}).nodes();
    var selectItems = $('input:checkbox:enabled:checked', rows).map(function(){
      return $(this).val();
    }).get();
    var eventId = $("#nextEvent").find("select").val();
    var btn = $("input[type='radio'][name='flowID']:checked");
    var flowID = btn.val();
    var pointID = btn.parent().parent().find("select").val();
    $.ajax({
      url: __CRONOS__.APIRoot + '/workflowProcess/addEvents',
      data: {
        point_id: pointID,
        flow_id: flowID,
        event_id: eventId,
        objects: selectItems
      },
      method: 'post',
      success: function(res){
        console.log(res);
        getCase();
      },
      error: function(err){
        console.log(err);
      }
    })
  }




})
