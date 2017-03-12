var tools = {};

(function (namespace) {

  var name = {
    appName: document.title,
    jwtName: 'jwt-' + document.title.toLowerCase().replace(/_/g, '-'),
    roleName: 'role-' + document.title.toLowerCase().replace(/_/g, '-')
  }

  namespace.name = name;

  var path = {
    rootPath: '/' + name.appName,
    user: '/user',
    case: '/case',
    assignment: '/assignment',
    mycronos: '/myCronos',
    role: '/role',
    alert: '/alert',
    dashboard: '/dashboard',
    entity: '/entity',
    search: '/search',
    workflow: '/workflow',
    survey: '/survey',
    admin: '/admin',
    document: '/doc',
    note: '/notes',
    task: '/task',
    reports: '/reports',
    doc: '/doc',
    attribute: '/attribute',
    password: '/password',
  }

  namespace.path = path;

  namespace.ajaxEx = function (option) {
    var apiLogPath = $('#faast_url').val() + 'APILog';
    var postData = {};

    if (option.type) {
      postData.method = option.type;
    } else if (option.method) {
      postData.method = option.method;
    }
    postData.url = location.origin + '/' + name.appName + option.url;
    postData.origin = location.origin;
    postData.jwtName = name.jwtName;
    postData.params = option.data;

    var ajaxOption = {
      url: apiLogPath,
      method: "post",
      headers: {
        'jwt': $.cookie(name.jwtName)
      },
      data: postData,
      success: option.success,
      error: option.error
    }

    if (option.beforeSend) {
      ajaxOption.beforeSend = option.beforeSend;
    }

    $.ajax(ajaxOption);
  }

  namespace.formatDate = function formatDate(date) {
    var date = new Date(date);
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return month + '/' + day + '/' + year;
  }

  namespace.formatUSD = function formatUSD(num) {
    if (typeof (num) != "undefined" && num != null) {
      return '$' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      return '';
    }
  }

  namespace.checkInputInformation = function (inputValue) {
    if (inputValue.includes("<") || inputValue.includes(">")) {
      return true;
    } else {
      return false;
    }
  }

  namespace.formatCurrency = function (data) {
    if (data != null) {
      if (data.charAt(0) == '-') {
        var num = data.substr(1, data.length);
        return "-$" + num.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      } else {
        return "$" + data.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
      }
    } else {
      return data;
    }
  }

  namespace.formatNumber = function (data) {
    if (data != null) {
      return data.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
    } else {
      return data;
    }
  }


  namespace.getDataTableOption = function () {
    var dataTableOption = {
      dom: '<"top"<"pull-left"l><"pull-right"f>>rt<"bottom"<"pull-left"i><"pull-right"p>><"clear">',
      iDisplayLength: 10,
      aLengthMenu: [10, 20, 50, 100],
      bAutoWidth: false,
      responsive: true,
      bSort: true,
      bFilterOnEnter: false,
      paging: true,
      processing: false,
      bPaginate: true,
      sEmptyTable: "No data available in table"
    }
    return dataTableOption
  }

  namespace.serializeArrayToObject = function (serializeParams) {
    var object = {};
    $.each(serializeParams, function () {
      if ((this.value || "") == "") {
        return;
      }
      if (object[this.name] !== undefined) {
        if (!object[this.name].push) {
          objobject[this.name] = [object[this.name]];
        }
        object[this.name].push(this.value);
      } else {
        object[this.name] = this.value;
      }
    });
    return object;
  }

  namespace.getUrlGuidByNum = function (num) {
    var url = window.location.href;
    return url.split('/').slice(-num)[0];
  }

  namespace.invalidFile = function (input) {
    var allowFileType = $('#allowFileType').val()
    var allowFileTypeList = [];
    var flag = true;
    if (allowFileType != undefined && allowFileType != "") {
      allowFileTypeList = allowFileType.split(',');
      var fileName = input.files[0].name;
      if (fileName.split('.').length == 1) {
        return flag;
      }
      var fileType = fileName.split('.')[fileName.split('.').length - 1];

      for (var i = 0; i <= allowFileTypeList.length; i++) {
        if (allowFileTypeList[i] == fileType) {
          flag = false;
          break;
        }
      }
      return flag;
    }
  }

  namespace.isEmpty = function (val) {
    if (typeof (val) == 'undefined') {
      return true;
    } else if (val == null) {
      return true;
    } else if ($.trim(val) == '') {
      return true;
    } else {
      return false;
    }
  }

  namespace.replaceAll = function replaceAll(str, sptr, sptr1) {
    while (str.indexOf(sptr) >= 0) {
      str = str.replace(sptr, sptr1);
    }
    return str;
  }

  namespace.setLoading = function (target) {
    //var divObject = selector;
    var trHtml = '';
    if (target.length > 0) {
      if (target.find(".loadingSpiner").length < 1) {
        trHtml = "<div align='center' class='loadingSpiner' style='height:70px'> <div id='fountainG'> <div id='fountainG_1' class='fountainG'></div> <div id='fountainG_2' class='fountainG'></div> <div id='fountainG_3' class='fountainG'></div> <div id='fountainG_4' class='fountainG'></div> <div id='fountainG_5' class='fountainG'></div> <div id='fountainG_6' class='fountainG'></div> <div id='fountainG_7' class='fountainG'></div> <div id='fountainG_8' class='fountainG'></div> </div> </div>";
        target.append(trHtml);
      } else {
        target.find(".loadingSpiner").show();
      }
      return target.find(".loadingSpiner");
    }
  }

  namespace.setDialog = function (id, title, content, fun) {
    var strHtml = '';
    strHtml += '<div class="modal fade" id="' + id + '"> <div class="modal-dialog" role="' + id + '">';
    strHtml += '<div class="modal-content"> <div class="modal-header">';
    strHtml += '<button class="close" data-dismiss="modal" aria-label="Close"> <span aria-hidden="true">&times;</span> </button>';
    strHtml += '<h4>' + title + '</h4> </div>';
    strHtml += '<div class="modal-body"> <div class="container-fluid"> <div class="col-xs-12">';
    strHtml += '<label>' + content + '</label> </div> </div> </div>';
    strHtml += '<div class="modal-footer"> <button class="btn btn-primary orange-btn" id="confirm">Confirm</button>';
    strHtml += '<button class="btn btn-secondary cancel-btn" data-dismiss="modal" id="cancelMessage">Cancel</button> </div>';
    strHtml += '</div> </div> </div>';
    return $(document.body).append(strHtml);
  }

  var defaultContent = {
    header: "Header",
    body: "Body",
    confirm: "Confirm",
    cancel: "Cancel"
  }; //default content of message box
  var defaultStyle = {
    pattern: "default",
    delay: 0
  }; //default style of message box
  namespace.setMessageBox = function (messageInfo = defaultContent, func, style = defaultStyle) {
    var $messageBox = $("#messageBox");

    function resetMessageBox() {
      $messageBox.find(".modal-footer").show();
      $messageBox.find(".modal-header").css("background-color", "rgb(63, 64, 64)");
      $messageBox.find("#confirm").off("click");
    }

    function setMessageInfo() {
      $messageBox.find(".modal-header").find("h4").text(messageInfo.header);
      $messageBox.find(".modal-body").find("label").text(messageInfo.body);
      if (style.pattern != "alert") {
        if (messageInfo.confirm) {
          $messageBox.find("#confirm").text(messageInfo.confirm);
        } else {
          $messageBox.find("#confirm").text(defaultContent.confirm);
        }
        if (messageInfo.confirm) {
          $messageBox.find("#cancel").text(messageInfo.cancel);
        } else {
          $messageBox.find("#cancel").text(defaultContent.cancel);
        }
        $messageBox.find(".modal-header").css("background-color", "#a32020");
      } else {
        $messageBox.find(".modal-footer").hide();
      }
    }

    function eventBinding() {
      function hideModal() {
        $messageBox.modal("hide");
      }
      if (style.pattern != "alert") {
        $messageBox.find("#confirm").on("click", function () {
          func();
          hideModal();
        });
      } else {
        setTimeout(hideModal, style.delay * 1000);
      }
    }

    try {
      if ($messageBox.length > 0) {
        resetMessageBox();
        setMessageInfo();
        $messageBox.modal();
        eventBinding();
      } else {
        console.log("Error in finding message box modal");
      }
    } catch (e) {
      console.log(e);
    }
  }

})(tools);

$.extend({
  ajaxEx: tools.ajaxEx,
  blockUI: function () {
    $(".body-overlay").show();
  },
  unBlockUI: function () {
    $(".body-overlay").hide();
  }
});

$.fn.formToObject = function () {
  var serializeParams;
  if (this.is("form")) {
    serializeParams = this.serializeArray();
  } else {
    serializeParams = this.find(":input").serializeArray();
  }
  return tools.serializeArrayToObject(serializeParams)
};

$.fn.formToJson = function () {
  var obj = this.formToObject();
  return JSON.stringify(obj);
}
$.fn.clearForm = function () {
  this.find("input").not(":radio").not(":checkbox").not(":button").val("");
  this.find(":checked").prop("checked", false);
  this.find("textarea, select").val("");
  return this;
}
