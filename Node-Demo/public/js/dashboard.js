$(function(){
  // var rootPath = tools.path.rootPath;
  // var casepath = tools.path.case;
  // var dashboardPath = tools.path.dashboard;
  var color = ["#ae2727", "#999999", "#EFEFEF", "#666666", "#990099"];

  var aggregatedBarChartData = [],
    aggregatedDonutInner = [],
    aggregatedDonutOuter = [];

  var currentData = [],
    fullData = [],
    colMap = {
      UID: 'clm_uid',
      GUID: 'clm_guid',
      DATE: 'clm_date',
      NUM: 'clm_num',
      VALUE: 'clm_value', //bar y
      CUM_VALUE: 'clm_cum_value', //line y
      STATUS: 'clm_status', //inner
      ELIG_STATUS: 'clm_elig_status', //outer
      NOTICE_STATUS: 'clm_notice_status',
      PAYMENT_STATUS: 'clm_payment_status'
    },
    statusMap = {
      ELIG_STATUS: {
        ELIGIBLE: "Eligible",
        UNDETERMINED: "Undetermined"
      },
      STATUS: {
        PRIMARY: "Primary Review",
        SECONDARY: "Secondary Review",
        OVERSIGHT: "Oversight Committee"
      }
    },
    criteriaGroup = {
      DATE: [],
      STATUS: [],
      ELIG_STATUS: []
    }

  init();

  function init() {
    eventBinding();
    getKPIData();
    getDashboardSummaryData();
  }

  function resetBg() {
    $('.icon-block').css({
      'background-color': '#9C2222',
      'border-color': '#9C2222'
    });
  }

  function changeBg(t) {
    resetBg();
    $(t).css({
      'background-color': 'green',
      'border-color': 'green'
    });
  }

  function eventBinding() {

    $('.box_1').click(function () {
      setCaseSearchList(fullData);
      changeBg(this);
      filterData(null);
    });

    $('#filters').on('click', '#btnRevert', function () {
      setCaseSearchList(fullData);
      changeBg('.box_1');
      filterData(null);
    });

    $('.box_2').click(function () {
      var renderData = [];

      $.each(currentData, function (index, item) {
        if (item.clm_status_full == "Notice" || item.clm_status_full == "Release" || item.clm_status_full == "Payment" || item.clm_status_full == "Resolved") {
          renderData.push(item);
        }
      });

      setCaseSearchList(renderData);
      changeBg(this);
    });

    $('.box_3').click(function () {
      var renderData = [];

      $.each(currentData, function (index, item) {
        if (item.clm_status_full != "Notice" && item.clm_status_full != "Release" && item.clm_status_full != "Payment" && item.clm_status_full != "Resolved") {
          renderData.push(item);
        }
      });

      setCaseSearchList(renderData);
      changeBg(this);
    });

  }

  function setCaseSearchList(data) {
    var results = data;
    $('#caseSearchlist').DataTable().destroy();
    $('#caseSearchlist').DataTable({
      data: results,
      dom: '<"top"ilf>rt<"bottom"p><"clear">',
      columns: [{
        data: "clm_number",
        render: function (data, type, full) {
          console.log("full:", full);
          console.log("full clm_guid:", encodeURIComponent(full.clm_guid));
          // return '<a href="' + rootPath + casepath + '/case-summary/' + encodeURIComponent(full.clm_guid) + '">' + full.clm_number + '</a>';
          return '<a href="' + "/CERBERUS" + "/case" + '/case-summary/' + encodeURIComponent(full.clm_guid) + '">' + full.clm_number + '</a>';
        }
      },
        {
          data: "clm_fname",
          render: function (data, type, full) {
            return full.clm_fname + ' ' + full.clm_lname;
          }
        },
        {
          data: "clm_type_full"
        },
        {
          data: "clm_date",
          render: function (data, type, full) {
            if (data !== null) {
              return tools.formatDate(data);
            } else {
              return data;
            }
          }
        },
        {
          data: "clm_value",
          render: function (data, type, full) {
            return tools.formatUSD(data);
          }
        },
        {
          data: "clm_status_full"
        },
        {
          data: "clm_elig_status"
        }
      ]
    });
  }

  function getKPIData() {

    var KPIData = [{"total_count":"54","total_reviewed":"0","total_outstanding":"54","total_liability":"0"}];
    $('#total_count').text(KPIData[0].total_count);
    $('#total_reviewed').text(KPIData[0].total_reviewed);
    $('#total_outstanding').text(KPIData[0].total_outstanding);
    $('#total_liability').text(tools.formatUSD(KPIData[0].total_liability));


    // $.ajaxEx({
    //   type: 'get',
    //   url: dashboardPath + '/getKPI',
    //   dataType: 'json',
    //   success: function (res) {
    //     console.log("kpi res:", JSON.stringify(res));
    //     if (res.code == 0) {
    //       var res = {"msg":"ok","code":0,"data":[{"total_count":"51","total_reviewed":"0","total_outstanding":"51","total_liability":"0"}]};
    //       var dashboardKPI = res.data[0];
    //       $('#total_count').text(dashboardKPI.total_count);
    //       $('#total_reviewed').text(dashboardKPI.total_reviewed);
    //       $('#total_outstanding').text(dashboardKPI.total_outstanding);
    //       $('#total_liability').text(tools.formatUSD(dashboardKPI.total_liability));
    //     } else {
    //       console.error(res);
    //     }
    //   },
    //   error: function (error) {
    //     console.error(error);
    //   }
    // });
  }

  function getDashboardSummaryData() {
    var loadingHandle = tools.setLoading($('#caselist').parent());
    var data = [{"clm_uid":"12054","clm_guid":"e16d086e-175c-467f-bf74-0b2d163e6718","clm_number":"1","clm_fname":"First Name 1","clm_lname":"Last Name 2","clm_type":"ph2","clm_date":"2016-10-04T16:00:00.000Z","clm_value":"100000","clm_cum_value":"100000","clm_status":"Oversight Committee","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Oversight Committee","clm_type_full":"Phase 2","clm_elig_status":"Eligible","clm_owner_name":"Test1"},
      {"clm_uid":"12281","clm_guid":"01f74c97-cdf7-4d54-b388-86206015b9dc","clm_number":"6","clm_fname":"","clm_lname":"","clm_type":"ph1","clm_date":"2017-01-03T16:00:00.000Z","clm_value":null,"clm_cum_value":"100000","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Test6"},
      {"clm_uid":"12255","clm_guid":"d41df24f-038c-4731-b182-f6cca0f548aa","clm_number":"2","clm_fname":"First Name","clm_lname":"Last","clm_type":"ph1","clm_date":"2017-01-08T16:00:00.000Z","clm_value":null,"clm_cum_value":"100000","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Test2"},
      {"clm_uid":"12268","clm_guid":"3a0e6b71-fc57-4e4c-8ac7-fab3fad2bfc1","clm_number":"4","clm_fname":"First Name","clm_lname":"Last","clm_type":"ph2","clm_date":"2017-01-10T16:00:00.000Z","clm_value":null,"clm_cum_value":"100000","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 2","clm_elig_status":"Undetermined","clm_owner_name":"Test4"},
      {"clm_uid":"12282","clm_guid":"5e36d815-3e80-4932-9521-90cc0b3bb161","clm_number":"7","clm_fname":"","clm_lname":"","clm_type":"ph1","clm_date":"2017-01-10T16:00:00.000Z","clm_value":null,"clm_cum_value":"100000","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Test7"},
      {"clm_uid":"12280","clm_guid":"0d8bc7f6-0fcf-4090-ae90-b77a436cd393","clm_number":"5","clm_fname":"Partial Form Test","clm_lname":"Partial","clm_type":"ph1","clm_date":"2017-01-11T16:00:00.000Z","clm_value":null,"clm_cum_value":"100000","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Test5"},
      {"clm_uid":"12267","clm_guid":"7a7b2077-6a24-498f-ad22-f9bfab876290","clm_number":"3","clm_fname":"First Name","clm_lname":"Last","clm_type":"ph1","clm_date":"2017-01-25T16:00:00.000Z","clm_value":"123.6","clm_cum_value":"100123.6","clm_status":"Secondary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Secondary Review","clm_type_full":"Phase 1","clm_elig_status":"Eligible","clm_owner_name":"Test3"},
      {"clm_uid":"12295","clm_guid":"bb94940c-af62-43d2-a09c-7ce1d625f027","clm_number":"19","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-02T16:00:00.000Z","clm_value":"500000","clm_cum_value":"600123.6","clm_status":"Secondary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Secondary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Test Attorney"},
      {"clm_uid":"12283","clm_guid":"150f9048-d83a-4cea-a669-b97a11e3c447","clm_number":"8","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-07T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Attorney Name"},
      {"clm_uid":"12286","clm_guid":"d78054f3-3787-4302-a032-134f20c8b77d","clm_number":"11","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-08T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"sdf"},
      {"clm_uid":"12290","clm_guid":"1e618e2c-571d-4873-b24d-37830f897f45","clm_number":"15","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-08T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Attorney 1"},
      {"clm_uid":"12284","clm_guid":"f074b89a-50d8-4ef6-b364-0f27db8dfc28","clm_number":"9","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-08T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Test Representative"},
      {"clm_uid":"12294","clm_guid":"7d31538c-7396-4f13-9468-2c89952202de","clm_number":"18","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-08T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Attorney 1"},
      {"clm_uid":"12285","clm_guid":"b9018228-e789-406f-9605-4fb76c4c97fc","clm_number":"10","clm_fname":"Johnny","clm_lname":"CHU","clm_type":"ph1","clm_date":"2017-02-08T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Oversight Committee","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Oversight Committee","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"aaa"},
      {"clm_uid":"12289","clm_guid":"cd8fddae-b7de-4258-8074-42d74bc78adc","clm_number":"14","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-08T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Attorney 1"},
      {"clm_uid":"12287","clm_guid":"e1186e10-6111-4c18-ac90-0b2df417171c","clm_number":"12","clm_fname":"","clm_lname":"","clm_type":"ph1","clm_date":"2017-02-08T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Secondary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Secondary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"w"},
      {"clm_uid":"12288","clm_guid":"734fc082-d27f-473a-b5ce-d56716901c0c","clm_number":"13","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-08T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Attorney 1"},
      {"clm_uid":"12296","clm_guid":"b6c3860b-b4b3-45c3-80a8-721e08a6d8f7","clm_number":"20","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Sample Attorney"},
      {"clm_uid":"12291","clm_guid":"deeee8cd-e492-40a3-8d02-acfc15b56a8c","clm_number":"16","clm_fname":"Myfirstname","clm_lname":"Mylastname","clm_type":"ph2","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 2","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12298","clm_guid":"c9531abd-759e-46ee-94e7-7c4eceeb1141","clm_number":"22","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"1"},
      {"clm_uid":"12301","clm_guid":"1a4681a7-fd67-4199-b8ff-c5c68b193421","clm_number":"25","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"fdsafdasfasd"},
      {"clm_uid":"12303","clm_guid":"be92c8be-6b17-41cc-8b82-c5a0f636e8f4","clm_number":"27","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"1"},
      {"clm_uid":"12302","clm_guid":"668d524e-c72a-4087-988b-c4d37cda48ba","clm_number":"26","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":""},
      {"clm_uid":"12300","clm_guid":"aaee576b-b0b5-4d05-91d1-37d7f8ed26e6","clm_number":"24","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"1"},
      {"clm_uid":"12299","clm_guid":"6cd96c33-61c5-442a-8db4-963c263426d3","clm_number":"23","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"1"},
      {"clm_uid":"12297","clm_guid":"57cfae72-a3d3-4b06-bf94-c1c4b693894a","clm_number":"21","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"Test Atty"},
      {"clm_uid":"12304","clm_guid":"da9ab7ff-5cc2-4487-a768-2600e1d270b3","clm_number":"28","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"12"},
      {"clm_uid":"12315","clm_guid":"4a3906a6-8ea0-460c-91b0-10608b57ac75","clm_number":"100","clm_fname":"","clm_lname":"","clm_type":"ph1","clm_date":"2017-02-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12292","clm_guid":"1cbfc913-89fa-4796-ba03-7966f65de62b","clm_number":"17","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-15T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"attorney"},
      {"clm_uid":"12305","clm_guid":"c9bf79d0-7019-4a81-bcc1-af2fa0ba20e5","clm_number":"29","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-20T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"12"},
      {"clm_uid":"12306","clm_guid":"8d9f65a6-6a19-4817-895c-3768c76a7934","clm_number":"30","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-20T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"12"},
      {"clm_uid":"12308","clm_guid":"3896689b-4f4f-4176-ba67-dd628f56ac2b","clm_number":"32","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-21T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"12"},
      {"clm_uid":"12312","clm_guid":"3291457f-0c13-47ce-b3b4-312e07eef881","clm_number":"601","clm_fname":"Jane","clm_lname":"Doe","clm_type":"ph2","clm_date":"2017-02-21T16:00:00.000Z","clm_value":null,"clm_cum_value":"600123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 2","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12311","clm_guid":"6b61f24f-e0f5-47bf-8dae-711e1b21eee1","clm_number":"501","clm_fname":"Hunter","clm_lname":"Thompson","clm_type":"ph1","clm_date":"2017-02-22T16:00:00.000Z","clm_value":"250000","clm_cum_value":"850123.6","clm_status":"Oversight Committee","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Oversight Committee","clm_type_full":"Phase 1","clm_elig_status":"Eligible","clm_owner_name":null},
      {"clm_uid":"12309","clm_guid":"6075cee9-dcc3-4170-bab1-dcf075b01308","clm_number":"33","clm_fname":"3Mc","clm_lname":"1","clm_type":"ph1","clm_date":"2017-02-22T16:00:00.000Z","clm_value":null,"clm_cum_value":"850123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"12"},
      {"clm_uid":"12307","clm_guid":"3aa7b5ab-f071-4f6d-bd15-f50d759eb3b8","clm_number":"31","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-22T16:00:00.000Z","clm_value":null,"clm_cum_value":"850123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":""},
      {"clm_uid":"12310","clm_guid":"dad0a855-50bf-4245-b62e-cbc28720ec33","clm_number":"345","clm_fname":"JohnnyX","clm_lname":"CHU","clm_type":"ph1","clm_date":"2017-02-23T16:00:00.000Z","clm_value":null,"clm_cum_value":"850123.6","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":"12"},
      {"clm_uid":"12318","clm_guid":"845e51e9-9df4-4099-bda7-6125f6df8cc9","clm_number":"701","clm_fname":"Marsellus","clm_lname":"Wallace","clm_type":"ph1","clm_date":"2017-02-26T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Oversight Committee","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Oversight Committee","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12313","clm_guid":"600abd75-d13a-4677-a993-316c01479e31","clm_number":"1992","clm_fname":"Henry","clm_lname":"Reily","clm_type":"ph1","clm_date":"2017-02-26T16:00:00.000Z","clm_value":"0.00","clm_cum_value":"1150123.60","clm_status":"Secondary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Secondary Review","clm_type_full":"Phase 1","clm_elig_status":"Ineliegible","clm_owner_name":null},
      {"clm_uid":"12314","clm_guid":"2454546c-11e9-4212-b251-9e4d1efd919e","clm_number":"2017","clm_fname":"Second","clm_lname":"Test","clm_type":"ph1","clm_date":"2017-02-26T16:00:00.000Z","clm_value":"300000","clm_cum_value":"1150123.60","clm_status":"Secondary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Secondary Review","clm_type_full":"Phase 1","clm_elig_status":"Eligible","clm_owner_name":null},
      {"clm_uid":"12320","clm_guid":"21526b20-f4e4-4b94-aa80-1b40223ac793","clm_number":"901","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-27T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12316","clm_guid":"f6e5bd19-7456-4e48-a1f4-3028f941ceda","clm_number":"999","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-28T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12321","clm_guid":"c21c2d7d-536a-44df-b575-653d34aa81c2","clm_number":"1001","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-28T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12323","clm_guid":"a2204d3b-7ace-46e0-a702-43f11c6bbbd6","clm_number":"9876","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-28T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12317","clm_guid":"7e04a2ba-54cf-4fbf-aeae-798d53ad675b","clm_number":"888","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-28T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12319","clm_guid":"22dcff54-d6ce-4a13-913d-9793494b317c","clm_number":"801","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-02-28T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12322","clm_guid":"1ad6ff93-c90a-4a88-be99-5027c72f0c82","clm_number":"777","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-03-01T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12325","clm_guid":"130979bf-8b02-44b2-825f-6b61ca554802","clm_number":"2001","clm_fname":"Bruce","clm_lname":"Willis","clm_type":"ph1","clm_date":"2017-03-02T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12324","clm_guid":"8b559d0a-5d39-4a23-a1b3-9b666efad519","clm_number":"722","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-03-02T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12330","clm_guid":"59c246a8-3cac-4a7f-b0e0-9909f37f023a","clm_number":"1111","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-03-06T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12326","clm_guid":"4b235b65-d896-4fc3-b952-d7c1143c702f","clm_number":"119","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-03-09T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12327","clm_guid":"976e6e20-ffa2-4dbf-b745-1f2aadcf0c8c","clm_number":"120","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-03-15T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12328","clm_guid":"8bc8794f-98bd-4cee-b648-1af89b31eece","clm_number":"121","clm_fname":null,"clm_lname":null,"clm_type":"ph2","clm_date":"2017-03-22T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 2","clm_elig_status":"Undetermined","clm_owner_name":null},
      {"clm_uid":"12329","clm_guid":"c7def632-8979-44b5-bdbc-d1ee4c0172db","clm_number":"1000","clm_fname":null,"clm_lname":null,"clm_type":"ph1","clm_date":"2017-03-28T16:00:00.000Z","clm_value":null,"clm_cum_value":"1150123.60","clm_status":"Primary Review","clm_review_outcome":null,"clm_notice_status":"Not Sent","clm_payment_status":"Not Initiated","clm_status_full":"Primary Review","clm_type_full":"Phase 1","clm_elig_status":"Undetermined","clm_owner_name":null}];

    originDataFormat(data);
    fullData = data.slice();
    currentData = data;

    //load case list
    loadingHandle.hide();
    setCaseSearchList(currentData);
    caseListHeight = $("#caselist").height();

    filterData({
    });


    // $.ajaxEx({
    //   type: "get",
    //   url: dashboardPath + "/getDashboardSummary",
    //   dataType: "json",
    //   success: function (res) {
    //     if (res.code == 0) {
    //       console.log("data:", JSON.stringify(res));
    //       originDataFormat(res.data);
    //       fullData = res.data.slice();
    //       currentData = res.data;
    //
    //       //load case list
    //       loadingHandle.hide();
    //       setCaseSearchList(currentData);
    //       caseListHeight = $("#caselist").height();
    //
    //       filterData({
    //       })
    //     } else {
    //       console.log(res);
    //       setCaseSearchList([]);
    //       caseListHeight = ($(window).height() * 3/5);
    //     }
    //   },
    //   error: function (err) {
    //     console.log(err);
    //   }
    // });
  }

  function originDataFormat(data) {

    data.forEach(function (d) {
      d[colMap.DATE] = new Date(d[colMap.DATE]).getTime();
      d[colMap.VALUE] = ~~d[colMap.VALUE];
      d[colMap.CUM_VALUE] = ~~d[colMap.CUM_VALUE]
    });
  }

  function updateDisFilter(criteriaGroup) {
    var arr = [];
    var filterHtml;

    if (criteriaGroup.DATE.length > 0) {
      var dateArr = criteriaGroup.DATE.map(function (a) {
        var d = new Date(a);
        var months = parseInt(d.getMonth()) + 1;
        months = months >= 10 ?  months : "0" + months;
        return months + '/' + d.getDate() + '/' + d.getFullYear();
      });
      arr.push("<b>Date: </b>" + dateArr.join(","));
    }

    if (criteriaGroup.STATUS.length > 0) {
      arr.push("<b>Claim Status: </b>" + criteriaGroup.STATUS.join(","));
    }

    if (criteriaGroup.ELIG_STATUS.length > 0) {
      arr.push("<b>Eligibility Status: </b>" + criteriaGroup.ELIG_STATUS.join(","));
    }

    if (arr.length == 0) {
      filterHtml = '';
    } else {
      filterHtml = '<label class="pill" id="btnRevert"><i class="fa fa-refresh" aria-hidden="true"></i></label>';
    }

    $.each(arr, function(key, item) {
      filterHtml += '<label class="pill">'+item+'</label>';
    });
    $('#filters').html(filterHtml);
  }

  function filterData(criteria) {
    var filteredData = fullData.slice(),
      filter = crossfilter(filteredData);

    if (!criteria) {
      criteriaGroup = {
        DATE: [],
        STATUS: [],
        ELIG_STATUS: []
      }
      updateDisFilter(criteriaGroup);

      currentData = filteredData;


      renderCharts(currentData);
      return;
    }

    //date
    if (criteria.DATE && criteria.DATE.length === 1) {
      if (criteriaGroup.DATE.length === 0) {
        criteriaGroup.DATE.push(criteria.DATE[0])
      } else if (criteriaGroup.DATE.length === 1 && criteriaGroup.DATE.indexOf(criteria.DATE[0]) >= 0) {
        criteriaGroup.DATE.pop();
      } else if (criteriaGroup.DATE.length === 1 && criteriaGroup.DATE.indexOf(criteria.DATE[0]) < 0) {
        criteriaGroup.DATE = criteria.DATE
      }
    }

    filteredData = filter.dimension(function (d) {
      return d[colMap.DATE]
    })
      .filter(criteriaGroup.DATE[0])
      .top(Infinity);

    // status
    if (criteria.STATUS && criteria.STATUS.length === 1) {
      if (criteriaGroup.STATUS.length === 0) {
        criteriaGroup.STATUS.push(criteria.STATUS[0])
      } else if (criteriaGroup.STATUS.length === 1 && criteriaGroup.STATUS.indexOf(criteria.STATUS[0]) >= 0) {
        criteriaGroup.STATUS.pop();
      } else if (criteriaGroup.STATUS.length === 1 && criteriaGroup.STATUS.indexOf(criteria.STATUS[0]) < 0) {
        criteriaGroup.STATUS = criteria.STATUS
      }
    }

    filteredData = filter.dimension(function (d) {
      return d[colMap.STATUS]
    })
      .filter(criteriaGroup.STATUS[0])
      .top(Infinity);

    //"Eligible"
    if (criteria.ELIG_STATUS && criteria.ELIG_STATUS.length === 1) {
      if (criteriaGroup.ELIG_STATUS.length === 0) {
        criteriaGroup.ELIG_STATUS.push(criteria.ELIG_STATUS[0])
      } else if (criteriaGroup.ELIG_STATUS.length === 1 && criteriaGroup.ELIG_STATUS.indexOf(criteria.ELIG_STATUS[0]) >= 0) {
        criteriaGroup.ELIG_STATUS.pop();
      } else if (criteriaGroup.ELIG_STATUS.length === 1 && criteriaGroup.ELIG_STATUS.indexOf(criteria.ELIG_STATUS[0]) < 0) {
        criteriaGroup.ELIG_STATUS = criteria.ELIG_STATUS
      }
    }

    filteredData = filter.dimension(function (d) {
      return d[colMap.ELIG_STATUS]
    })
      .filter(criteriaGroup.ELIG_STATUS[0])
      .top(Infinity);

    currentData = filteredData;

    updateDisFilter(criteriaGroup);
    renderCharts(currentData);
    setCaseSearchList(currentData);
    resetBg();
  }

  function renderCharts(data) {
    dataAggregation(data);
    $(".donut-container").css("height", caseListHeight);
    renderTimeStackedBarChart('.bar-container', aggregatedBarChartData);
    drawd3PieChart("#donut-container", aggregatedDonutOuter, "outer", 'STATUS');
    drawd3PieChart1("#donut-container", aggregatedDonutInner, "inner", 'ELIG_STATUS');
  }

  $(window).resize(function(){
    renderCharts(currentData);
  });

  function dataAggregation(data) {
    var filter = crossfilter(data);

    aggregatedBarChartData = filter.dimension(function (d) {
      return d[colMap.DATE]
    })
      .group()
      .reduce(function (p, v) {
        p[colMap.VALUE] += v[colMap.VALUE];
        p[colMap.CUM_VALUE] += v[colMap.CUM_VALUE];
        p['dataset'].push(v);
        return p;
      }, function (p, v) {
        p[colMap.VALUE] -= v[colMap.VALUE];
        p[colMap.CUM_VALUE] -= v[colMap.CUM_VALUE];
        p['dataset'].pop(v);
        return p;
      }, function () {
        return {
          [colMap.VALUE]: 0,
          [colMap.CUM_VALUE]: 0,
          "dataset" :[]
        }
      })
      .top(Infinity);

    aggregatedBarChartData.sort(function (a, b) {
      return a.key - b.key;
    });

    aggregatedDonutInner = filter.dimension(function (d) {
      return d[colMap.ELIG_STATUS];
    })
      .group()
      .reduceCount()
      .top(Infinity);

    aggregatedDonutOuter = filter.dimension(function (d) {
      return d[colMap.STATUS];
    })
      .group()
      .reduceCount()
      .top(Infinity);
  }

  function renderTimeStackedBarChart(div_selector, data){

    var numlength = 0, i_index = 0;
    data.forEach(function(item, i){
      item.key = tools.formatDate(item.key);
      if(item.value.dataset.length >= numlength) {
        numlength = item.value.dataset.length;
        i_index = i;
      }
      item.value.dataset.forEach(function(node, j){
        item["num_" + j] = node.clm_value;
      })
    });

    data.forEach(function(item,i){
      var actual_num = item.value.dataset.length;
      for(var j= actual_num; j < numlength; j++){
        item["num_" + j] = 0;
      }
    });

    $(div_selector).find('svg').remove();
    $('.d3-tip').remove();
    var W = document.querySelector(div_selector).clientWidth,
      H = document.querySelector(div_selector).clientHeight;

    var parseDate= d3.time.format("%m/%d/%Y").parse,
      bisectDate = d3.bisector(function(d){return d.key;}).left;

    var margin = {top: 40, right: 160, bottom: 80, left: 50},
      width = W - margin.left - margin.right,
      height = H - margin.top - margin.bottom;

    var formatPercent = d3.format("%");

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
      .rangeRound([height, 0]);

    var y2 = d3.scale.linear()
      .range([height, 0]);

    var colors = d3.scale.ordinal()
      .range(["#ffc000", "#fc722d", "#ff0000", "#f74545", "#fc7676", "#f25304", "#f99461", "#e56e32", "#fcaa80", "#f9c936", "#f9d76d"]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickFormat(d3.format(".0%"));

    var yAxis2 = d3.svg.axis()
      .scale(y2)
      .orient("right")
      .tickFormat(d3.format(',d'));


    var svg = d3.select(div_selector).append("svg")
      .attr("id", "barChart_svg")
      .attr("width", $(div_selector).width())
      .attr("height", $(div_selector).height())
      .append("g")
      .attr("transform", "translate(" + (margin.left * 2) + "," + margin.top + ")");

    x.domain(data.map(function(d){return tools.formatDate(d.key);}));
    y.domain([0, 1]);
    colors.domain(d3.keys(data[i_index]).filter(function(key){return key != "key" && key != "value";}));

    var x_test = d3.scale.ordinal().domain([0, width], .1)
      .rangeRoundBands(data.map(function(d){return tools.formatDate(d.key);}));

    y2.domain([0, d3.max(data, function (d) {
      return d.value[colMap.CUM_VALUE];
    })]);

    data.forEach(function(item){
      var y0 = 0;
      item.responses = colors.domain().map(function(response){
        var responseobj = {response: response, y0: 0, yp0: y0, key: item.key};
        y0 += + item[response];
        responseobj.y1 = y0;
        responseobj.yp1 = y0;
        return responseobj;
      });
      item.responses.forEach(function(d) {
        if(y0 !== 0){
          d.yp0 /= y0; d.yp1 /= y0;
        } else {
          d.yp0 = 0; d.yp1 = 0;
        }
      });
      item.totalresponses = item.responses[item.responses.length -1].y1;
    });

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");

    svg.append("g")
      .attr("class", "y axis")
      .attr('transform', "translate(" + (width) + ',0' + ")")
      .call(yAxis2)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");

    svg.append("g")
      .attr("class", "grid")
      .call(yAxis.tickSize(-width, 0 ,0).tickFormat(""));

    var category = svg.selectAll(".category")
      .data(data)
      .enter().append("g")
      .attr("class", "category")
      .attr("transform", function(d){ return "translate(" + (x(d.key)) + ",0)"});

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d){
        var title = d.response;
        return "<strong>" + d.response + ":</strong><span>" + d.y1 + "</span>";
      });

    category.selectAll("rect")
      .data(function(d) { return d.responses;})
      .enter().append("rect")
      .attr("x", 15)
      .attr("width", x.rangeBand() - 30)
      .attr("y", function(d) { return y(d.yp1); })
      .attr("height", function(d) { return y(d.yp0) - y(d.yp1); })
      .style("fill", function(d) { return colors(d.response); })
      .on("mousemove", tip.show)
      .on("mouseout", tip.hide)
      .on('click', filterWithBar)
      .call(tip);

    svg.append("g").append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (width/2) +","+(height+ margin.bottom/1.5)+")")
      .text("Date Received");

    svg.append("g").append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (-margin.left-15) +","+(height/2)+")rotate(-90)")
      .text("claim value");

    svg.append("g").append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (width+margin.right/1.8) +","+(height/2)+")rotate(-90)")
      .text("claim cum value");

    var valueline = d3.svg.line()
      .x(function (d) {
        return x(d.key) + x.rangeBand()/2;
      })
      .y(function (d) {
        return y2(d.value.clm_cum_value)
      });

    var focus = svg.append("g")
      .attr("class", "focus");

    var circle = focus.append("circle")
      .attr("r", 6);

    focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

    var path = svg.append("path")
      .datum(data)
      .attr('class', 'line')
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", valueline)
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

    function mousemove() {
      var x1 = d3.mouse(this)[0], x0,
        leftEdges = x.range(),
        width = x.rangeBand(), j;
      for(j=0; x1 > (leftEdges[j] + width); j++){
      }
      x0 = x.domain()[j];
      var i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.key > d1.key - x0 ? d1 : d0;
      focus.style("display", "inline-block").attr("transform", "translate(" + d3.mouse(this)[0] + "," + d3.mouse(this)[1]+ ")");
      focus.select("text").text(d.value.clm_cum_value);
    }

    setTimeout(function () {
      $("#div_01 .y .tick text").each(function () {
        if ($(this).text().length <= 0) {
          $(this).prev().hide();
        }
      });
      $("#div_01 .grid line:odd").each(function () {
        $(this).hide();
      });

    }, 100);

    function filterWithBar(d) {
      filterData({
        DATE: [d.key]
      });
    }
  }

  function calculateTransform(data, i) {
    if(i == 0) {
      return data;
    } else if(i == 1){
      return (data + 72 * i);
    } else {
      return data + 72 * i + 20 * (i - 1);
    }
  }

  function renderTimeBarChart(div_selector, data) {
    $(div_selector).find('svg').remove();
    $('.d3-tip').remove();

    var W = document.querySelector(div_selector).clientWidth,
      H = document.querySelector(div_selector).clientHeight;

    var parseDate= d3.time.format("%m/%d/%Y").parse,
      bisectDate = d3.bisector(function(d){return d.key;}).left;

    var margin = {top: 40, right: 160, bottom: 80, left: 50},
      width = W - margin.left - margin.right,
      height = H - margin.top - margin.bottom;

    data.forEach(function(d){
      d.key = tools.formatDate(d.key);
    });

    var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

    var y = d3.scale.linear()
      .range([height, 0]);

    var y2 = d3.scale.linear()
      .range([height, 0]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickFormat(d3.format(',d'));

    var yAxis2 = d3.svg.axis()
      .scale(y2)
      .orient("right")
      .tickFormat(d3.format(',d'));

    var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function (d) {
        return 'Entities Onboarded Date:' + tools.formatDate(d.key) + '<br> Number :' + d.value.clm_value;
      });

    var svg = d3.select(div_selector).append("svg")
      .attr("id", "barChart_svg")
      .attr("width", $(div_selector).width())
      .attr("height", $(div_selector).height())
      .append("g")
      .attr("transform", "translate(" + (margin.left * 2) + "," + margin.top + ")");

    x.domain(data.map(function(d){return tools.formatDate(d.key);}));

    y.domain([0, d3.max(data, function (d) {
      return d.value[colMap.VALUE];
    })]);

    y2.domain([0, d3.max(data, function (d) {
      return d.value[colMap.CUM_VALUE];
    })]);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .selectAll("text")
      .append("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", "-.55em")
      .attr("transform", "rotate(-90)")
      .text("");

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");

    svg.append("g")
      .attr("class", "y axis")
      .attr('transform', "translate(" + (width) + ',0' + ")")
      .call(yAxis2)
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("");

    svg.append("g")
      .attr("class", "grid")
      .call(yAxis.tickSize(-width, 0, 0).tickFormat(""));

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr('fill', '#ffc000')
      .attr("x", function (d) {
        return x(d.key);
      })
      .attr("width", x.rangeBand())
      .attr("y", function (d) {
        return y(d.value.clm_value);
      })
      .attr("height", function (d) {
        return height - y(d.value.clm_value);
      })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .on('click', filterWithBar)
      .call(tip);

    svg.append("g").append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (width/2) +","+(height+ margin.bottom/1.5)+")")
      .text("Date Received");

    svg.append("g").append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (-margin.left-15) +","+(height/2)+")rotate(-90)")
      .text("claim value");

    svg.append("g").append("text")
      .attr("text-anchor", "middle")
      .attr("transform", "translate("+ (width+margin.right/1.8) +","+(height/2)+")rotate(-90)")
      .text("claim cum value");

    var valueline = d3.svg.line()
      .x(function (d) {
        return x(d.key) + x.rangeBand()/2;
      })
      .y(function (d) {
        return y2(d.value.clm_cum_value)
      });

    var focus = svg.append("g")
      .attr("class", "focus");


    var circle = focus.append("circle")
      .attr("r", 6);

    focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

    var path = svg.append("path")
      .datum(data)
      .attr('class', 'line')
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", valueline)
      // .attr("transform", "translate()")
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);

    function mousemove() {
      var x1 = d3.mouse(this)[0], x0,
        leftEdges = x.range(),
        width = x.rangeBand(), j;
      for(j=0; x1 > (leftEdges[j] + width); j++){
      }
      x0 = x.domain()[j];
      var i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.key > d1.key - x0 ? d1 : d0;
      focus.style("display", "inline-block").attr("transform", "translate(" + d3.mouse(this)[0] + "," + d3.mouse(this)[1]+ ")");
      focus.select("text").text(d.value.clm_cum_value);
    }

    setTimeout(function () {
      $("#div_01 .y .tick text").each(function () {
        if ($(this).text().length <= 0) {
          $(this).prev().hide();
        }
      });
      $("#div_01 .grid line:odd").each(function () {
        $(this).hide();
      });

    }, 100);

    function filterWithBar(d) {
      filterData({
        DATE: [d.key]
      });
    }
  }

  function drawd3PieChart(div_selector, chartData, ps_outer_inner, criteriaType){

    $(div_selector + ">#" + ps_outer_inner).remove();
    chartData.forEach(function(item){
      item["label"] = item.key;
    });

    var pie = new d3pie(div_selector, {
      header:{
        title: {
          text: ""
        },
        location: "top-center"
      },
      size: {
        canvasHeight: $(div_selector).height(),
        canvasWidth: $(div_selector).width(),
        pieInnerRadius: "70%",
        pieOuterRadius: "90%"
      },
      data: {
        content: chartData
      },
      ps_outer_inner: ps_outer_inner,
      id: ps_outer_inner,
      misc: {
        colors: {
          segments: [
            "#e0301e", "#ef6456", "#f9cd5e","#b23a2e", "#f7bc2a", "#bf6359","#ffb600", "#f79a45","#ed914b","#f9c60c", "#f28b2e","#f96d02", "#dc6900", "#ef786b", "#f7e891", "#f4d04b", "#ed5849", "#f29f54"
          ]
        }
      },
      callbacks: {
        onClickSegment: showPathText
      }
    });

    function showPathText(d) {
      filterData({
        [criteriaType]: [d.data.label]
      });
    }

    $("#pie svg").css("margin-top", "-2.0rem");
    $("#donut-container svg:nth-child(1)").css("position", "absolute").css("z-index", 0);
  }

  function drawd3PieChart1(div_selector, chartData,ps_outer_inner, criteriaType){
    $(div_selector + ">#" + ps_outer_inner).remove();

    chartData.forEach(function(item){
      item["label"] = item.key;
    });

    var pie = new d3pie(div_selector, {
      header:{
        title: {
          text: ""
        },
        location: "top-center"
      },
      size: {
        canvasHeight: $(div_selector).height(),
        canvasWidth: $(div_selector).width(),
        pieInnerRadius: "45%",
        pieOuterRadius: "62%"
      },
      data: {
        content: chartData
      },
      ps_outer_inner: ps_outer_inner,
      id: ps_outer_inner,
      misc: {
        colors: {
          segments: [
            "#ff8c00", "#ef6909", "#efa953", "#f7bc74", "#f7ca94", "#f9d7ae"
          ]
        }
      },
      callbacks: {
        onClickSegment: showPathText
      }
    });

    function showPathText(d) {
      filterData({
        [criteriaType]: [d.data.label]
      });
    }

    $("#pie svg").css("margin-top", "-2.0rem");

    $("#donut-container svg:nth-child(2)").css("position", "absolute").css("z-index", 6);
  }

  function drawAccountPieChart(div_selector, data_for_chart, outerLength, innerLength, status, value, svg_id, criteriaType) {
    $('#' + svg_id).remove();
    $('.d3-tip ' + criteriaType).remove();

    var W = document.querySelector(div_selector).clientWidth,
      H = document.querySelector("body").clientHeight * 0.6;

    var margin = {
        top: 0.3,
        right: 0.05,
        bottom: 0.01,
        left: 0.2
      },
      width = W * (1 - margin.left - margin.right),
      height = H * (1 - margin.top - margin.bottom),
      radius = Math.min(width, height) / 2;

    var svg = d3.select(div_selector).append("svg")
      .attr("id", svg_id)
      .attr("width", W)
      .attr("height", H)
      .attr("transform", "translate("+ (W * margin.left) + "," + (H *margin.top) + ")");

    svg.append("svg:title")
      .text("Top 10 Typologies");

    svg.append("g")
      .attr("class", "slices")
      .attr("transform", "translate(" + (width / 2 + W * margin.left * 0.7) + "," + (height / 2 -20) + ")");

    svg.append("g")
      .attr("class", "labels")
      .attr("transform", "translate(" + (width / 2 + W * margin.left * 0.7) + "," + (height / 2 -20) + ")");

    svg.append("g")
      .attr("class", "lines")
      .attr("transform", "translate(" + (width / 2 + W * margin.left * 0.7) + "," + (height / 2-20) + ")");

    var labels = [],
      data = [];

    data_for_chart.forEach(function (item) {

      if (parseInt(item[value]) !== 0) {
        var number = parseFloat(item[value]);
        data.push({
          "basis": item[status],
          "case_amount": number
        });
        labels.push(item[status]);
      }
    });

    var pie = d3.layout.pie()
      .sort(null)
      .value(function (d) {
        return d.case_amount;
      });

    var arc = d3.svg.arc()
      .outerRadius(radius * (1- outerLength))
      .innerRadius(radius * (1 - innerLength));

    var outerArc = d3.svg.arc()
      .innerRadius(radius * (1 - outerLength + 0.04))
      .outerRadius(radius * (1 - outerLength + 0.04));

    var key = function (d) {
      return d.data.basis;
    };
    var color;

    if (svg_id === "svg_outer") {
      color = d3.scale.ordinal()
        .domain(labels)
        .range(["#e0301e", "#ef6456", "#f9cd5e", "#b23a2e", "#f7bc2a", "#bf6359", "#ffb600", "#f79a45", "#ed914b", "#f9c60c", "#f28b2e", "#f96d02", "#dc6900", "#ef786b", "#f7e891", "#f4d04b", "#ed5849", "#f29f54"]);
    } else {
      var color = d3.scale.ordinal()
        .domain(labels)
        .range(["#ff8c00", "#ef6909", "#efa953", "#f7bc74", "#f7ca94", "#f9d7ae"]);
    }

    var slice = svg.select(".slices").selectAll("path.slice")
      .data(pie(data), key);

    var tip = d3.tip()
      .attr('class', 'd3-tip ' + criteriaType)
      .offset([-10, 0])
      .html(function (d) {
        return "<span>" + d.data.basis + ":" + d.data.case_amount + "</span>";
      });

    slice.enter()
      .insert("path")
      .attr("id", function(d, i){return "slice_" + svg_id + "_" + i})
      .style("fill", function (d) {
        return color(d.data.basis);
      })
      .style("opacity", 0)
      .style("stroke", "none")
      .style("stroke-width", "2px")
      .each(function(d){this._current = d;})
      .attr("class", "slice")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide)
      .on("click", showPathText)
      .call(tip);

    function animate(){
      svg.selectAll("path")
        .transition()
        .delay(function(d, i){return i * 500;})
        .duration(500)
        .attrTween('d', function(d){
          var i = d3.interpolate(d.startAngle + 0.1, d.endAngle);
          return function(t){
            d.endAngle = i(t);
            return arc(d);
          }
        })
        .style('opacity', 1);

      svg.selectAll("text")
        .transition()
        .delay(function(d, i){return i * 500;})
        .duration(500)
        .style('opacity', 1);
    }

    animate();

    /* ------- SLICE TO TEXT POLYLINES -------*/
    var polyline = svg.select(".lines").selectAll("polyline")
      .data(pie(data), key);

    polyline.enter()
      .append("polyline");

    polyline.transition().duration(1000)
      .attrTween("points", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.90 * (midAngle(d2) <= Math.PI ? 1 : -1);
          return [arc.centroid(d2), outerArc.centroid(d2), [pos[0], pos[1]]];
        };
      });

    polyline.exit().remove();

    var text = svg.select(".labels").selectAll("text")
      .data(pie(data), key);

    text.enter()
      .append("text")
      .attr("dy", "0.6em")
      .style("font-size", "0.8rem")
      .text(function(d) {
        return d.data.basis + ":" + d.data.case_amount;
      });

    function midAngle(d){
      return d.startAngle + (d.endAngle - d.startAngle)/2;
    }

    text.transition().duration(1000)
      .attrTween("transform", function(d) {
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          var pos = outerArc.centroid(d2);
          pos[0] = radius * 0.6 * (midAngle(d2) <= Math.PI ? 1 : -1);
          var labelVar = midAngle(d2) <= Math.PI ? 1 : -1;
          pos[1] = pos[1] * (1 - labelVar * 0.06);
          return "translate("+ pos[0] + "," + (pos[1]) +")";
        };
      })
      .styleTween("text-anchor", function(d){
        this._current = this._current || d;
        var interpolate = d3.interpolate(this._current, d);
        this._current = interpolate(0);
        return function(t) {
          var d2 = interpolate(t);
          return midAngle(d2) <= Math.PI ? "start":"end";
        };
      });

    text.exit().remove();

    function showPathText(d) {
      filterData({
        [criteriaType]: [d.data.basis]
      });
    }
  }
})
