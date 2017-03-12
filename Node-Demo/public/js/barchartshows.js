$(function(){

  init();

  function init(){
    eventBinding();
    // renderStackedBarChart("#chart");
    renderStackedChart("#chart");
  }

  function eventBinding(){

  }

  function renderStackedChart(div_selector){
    var data = [{"vendor_type":"Insurance","risk_score":["7","2","8","7"],"low_risk":1,"medium_risk":2,"high_risk":1},
        {"vendor_type":"Marketing","risk_score":["9","6","7","8","5","7","10","7","2","2","2"],"low_risk":3,"medium_risk":5,"high_risk":3},
      {"vendor_type":"Operations","risk_score":["9","7","5","7","2","7","3"],"low_risk":2,"medium_risk":4,"high_risk":1},
      {"vendor_type":"Security","risk_score":["7","9","5","5","5","4","7"],"low_risk":1,"medium_risk":5,"high_risk":1},
      {"vendor_type":"Service","risk_score":["7","4","6"],"low_risk":1,"medium_risk":2,"high_risk":0},
      {"vendor_type":"Suppliers","risk_score":["3","7","8","7","9"],"low_risk":1,"medium_risk":2,"high_risk":2},
      {"vendor_type":"Travel","risk_score":["9","8","6","9","3","8","10"],"low_risk":1,"medium_risk":1,"high_risk":5},
      {"vendor_type":"Utilities","risk_score":["2","3","2","3","7","2","6","2"],"low_risk":6,"medium_risk":2,"high_risk":0}];
    console.log("data:",JSON.stringify(data));
    $(div_selector).find("svg").remove();
    var margin = {top:10, right: 20, bottom: 70, left: 40},
      width = $(div_selector).width() - margin.left - margin.right,
      height = $(div_selector).height() - margin.top - margin. bottom;

    var formatPercent = d3.format("%");

    var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);
    var y = d3.scale.linear().range([height, 0]);
    var colors = d3.scale.ordinal().range(["#f9ba27", "#fc722d", "#FF0000"]);

    var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .ticks(5)
      .tickFormat(formatPercent);

    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d){
        return "<strong>Value:</strong><span>" + d.low_risk + "</span>";
      })

    var svg = d3.select(div_selector).append("svg")
      .attr("width", $(div_selector).width())
      .attr("height", $(div_selector).height())
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(tip);

    x.domain(data.map(function(d){ return d.vendor_type;}));
    y.domain([0, 1]);
    colors.domain(d3.keys(data[0]).filter(function(key){return key != "vendor_type" && key != "risk_score";}));

    data.forEach(function(item){
      var y0 = 0;
      item.responses = colors.domain().map(function(response){
        var responseobj = {response: response, y0: 0, yp0: y0};
        y0 += + item[response];
        responseobj.y1 = y0;
        responseobj.yp1 = y0;
        return responseobj;
      });
      item.responses.forEach(function(d) { d.yp0 /= y0; d.yp1 /= y0; });
      item.totalresponses = item.responses[item.responses.length -1].y1;
    });
    console.log("data after:", data);

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
      .attr("class", "grid")
      .call(yAxis.tickSize(-width, 0 ,0).tickFormat(""));

    var category = svg.selectAll(".category")
      .data(data)
      .enter().append("g")
      .attr("class", "category")
      .attr("transform", function(d){ return "translate(" + (x(d.vendor_type)-20) + ",0)"});

    category.selectAll("rect")
      .data(function(d) { return d.responses;})
      .enter().append("rect")
      .attr("x", 30)
      .attr("width", x.rangeBand() - 30)
      .attr("y", function(d) { return y(d.yp1); })
      .attr("height", function(d) { return y(d.yp0) - y(d.yp1); })
      .style("fill", function(d) { return colors(d.response); });

    var translate_left = -(margin.left + width/2 +90);

    var legend = svg.selectAll(".legend")
      .data(["Low Risk", "Medium Risk", "High Risk"])
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(" + calculateTransform(translate_left, i) + "," + (height + margin.top + 20) + ")"; })
      .attr("margin-right", "10px");

    legend.append("rect")
      .attr("x", width)
      .attr("width", 10)
      .attr("height", 10)
      .style("fill", colors);

    legend.append("text")
      .attr("x", width + 12)
      .attr("y", 6)
      .attr("dy", ".35em")
      .attr("font-size", ".9em")
      .style("text-anchor", "start")
      .text(function(d) { return d; });
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

  function renderStackedBarChart(div_selector){
    var margin = {top: 20, right: 231, bottom: 140, left: 40},
      width = 1000 - margin.left - margin.right,
      height = 800 - margin.top - margin.bottom;

    var xscale = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

    var yscale = d3.scale.linear()
      .rangeRound([height, 0]);

    var colors = d3.scale.ordinal()
      .range(["#63c172", "#ee9952", "#46d6c4", "#fee851", "#98bc9a"]);

    var xaxis = d3.svg.axis()
      .scale(xscale)
      .orient("bottom");

    var yaxis = d3.svg.axis()
      .scale(yscale)
      .orient("left")
      .tickFormat(d3.format(".0%")); // **

    var svg = d3.select(div_selector).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// load and handle the data
    d3.json("data.json", function(error, data) {
      console.log("data json:", data);

      // rotate the data
      var categories = d3.keys(data[0]).filter(function(key) { return key != "vendor_type" && key != "risk_score";});
      var parsedata = categories.map(function(name) { return { "label": name }; });
      data.forEach(function(d) {
        parsedata.forEach(function(pd) {
          pd[d["label"]] = d[pd["label"]];
        });
      });

      // map column headers to colors (except for 'Absolutes' and 'Base: All Respondents')
      colors.domain(d3.keys(data[0]).filter(function(key) { return key != "vendor_type" && key != "risk_score";}));

      // add a 'responses' parameter to each row that has the height percentage values for each rect
      data.forEach(function(pd) {
        var y0 = 0;
        // colors.domain() is an array of the column headers (text)
        // pd.responses will be an array of objects with the column header
        // and the range of values it represents
        pd.responses = colors.domain().map(function(response) {
          var responseobj = {response: response, y0: y0, yp0: y0};
          y0 += +pd[response];
          responseobj.y1 = y0;
          responseobj.yp1 = y0;
          return responseobj;
        });
        // y0 is now the sum of all the values in the row for this category
        // convert the range values to percentages
        pd.responses.forEach(function(d) { d.yp0 /= y0; d.yp1 /= y0; });
        // save the total
        pd.totalresponses = pd.responses[pd.responses.length - 1].y1;
      });

      // sort by the value in 'Right Direction'
      // parsedata.sort(function(a, b) { return b.responses[0].yp1 - a.responses[0].yp1; });

      // ordinal-ly map categories to x positions
      xscale.domain(parsedata.map(function(d) { return d.vendor_type; }));

      // x.domain(data.map(function(d){ return d.vendor_type;}));
      // y.domain([0, 1]);


      // add the x axis and rotate its labels
      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xaxis)
        .selectAll("text")
        .attr("y", 5)
        .attr("x", 7)
        .attr("dy", ".35em")
        .attr("transform", "rotate(65)")
        .style("text-anchor", "start");

      // add the y axis
      svg.append("g")
        .attr("class", "y axis")
        .call(yaxis);

      // create svg groups ("g") and place them
      var category = svg.selectAll(".category")
        .data(parsedata)
        .enter().append("g")
        .attr("class", "category")
        .attr("transform", function(d) { return "translate(" + xscale(d.years) + ",0)"; });

      // draw the rects within the groups
      category.selectAll("rect")
        .data(function(d) { return d.responses; })
        .enter().append("rect")
        .attr("width", xscale.rangeBand())
        .attr("y", function(d) { return yscale(d.yp1); })
        .attr("height", function(d) { return yscale(d.yp0) - yscale(d.yp1); })
        .style("fill", function(d) { return colors(d.response); });

      // position the legend elements
      var legend = svg.selectAll(".legend")
        .data(colors.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(20," + ((height - 18) - (i * 20)) + ")"; });

      legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colors);

      legend.append("text")
        .attr("x", width + 10)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text(function(d) { return d; });

      // animation
      d3.selectAll("input").on("change", handleFormClick);

      function handleFormClick() {
        if (this.value === "bypercent") {
          transitionPercent();
        } else {
          transitionCount();
        }
      }

      // transition to 'percent' presentation
      function transitionPercent() {
        // reset the yscale domain to default
        yscale.domain([0, 1]);

        // create the transition
        var trans = svg.transition().duration(250);

        // transition the bars
        var categories = trans.selectAll(".category");
        categories.selectAll("rect")
          .attr("y", function(d) { return yscale(d.yp1); })
          .attr("height", function(d) { return yscale(d.yp0) - yscale(d.yp1); });

        // change the y-axis
        // set the y axis tick format
        yaxis.tickFormat(d3.format(".0%"));
        svg.selectAll(".y.axis").call(yaxis);
      }

      // transition to 'count' presentation
      function transitionCount() {
        // set the yscale domain
        yscale.domain([0, d3.max(data, function(d) { return d.totalresponses; })]);

        // create the transition
        var transone = svg.transition()
          .duration(250);

        // transition the bars (step one)
        var categoriesone = transone.selectAll(".category");
        categoriesone.selectAll("rect")
          .attr("y", function(d) { return this.getBBox().y + this.getBBox().height - (yscale(d.y0) - yscale(d.y1)) })
          .attr("height", function(d) { return yscale(d.y0) - yscale(d.y1); });

        // transition the bars (step two)
        var transtwo = transone.transition()
          .delay(350)
          .duration(350)
          .ease("bounce");
        var categoriestwo = transtwo.selectAll(".category");
        categoriestwo.selectAll("rect")
          .attr("y", function(d) { return yscale(d.y1); });

        // change the y-axis
        // set the y axis tick format
        yaxis.tickFormat(d3.format(".2s"));
        svg.selectAll(".y.axis").call(yaxis);
      }
    });

    d3.select(self.frameElement).style("height", (height + margin.top + margin.bottom) + "px");

  }

})
