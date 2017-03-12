$(function(){

  init();
  var surveyList = [];

  function init(){
    getSurveyData();
    $("#btn-delete-survey").on("click", function(){
      var ajaxOption = {
        url: __CERBERUS__.APIRoot + "/survey/deleteSurvey",
        data: {
          suGuid: $("#delete-survey-id").val()
        },
        dataType: 'json',
        method: "post",
        success: function(data){
          if(data.code == 0){
            $('#surveyTable').DataTable().destroy();
            $('#surveyResponseTable').DataTable().destroy();
            $('#deleteModal').modal('hide');
            getSurveyData();
          }
        },
        error: function(err){
          console.log(err);
        }
      };
      $.ajax(ajaxOption);
    });
  }

  function getSurveyData(){
    var dataTableOption = {
      sDom: "t",
      iDisplayLength: 10,
      bAutoWidth: false,
      responsive: true,
      bSort: false,
      bFilterOnEnter: true,
      paging: false,
      processing: false
    };

    dataTableOption.columns = [{
      "data": "name"
    },{
      "data": "desc"
    }, {
      "data": "uuid"
    }];

    dataTableOption.aoColumnDefs = [{
      fnCreatedCell: function(nTd, sData, oData, iRow, iCol) {
        var sHtml = '<a href="javascript:void(0)" class="removeFilter" data-suGuid="' + sData + '" onclick="editSurvey(this)"><i class="fa fa-pencil"></i></a>';
        sHtml += '<a href="javascript:void(0)" class="removeFilter" data-suGuid="' + sData + '" onclick="openDeleteModal(this)"><i class="fa fa-trash-o"></i></a>';
        sHtml += '<a class="removeFilter" data-suGuid="' + sData + '" href="/CERBERUS/survey/doSurvey/' + sData + '"><i class="fa fa-arrow-right"></i></a>';
        $(nTd).html(sHtml);
      },
      aTargets: [2]
    }];

    var ajaxOption = {
      url: __CERBERUS__.APIRoot + "/survey/getSurveys",
      dataType: 'json',
      method: "get",
      success: function(res){
        if(res.data.code == 0){
          dataTableOption.data = res.data.data;
          $("#surveyTable").DataTable(dataTableOption);
          $('#deleteModal').modal("hide");
          if(res.data.data){
            res.data.data.forEach(function(item){
              surveyList.push({
                name: item.name,
                uuid: item.uuid
              });
            });
          }
        } else {
          dataTableOption.data = [];
          $("#surveyTable").DataTable(dataTableOption);
        }
        $.ajax({
          url: __CERBERUS__.APIRoot + "/survey/getAllSurveyObj",
          dataType: 'json',
          data: {
            survey: surveyList
          },
          method: 'post',
          success: function(res){
            if(res.code == 0){
              getSurveyObjectData(res.data);
            } else {
              getSurveyObjectData([]);
            }
            surveyList = [];
          },
          error: function(err){
            console.log(err);
          }
        })
      },
      error: function(err){
        console.log(err);
      }
    };
    $.ajax(ajaxOption);
  }

  function getSurveyObjectData(data) {
    var dataTableOption = {
      sDom: "t",
      iDisplayLength: 10,
      bAutoWidth: false,
      responsive: true,
      bSort: false,
      bFilterOnEnter: true,
      paging: false,
      processing: false
    };

    dataTableOption.columns = [{
      "data": "name"
    }, {
      "data": "resStatus"
    }, {
      "data": "createAt"
    }, {
      "data": "oGuid"
    }];

    dataTableOption.aoColumnDefs = [{
      fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
        $(nTd).html(formatDate(sData));
      },
      aTargets: [2]
    }, {
      fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
        var sHtml = '<a href="/CERBERUS/survey/survey-ans/' + sData + '" class="removeFilter" data-suGuid="' + sData + '"><i class="fa fa-eye" aria-hidden="true"></i></a>';
        $(nTd).html(sHtml);
      },
      aTargets: [3]
    }];
    dataTableOption.data = data;
    $("#surveyResponseTable").DataTable(dataTableOption)
  }

  })

function editSurvey(dom) {
  var suGuid = $(dom).attr("data-suGuid");
  $("#input-edit-surveyID").val(suGuid);
  $("#form-edit-survey").submit();
}

function openDeleteModal(dom){
  var suGuid = $(dom).attr("data-suGuid");
  $("#delete-survey-id").val(suGuid);
  $("#deleteModal").modal("show");
}

function createSurvey(){
  location.href = __CERBERUS__.APIRoot + "/survey/surveyDesigner";
}

