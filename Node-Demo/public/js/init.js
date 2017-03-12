//hard-coded to US format MM/DD/YYYY which zero pads day and month < 10
function formatDate(date){
  var date = new Date(date);
  var year = date.getFullYear();
  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;
  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  return month + '/' + day + '/' + year;
}

//hard coded to US format $NNN,NNN.NN
function formatUSD(amount){
  var formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
  return formatter.format(amount);
}

$('.panel-arrow').click(function(){
  if($(this).hasClass('show')){
    //event.stopPropagation();
    $(".body-overlay").fadeIn(500);
    $(".panel-arrow, .side-menu-panel").animate({
      left: "+=260"
    }, 700, function(){
      //Animation complete
    });
    $(this).html('<img src="/img/hide_side_menu.png"/>').removeClass('show').addClass('bg_color');
  } else {
    //event.stopPropagation();
    $(".body-overlay").fadeOut(400);
    $(".panel-arrow, .side-menu-panel").animate({
      left: "-=260"
    }, 700, function(){
      //Animation complete.
    });
    $(this).html('<img src="/img/show_side_menu.png"/>').removeClass('bg_color').addClass('show');
  }

    $('.body-overlay').click(function(){
      $('.panel-arrow').trigger('click');
    });
});

// Reloads webpage when mobile orientation changes
$(window).on('orientationchange', function(e){
  $.mobile.changePage(window.location.href, {
    allowSamePageTransition: true,
    transition: 'none',
    reloadPage: true
  });
});

//Accordian
$('.customaccordion').each(function(){
  var $accordian = $(this);
  $accordian.find('.accordion-head').on('click', function(){
    $(this).parent().find(".accordion-head").removeClass('open close');
    $(this).removeClass('open');
    $accordion.find('.accordion-body').slideUp();
    if(!$(this).next().is(':visible')) {
      $(this).addClass('open');
      $(this).next().slideDown();
    }
  });
});

/**
 * read only process
 */
$(function(){
  //hide menu, only leave "dashboard", "search", "home"
  window.__RAID__.readOnly = $("#readOnly").val();
  if(window.__RAID__.readOnly == "true") {
    var rootMenu = $(".mainmenu");
    rootMenu.find("li[key=workflows]").hide();
    rootMenu.find("li[key=myCronos]").hide();
    rootMenu.find("li[key=admin]").hide();
    rootMenu.find("li[key=survey]").hide();
    rootMenu.find("li[key=reporting]").hide();
  }
})




