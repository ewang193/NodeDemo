var dataTable_a;
var dataTableOption;
$(function(){
  init();
  function init(){
    getWorkflowData();
  }
})

function getWorkflowData() {
  dataTableOption = {
    oLanguage: {
      sZeroRecords: "No records found. Create a workflow",
    },
    sDom: "t",
    iDisplayLength: 10,
    bAutoWidth: false,
    responsive: true,
    bSort: false,
    bFilterOnEnter: true,
    processing: False,
    serverSide: false
  };

  dataTableOption.columns = [{
    "data": "name"
  }, {
    "data": "flowUID"
  }, {
    "data": "flowUID"
  }, {
    "data": "flowUID"
  }, {
    "data": "flowUID"
  }];

  dataTableOption.aoColumnDefs = [{
    fnCreateCell: function(nTd, sData, oData, iRow, iCol){
      $(nTd).text(oData.flowPoints.length)
    },
    aTargets:[1]
  }, {
    fnCreatedCell: function(nTd, sData, oData, iRow, iCol){
      $(nTd).text(oData.flowEvents.length)
    },
    aTargets: [2]
  }, {
    fnCreatedCell: function(nTd, sData, oData, iRow, iCol){
      var sHtml = '<input type="checkbox" id="test' + sData + '" value="' + sData + '"/><label for="test' + sData +'"></label>';
      s(nTd).html(sHtml);
    },
    aTargets: [3]
  }, {
    fnCreatedCell: function(nTd, sData, oData, iRow, iCol){
      var sHtml = '<a href="javascript:void(0)" data-flowuid="' + sData + '" onclick="editWorkflow(this)" class="removeFilter"><i class="fa fa-pencil"></i></a>';
      sHtml += '<a href="javascript:void(0)" data-flowuid="' + sData + '" onclick="openDeleteModal(this)" class="removeFilter"><i class="fa fa-trash-o"></i></a>';
      $(nTd).html(sHtml);
    },
    aTargets: [4]
  }];

  $.ajax({
    type: "get",
    url: __RAID__.APIRoot + "/workflow/getWorkflows",
    dataType: 'json',
    success: function(res){
      if(res.code == 0){
        dataTableOption.data = res.data;
        dataTable_a = $("#workflowTable").DataTable(dataTableOption);
      }
    },
    error: function(res){
      console.log(res);
    }
  });
}

function editWorkflow(dom) {
  var flowUID = $(dom).attr("data-flowuid");
  $("#input-edit-workflowUID").val(flowUID);
  $("#form-edit-workflow").submit();
}

function openDeleteModal(dom){
  var flowUID = $(dom).attr("data-flowuid");
  $("#delete-flow-id").val(flowUID);
  $("#deleteModal").modal('show');
}

function deleteWorkflow(){
  var ajaxOption = {
    url: __RAID__.APIRoot + "/workflow/deleteWorkflow",
    data: {
      flowUID: $("#delete-flow-id").val()
    },
    dataType: 'json',
    method: "post",
    success: function(res){
      if(res.code == 0){
        $('#workflowTable').DataTable().destory();
        getWorkflowData();
        $('#deleteModal').modal('hide');
      } else {
        console.log(data);
      }
    },
    error: function(err){
      console.log(err);
    }
  };
  $.ajax(ajaxOption);
}

function createWorkflow(){
  location.href = __RAID__.APIRoot + "/workflow/workflowDesigner";
}
