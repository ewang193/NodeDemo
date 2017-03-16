$(document).ready(function () {
    var filterTableList = {};
    var filterJson = [];
    var resultsTable;
    // var rootPath = tools.path.rootPath;
    // var workflowPath = tools.path.workflow;
    // var rolePath = tools.path.role;
    // var userPath = tools.path.user;
    // var assignmentPath = tools.path.assignment;
    // var searchPath = tools.path.search;
    // var entityPath = tools.path.entity;
    // var casePath = tools.path.case;
    // var userMngtPath = tools.path.userMngt;
    var assignedOguids = [];
    var userAssigned = [];
    var userList = [];
    var userRoleList = [];
    var batchId = '';
    var alertGuid = '';
    var entityGuid = '';
    var resultsAlert;
    var resultsEntity;
    var searchName = $('#SearchName').val();
    var alertList_width = $("#alertList").width();
    var caseList=[];
    var aggregatedPieChartData = [],
        aggregatedBubbleChartData = [];
    var donutchartlabels = [];
    var currentData = [],
        fullData = initData = [],
        colMap = {
            GUID: "case_guid",
            CASE_UID: "case_uid",
            BATCH_NUM: "batch_num",
            CASE_RISK: "case_risk",
            CASE_TRANS_COUNT: "case_trans_count",
            CASE_TRANS_AMOUNT: "case_trans_amount",
            WORKFLOW_NAME: 'workflow_name',
            POINT_NAME: "point_name",
            GROUP: "group",
            ASSIGNED_USER: "assigned_user",
            USER_ASSIGNED: "user_assigned",
            CASE_OUTCOME: "case_outcome",
            RECOMMENDATION_AFTER: "recommendation_after"
        },
        criteriaGroup = {
            POINT_NAME: [],
            CASE_TRANS_AMOUNT:[],
            CASE_RISK: []
        };

    var d0 = "M0,1 0,36 " + alertList_width + ",36 " + alertList_width + ",18 " + alertList_width +",1 0,1",
        d1 = "M0,1 0,36" + alertList_width + ",36 " + alertList_width + ",18 " + alertList_width +",1 0,1";

    var BubbleChart, root,
        __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    BubbleChart = (function() {

        function BubbleChart(fullData, data, width, height) {
            this.hide_details = __bind(this.hide_details, this);

            this.show_details = __bind(this.show_details, this);

            this.hide_years = __bind(this.hide_years, this);

            this.display_years = __bind(this.display_years, this);

            this.move_towards_year = __bind(this.move_towards_year, this);

            this.display_by_year = __bind(this.display_by_year, this);

            this.move_towards_center = __bind(this.move_towards_center, this);

            this.display_group_all = __bind(this.display_group_all, this);

            this.start = __bind(this.start, this);

            this.create_vis = __bind(this.create_vis, this);

            this.create_nodes = __bind(this.create_nodes, this);

            this.data = data;
            this.fullData = fullData;
            this.padding = {top: -5, right: 5, bottom: -5, left: 5};
            this.width = width;
            this.height = height;
            this.border = "1px solid red";
            this.tooltip = CustomTooltip("gates_tooltip", 240);
            this.center = {
                x: ((this.width -this.padding.left - this.padding.right) / 2 + this.padding.left),
                y: ((this.height - this.padding.top - this.padding.bottom) / 2 + this.padding.top)
            };
            this.year_centers = {
                "#35c167": {
                    x: ((this.width -this.padding.left - this.padding.right) / 2 + this.padding.left),
                    y: ((this.height - this.padding.top - this.padding.bottom)/ 3 + this.padding.top + 80)
                },
                "#f6b61d": {
                    x:  ((this.width -this.padding.left - this.padding.right) / 2 + this.padding.left),
                    y: ((this.height - this.padding.top - this.padding.bottom) / 2 + this.padding.top)
                },
                "#de3228": {
                    x:  ((this.width -this.padding.left - this.padding.right) / 2 + this.padding.left),
                    y: (2 * (this.height - this.padding.top - this.padding.bottom) / 3 + this.padding.top - 78)
                }
            };
            this.layout_gravity = -0.01;
            this.damper = 0.1;
            this.vis = null;
            this.nodes = [];
            this.force = null;
            this.circles = null;
            this.fill_color = d3.scale.ordinal().domain(["low", "medium", "high"]).range(["#35c167", "#f6b61d", "#de3228"]);
            this.max_amount = d3.max(this.fullData, function (d) {
                return parseFloat(d.case_trans_amount);
            });
            this.min_amount = d3.min(this.fullData, function(d){
                return parseFloat(d.case_trans_amount);
            });
            // this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, this.max_amount]).range([2, 85]);
            this.radius_scale = d3.scale.linear().domain([0, this.max_amount]).range([2, 80]);
            this.create_nodes();
            this.create_vis();
        }


        BubbleChart.prototype.create_nodes = function () {
            var _this = this;
            _this.data.forEach(function (d) {
                var node;
                node = {
                    id: d.key,
                    radius: _this.radius_scale(parseFloat(d.value)),
                    value: d.value,
                    name: d.key,
                    // org: d.organization,
                    group: d.group,
                    color: d.color,
                    trans_count: d.trans_count,
                    reviewStage: d.reviewStage,
                    currentReviewer: d.currentReviewer,
                    recommendation: d.recommendation,
                    // year: d.start_year,
                    x: Math.random() * 900,
                    y: Math.random() * 800
                };
                return _this.nodes.push(node);
            });
            return _this.nodes.sort(function (a, b) {
                return b.value - a.value;
            });
        };

        BubbleChart.prototype.create_vis = function () {
            var that,
                _this = this;
            this.vis = d3.select("#donutChart_div").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
            this.circles = this.vis.selectAll("circle").data(this.nodes, function (d) {
                return d.id;
            });
            that = this;
            this.circles.enter().append("circle").attr("r", 0).attr("transform","translate(" + this.padding.left +"," + this.padding.top +")").attr("fill", function (d) {
                return _this.fill_color(d.group);
            }).attr("stroke-width", 2).attr("stroke", function (d) {
                return d3.rgb(_this.fill_color(d.group)).darker();
            }).attr("id", function (d) {
                return "bubble_" + d.id;
            }).on("mousemove", function (d, i) {
                return that.show_details(d, i, this);
            }).on("mouseout", function (d, i) {
                return that.hide_details(d, i, this);
            });
            return this.circles.transition().duration(10).attrTween("r", function (d, i, a) {
                return d3.interpolate(a, String(d.radius));
            });
        };

        BubbleChart.prototype.charge = function (d) {
            return -Math.pow(d.radius, 2.0) / 8;
        };

        BubbleChart.prototype.start = function () {
            return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
        };

        BubbleChart.prototype.display_group_all = function () {
            var _this = this;
            var force_for_node = 5;
            if(this.max_amount >= 35000 && this.max_amount <=45329) {
                force_for_node = 7;
            } else if(this.max_amount>=7020 && this.max_amount < 35000){
                force_for_node = 10;
            }else if(this.max_amount <= 5626) {
                force_for_node = 3;
            }

            this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function (e) {
                return _this.circles.each(_this.move_towards_center(e.alpha * force_for_node)).attr("cx", function (d) {
                    return d.x;
                }).attr("cy", function (d) {
                    return d.y;
                });
            });
            this.force.start();
            return this.hide_years();
        };

        BubbleChart.prototype.move_towards_center = function (alpha) {
            var _this = this;
            return function (d) {
                d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
                return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
            };
        };

        BubbleChart.prototype.display_by_year = function() {
            var _this = this;

            var force_for_node = 1.9;
            // var max_amount = d3.max(this.nodes, function(d){return d.value;});
            if(this.max_amount >= 35000 && this.max_amount <=45329) {
                force_for_node = 3;
            } else if(this.max_amount>=5626 && this.max_amount < 35000){
                force_for_node = 6;
            }else if(this.max_amount <= 5626) {
                force_for_node = 1.5;
            }

            this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function(e) {
                return _this.circles.each(_this.move_towards_year(e.alpha * force_for_node)).attr("cx", function(d) {
                    return d.x;
                }).attr("cy", function(d) {
                    return d.y;
                });
            });
            this.force.start();
            return this.display_years();
        };

        BubbleChart.prototype.move_towards_year = function (alpha) {
            var _this = this;
            return function (d) {
                var target;
                target = _this.year_centers[d.color];
                if(d.color == "#f6b61d"){
                    d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 0.8;
                } else {
                    d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 0.8;
                }

                return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 0.9;
            };
        };

        BubbleChart.prototype.display_years = function () {
            var years, years_data, years_x,
                _this = this;
            years_x = {
                "2008": 160,
                "2009": this.width / 2,
                "2010": this.width - 160
            };
            years_data = d3.keys(years_x);
            years = this.vis.selectAll(".years").data(years_data);
            return years.enter().append("text").attr("class", "years").attr("x", function (d) {
                return years_x[d];
            }).attr("display", "none")
                .attr("y", 40).attr("text-anchor", "middle").text(function (d) {
                    return d;
                });
        };

        BubbleChart.prototype.hide_years = function () {
            var years;
            return years = this.vis.selectAll(".years").remove();
        };

        BubbleChart.prototype.show_details = function (data, i, element) {
            var content;
            d3.select(element).attr("stroke", "grey");
            content = "<span class=\"name\">Count of Transactions:</span><span class=\"value\">" + (data["trans_count"]) + "</span><br/>";
            content += "<span class=\"name\">Sum of Transactions:</span><span class=\"value\"> $" + (addCommas(data["value"])) + "</span><br/>";
            content += "<span class=\"name\">Current Review Stage:</span><span class=\"value\">" + (data["reviewStage"]) + "</span><br/>";
            content += "<span class=\"name\">Current Reviewer:</span><span class=\"value\">" + (data["currentReviewer"]) + "</span><br/>";
            content += "<span class=\"name\">Recommendation:</span><span class=\"value\"> " + data["recommendation"] + "</span>";
            return this.tooltip.showTooltip(content, d3.event);
        };

        BubbleChart.prototype.hide_details = function (data, i, element) {
            var _this = this;
            d3.select(element).attr("stroke", function (d) {
                return d3.rgb(_this.fill_color(d.group)).darker();
            });
            return this.tooltip.hideTooltip();
        };

        return BubbleChart;
    })();

    root = typeof exports !== "undefined" && exports !== null ? exports : this;

    init();

    function init() {
        getRole();
        initBatchListTable();
        initAlertListTable();
        initEntityListTable();
        initPage();
        eventBinding();
        getWorkflowData();
        getUserRoleList();
        initSearchResultTable();
    }

    function initBatchListTable() {
        var data = [{"batch_guid":"50b7bdde-33ad-4e86-9607-4deed5d7c2fe","batch_num":"2","batch_date":"2016-11-28T10:04:02.675Z","trans_count":"60"},
            {"batch_guid":"61aaabee-8dba-4459-88df-4fe729bad002","batch_num":"1","batch_date":"2016-11-28T10:03:58.007Z","trans_count":"52"}];
        setBatchListTable(data);


        // $.ajaxEx({
        //     url: casePath + "/caseBatch",
        //     method: "post",
        //     success: function (res) {
        //         if (res.code == 0) {
        //             setBatchListTable(res.data);
        //         } else {
        //             console.log(res);
        //         }
        //     },
        //     error: function (res) {
        //         console.log(res);
        //     }
        // })
    }

    function setBatchListTable(data) {
        var dataTableOption = getDataTableOption();
        dataTableOption.data = data;
        dataTableOption.order = [1, 'asc'];
        // dataTableOption.deferRender = true;
        dataTableOption.dom = '<"top"<"pull-right"f>>rt<"bottom"<"pull-right"p>><"clear">'
        dataTableOption.columns = [
            {
                data: "batch_guid",
                render: function (data, type, row) {
                    return '<input class="action-select" id="' + row.batch_guid + '" type="checkbox" data-group="batch_guid" value="' + row.batch_guid + '"><label for="' + row.batch_guid + '">&nbsp;</label>'
                }
            },
            {data: "batch_num"},
            {
                data: "batch_date",
                render: function (data) {
                    return tools.formatDate(data);
                }
            },
            {data: "trans_count"}
        ];
        $('#batchList').DataTable().destroy();
        $('#batchList').DataTable(dataTableOption);
    }

    function getDataTableOption(){
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
        return dataTableOption;
    }

    function initAlertListTable() {
        var data = [{"alert_type_id":"1","alert_type":"Round Dollar < 10000","cust_count":"33","case_count":"33","trans_count":"66"},
            {"alert_type_id":"2","alert_type":"Round Dollar > 10000","cust_count":"11","case_count":"11","trans_count":"32"},
            {"alert_type_id":"3","alert_type":"Address Not Found","cust_count":"22","case_count":"22","trans_count":"46"},
            {"alert_type_id":"4","alert_type":"Amount > 50000","cust_count":"20","case_count":"20","trans_count":"40"},
            {"alert_type_id":"5","alert_type":"> 100 Transactions","cust_count":"27","case_count":"27","trans_count":"66"}];
        setAlertListTable(data);

        // $.ajaxEx({
        //     url: searchPath + "/alertsAgg",
        //     data: {
        //         case_guid: '',
        //         cust_guid: ''
        //     },
        //     method: "post",
        //     success: function (res) {
        //         if (res.code == 0) {
        //             setAlertListTable(res.data);
        //         } else {
        //             console.log(res);
        //         }
        //     },
        //     error: function (res) {
        //         console.log(res);
        //     }
        // })
    }

    function setAlertListTable(data) {
        var dataTableOption = tools.getDataTableOption();
        dataTableOption.iDisplayLength = 15;
        dataTableOption.data = data;
        dataTableOption.dom = '<"top">rt<"bottom"<"pull-right"p>><"clear">';
        dataTableOption.columns = [
            {data: "alert_type"},
            {
                data: "case_count",
                render: function (data, type, row) {
                    return data + '<span class="right alert-item" id=' + row.alert_type_id + '><i class="material-icons alert-triangle">play_arrow</i></span>'
                }
            }
        ];
        $('#alertList').DataTable().destroy();
        resultsAlert = $('#alertList').DataTable(dataTableOption);
    }

    function initEntityListTable() {
        var entityList_data = [{"cust_guid":"960454cd-6b4b-46ef-bf7f-577f8d324e81","cust_number":"1002","cust_name":"We Sell Stuff, Inc","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"5b01bb28-2073-40ad-a8bf-ca4913f16692","cust_number":"1003","cust_name":"Front Door Corp","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"779c42e2-58f4-498f-a702-2f896dbd9622","cust_number":"1004","cust_name":"MoneyFilter.com","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"48469390-f56a-4519-b28e-e70eaec11e71","cust_number":"1005","cust_name":"Sell N Go","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"40a32ed8-3ed5-4ca0-b809-3563159182a3","cust_number":"0074-6594","cust_name":"Dabshots","case_count":"2","alert_count":"2","trans_count":"5"},{"cust_guid":"40ffcb07-49c3-45b0-b727-afb28ffbf1d4","cust_number":"43455-0002","cust_name":"Skyble","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"612c9146-555a-4df6-a630-dbc46e1b0d87","cust_number":"45014-137","cust_name":"Photolist","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"0a910f0e-707f-482e-a0ef-7517129432d5","cust_number":"41520-189","cust_name":"Brainsphere","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"fea2114c-86b1-42bb-83b2-0ed11e96c9a0","cust_number":"0378-9681","cust_name":"Shuffledrive","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"ace1ea12-99ea-41dc-b688-79509ba9605f","cust_number":"52125-455","cust_name":"Vitz","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"823f3644-e9c4-43c6-b96c-1f5482b75382","cust_number":"55289-410","cust_name":"Skiptube","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"ca06b45d-eebf-44fd-a33d-e258ac445cba","cust_number":"0955-1012","cust_name":"Avaveo","case_count":"1","alert_count":"1","trans_count":"5"},{"cust_guid":"7e5d0118-344a-4d2b-8b45-8b82b155cd16","cust_number":"52686-319","cust_name":"Janyx","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"77ba7b8b-f28e-4034-bdf3-6da28129bf97","cust_number":"0407-1412","cust_name":"Gabtune","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"a87c8d6d-0bba-4393-a29f-61fb55783d39","cust_number":"21130-084","cust_name":"Kare","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"b69b1966-2b5d-473a-9736-829bf86ed033","cust_number":"10006-009","cust_name":"Quire","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"11e716c4-446b-472d-a92b-8b1212e5ac0f","cust_number":"0169-6339","cust_name":"Ailane","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"d347bc16-18df-46c4-b7b5-efe9a8f394f5","cust_number":"63401-681","cust_name":"Cogilith","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"5d0e117b-b0b4-4dae-bb9b-b7ecd69bcade","cust_number":"68094-586","cust_name":"Fiveclub","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"56a5c705-3f01-4592-bd5d-8aca7e3c2cd5","cust_number":"54569-4742","cust_name":"Trilith","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"307a0947-bd2a-4c7a-ad67-4119fde2e558","cust_number":"64942-1169","cust_name":"Plambee","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"8880e7c1-9a55-45e1-8749-fc189f1e51f2","cust_number":"41167-4002","cust_name":"Riffwire","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"a543c5cc-3407-4ef9-8539-fbf336adefa0","cust_number":"68462-297","cust_name":"Dablist","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"f3284b1d-7405-427d-bd5c-4c1c349533fb","cust_number":"0093-1003","cust_name":"Skimia","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"8d3fed8c-32cc-4934-9cce-ad6f70764385","cust_number":"55714-4456","cust_name":"Flashset","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"c823fdec-ce5f-4fdc-9365-65d4b2956cd5","cust_number":"49288-0802","cust_name":"Demizz","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"346c6edd-7f1f-45aa-a3f9-eaa692a6f3e8","cust_number":"49035-227","cust_name":"Wikizz","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"e6e0306f-6651-43cd-bef0-32186fe54653","cust_number":"64980-182","cust_name":"Eidel","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"d1ee85e0-c7e0-4f03-8b0a-5444ab08d187","cust_number":"55154-2537","cust_name":"Quimm","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"5a187977-0bcf-4ca9-9e4b-c8eab89fe74d","cust_number":"65162-521","cust_name":"Kwilith","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"0ccbe9fe-ff00-4599-bc93-f2c653abce74","cust_number":"21695-665","cust_name":"Skilith","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"7561d8b1-ba99-4fc6-88df-d25f2781d315","cust_number":"59469-170","cust_name":"Gigaclub","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"8c8110a8-b78d-4c62-af61-f5d1a8021568","cust_number":"35356-699","cust_name":"Voonte","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"267d1d84-5fe2-434e-b264-d14d88bc26c8","cust_number":"63940-542","cust_name":"Yacero","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"12075af0-fa23-4c43-98eb-d931d618f80a","cust_number":"11026-2780","cust_name":"Wordify","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"355adcc2-8ea6-44de-ae4d-6221a56f5c48","cust_number":"13537-441","cust_name":"Youfeed","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"0c24e2a4-5127-4917-a9ae-3e4b7dd88d39","cust_number":"63304-347","cust_name":"Shufflester","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"0383b7c7-3d38-41b8-a6ea-2671ac9caa60","cust_number":"67046-084","cust_name":"Shuffletag","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"fe4247d1-a858-4363-adf1-06fdd108f320","cust_number":"63174-172","cust_name":"Vinte","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"24d71928-23b7-44b5-86b4-e9f57dc1153a","cust_number":"65862-015","cust_name":"Realpoint","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"94465fc8-f380-4d11-9ae1-bcf37330db03","cust_number":"68745-2027","cust_name":"Aimbo","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"65e9f19d-921b-44bb-9d79-7da7cb764ad5","cust_number":"49884-029","cust_name":"Jaxnation","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"73effcb1-28a1-4241-b15d-3437f6d73a73","cust_number":"0093-6901","cust_name":"Pixonyx","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"ebaa5c9d-27cd-42c4-aadc-e6e773f5283e","cust_number":"48951-8084","cust_name":"Photojam","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"850cdb98-5b72-45ad-b981-92d56a51f73b","cust_number":"0456-1405","cust_name":"Trilia","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"5f1c8b7f-8970-4624-831e-aecee5a14851","cust_number":"60760-106","cust_name":"Lazzy","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"011550a3-1fe3-4b7a-a048-490cb1de6db8","cust_number":"54868-4969","cust_name":"Trudeo","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"84bed7f2-c577-403a-914c-0f86289d4a9c","cust_number":"58118-1116","cust_name":"Cogidoo","case_count":"1","alert_count":"1","trans_count":"7"},{"cust_guid":"30f72130-e3c4-493d-9d86-f8c0806d2772","cust_number":"54272-101","cust_name":"Camido","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"da93f0be-9d80-4d77-8b1c-e23a2a2da273","cust_number":"68745-1095","cust_name":"Tazz","case_count":"1","alert_count":"1","trans_count":"5"},{"cust_guid":"88c9d9fb-3e4e-4ac3-b956-7a8bf50ed634","cust_number":"61715-029","cust_name":"Twitterbridge","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"0fca2616-e490-4d55-987b-c52ab3c6e2f6","cust_number":"63629-3707","cust_name":"Devify","case_count":"1","alert_count":"1","trans_count":"5"},{"cust_guid":"e4581082-45af-4374-bec9-f0bbdf6e0e0a","cust_number":"65224-804","cust_name":"Fivechat","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"2760bb12-3480-4480-8845-50c836cbb4c3","cust_number":"58988-0031","cust_name":"Zoombeat","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"c230efd6-7c73-419d-90e2-29e45f727079","cust_number":"54868-0032","cust_name":"Photobug","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"810b65c1-ecc3-4290-9975-b46c82158c3a","cust_number":"15054-0530","cust_name":"Brainlounge","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"e10a4d3e-04f1-45ef-89cf-99b99bde54a0","cust_number":"55312-384","cust_name":"Fanoodle","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"a190c603-bc6a-47cb-91cf-0f71b0511a9a","cust_number":"0485-0057","cust_name":"Mymm","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"e901e624-1c53-4bd0-9547-d0bc0dae32a2","cust_number":"53808-0457","cust_name":"Jaxbean","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"58c3e733-a44b-4884-9bec-e957cfd079a4","cust_number":"58503-065","cust_name":"Kwimbee","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"0d974aac-2809-44fc-ba65-00c5bdebe8cb","cust_number":"16729-277","cust_name":"Innotype","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"136d789b-f31a-4f42-a35c-56bf35a316da","cust_number":"56062-458","cust_name":"Yabox","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"84754bf0-401c-43aa-8049-509eb78fc0a6","cust_number":"67473-103","cust_name":"Blogspan","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"af57166d-0fe2-4644-82c0-9e0e66da05fa","cust_number":"10345-036","cust_name":"Oozz","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"c3e91f62-27af-47bd-8de8-a90b7348b65d","cust_number":"54868-6185","cust_name":"Mita","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"5b354197-e67d-4645-99d0-8521cd016766","cust_number":"51791-001","cust_name":"Lajo","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"f856eecc-2825-4490-8803-2dd5bbf4428a","cust_number":"41167-0061","cust_name":"Realblab","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"c92e4c9b-cad3-4c5e-82a6-491b019af50a","cust_number":"41163-466","cust_name":"Aibox","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"187d7d2c-c124-4432-9c21-38036060a386","cust_number":"63868-807","cust_name":"Thoughtworks","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"490424b4-e148-4fee-88dd-a5190d58d1bb","cust_number":"55154-4381","cust_name":"Leexo","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"ffc84b5c-84b2-46ca-a724-73a5f108ec2f","cust_number":"24385-296","cust_name":"Meezzy","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"bf340a3c-a85f-4935-ad74-adcfc3b5d043","cust_number":"58118-5686","cust_name":"Dabvine","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"24d8feae-d082-46c3-b034-71b0943c5010","cust_number":"49288-0198","cust_name":"Twimm","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"7dff0b45-35d2-4219-ad80-d748a6daef8a","cust_number":"55056-0818","cust_name":"Flipbug","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"7740e167-8bea-4349-81d7-f366c49b3e16","cust_number":"17856-0088","cust_name":"Jetwire","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"cf8ab013-06bc-450e-b269-5b22864fbbce","cust_number":"10191-1937","cust_name":"Kayveo","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"5f9a02be-f744-413d-9dae-aad467279086","cust_number":"50436-4032","cust_name":"Gabcube","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"fbfc9812-5192-4acc-8887-7f798bfca2a4","cust_number":"54365-400","cust_name":"Thoughtstorm","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"1133dd50-df52-4637-a853-d9cbb5b1f9be","cust_number":"41250-193","cust_name":"Rooxo","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"63f5cb1a-43fb-469b-b6a3-9924062a5739","cust_number":"63629-5325","cust_name":"Myworks","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"2bbba761-5200-44d5-8501-bb50011b5ee7","cust_number":"36987-3418","cust_name":"Zoonoodle","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"63269d90-1588-47e4-ad72-be94bf10f164","cust_number":"59762-4320","cust_name":"Dynazzy","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"94a44ebf-533d-402b-b3cf-01934a869fa6","cust_number":"65923-514","cust_name":"Quaxo","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"e8de5588-07a1-4f0c-ab6e-74fb5a3b872f","cust_number":"50436-4034","cust_name":"Twitterwire","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"ea55c656-1cbb-417c-81f3-02055a6772dc","cust_number":"58930-035","cust_name":"Photobean","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"ebf1340a-891d-40c5-adf4-007dd5e6a3f8","cust_number":"43742-0382","cust_name":"Kamba","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"1283da3a-d8f7-4e42-9d79-4df936626371","cust_number":"55316-886","cust_name":"Blogtags","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"1de6e796-9158-4de9-af94-9efb68676e4e","cust_number":"50827-650","cust_name":"Feedfish","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"cfd7280f-9dcb-44b5-bdbd-0a8049a25e23","cust_number":"57691-584","cust_name":"Skiba","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"9ddbd969-f8ea-44b7-8416-1fc7c2ed594b","cust_number":"67544-024","cust_name":"Edgeclub","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"3dc84314-6149-4f04-afd4-a12201183936","cust_number":"48951-3160","cust_name":"Mydeo","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"e30e19b7-e172-4a9d-a0d4-47b60569e5c2","cust_number":"65044-1744","cust_name":"Oba","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"593e3dbf-7f07-4fe0-a145-7c6dcbc13b3b","cust_number":"51862-172","cust_name":"Kazu","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"0b1fe8da-08b8-4709-ba30-ffc1c87f561b","cust_number":"33261-090","cust_name":"Tambee","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"84ed42a5-06b3-4b7c-b78d-67d3d88545ee","cust_number":"63868-257","cust_name":"Muxo","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"61b83cd9-a29d-44b4-9c8d-963374c77a05","cust_number":"43353-414","cust_name":"Rhyloo","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"d5b3f8e5-93b0-4454-9e5f-c13d7702d783","cust_number":"76287-576","cust_name":"Thoughtmix","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"f01a8613-fb24-4e74-8e5c-5db390b7aa83","cust_number":"55154-3396","cust_name":"Brightbean","case_count":"1","alert_count":"1","trans_count":"4"},{"cust_guid":"5a399d16-d4b1-4895-a21e-36ed3eaa25ee","cust_number":"68737-235","cust_name":"Wikivu","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"33e04b79-59e4-48bc-af2a-efced82e7b30","cust_number":"52959-410","cust_name":"Snaptags","case_count":"1","alert_count":"1","trans_count":"5"},{"cust_guid":"ad16e5e9-ef75-4676-a8d5-f4cb7eed98df","cust_number":"0517-0955","cust_name":"Tekfly","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"ca993c0e-7c43-4b99-a982-412c699dfed6","cust_number":"50972-273","cust_name":"Avavee","case_count":"1","alert_count":"1","trans_count":"5"},{"cust_guid":"380ad31e-00eb-43ae-a883-0a2e471c8569","cust_number":"53808-0581","cust_name":"Topicshots","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"08aa6120-c51d-4345-9172-9966e1c437c6","cust_number":"53645-1111","cust_name":"Wordtune","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"3eda2d53-1ac2-4a68-8d00-57cd9b09877b","cust_number":"11344-961","cust_name":"Linklinks","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"066c1e09-45f3-4887-9699-07a5140441d7","cust_number":"62856-280","cust_name":"Fivebridge","case_count":"1","alert_count":"1","trans_count":"1"},{"cust_guid":"4ce2e702-eaa9-447b-af9a-2ae3554c3d68","cust_number":"49781-099","cust_name":"Realfire","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"7608f490-e6bd-4af7-9ee5-ef6e10e38032","cust_number":"36987-2611","cust_name":"Blogtag","case_count":"1","alert_count":"1","trans_count":"2"},{"cust_guid":"96e7e333-e066-4b1c-8ae3-aaa249af8381","cust_number":"60505-3718","cust_name":"Voonyx","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"d1c1684f-1884-4b3f-b2b6-1566c333bed0","cust_number":"63029-062","cust_name":"Jabbertype","case_count":"1","alert_count":"1","trans_count":"3"},{"cust_guid":"78473def-066c-48e0-b13d-dcee58572255","cust_number":"54973-7505","cust_name":"Gabspot","case_count":"1","alert_count":"1","trans_count":"5"},{"cust_guid":"3b6c82c5-4161-45ec-a778-5ccf091dc0d7","cust_number":"63824-474","cust_name":"Topicblab","case_count":"1","alert_count":"1","trans_count":"5"}];

        setEntityListTable(entityList_data);

        // $.ajaxEx({
        //     url: "/case" + "/caseEntity",
        //     method: "post",
        //     success: function (res) {
        //         if (res.code == 0) {
        //             setEntityListTable(res.data);
        //         } else {
        //             console.log(res);
        //         }
        //     },
        //     error: function (res) {
        //         console.log(res);
        //     }
        // })
    }

    function setEntityListTable(data) {
        var dataTableOption = tools.getDataTableOption();
        dataTableOption.iDisplayLength = 15;
        dataTableOption.data = data;
        dataTableOption.order = [1, 'asc'];
        dataTableOption.dom = '<"top">rt<"bottom"<"pull-right"p>><"clear">';
        dataTableOption.columns = [
            {
                data: "cust_name",
                "render": function (data, type, row) {
                    return '<a href="' + "/CERBERUS" + "/entity" + '/entityDetails/' + row.cust_guid + '">' + data + '</a>'
                }
            },
            {
                data: "trans_count",
                render: function (data, type, row) {
                    return data + '<span class="right entity-item" id=' + row.cust_guid + '><i class="material-icons entity-triangle">play_arrow</i></span>'
                }
            }
        ];
        $('#entityList').DataTable().destroy();
        resultsEntity = $('#entityList').DataTable(dataTableOption);

    }

    function initSearchResultTable() {
        showSearchProgress();
        getCaseList(true, batchId, alertGuid, entityGuid);
    }

    function setSearchResultTable(data) {
        var dataTableOption = tools.getDataTableOption();
        dataTableOption.iDisplayLength = 10;
        dataTableOption.data = data;
        dataTableOption.columns = [
            {
                data: "key",
                "render": function (data, type, row) {
                    return '<a href="' + "/CERBERUS" + '/case' + '/case-summary/' + row.key + '">' + row.case_uid + '</a>'
                }
            },
            {data: "batch_num"},
            {data: "case_risk"},
            {data: "trans_count"},
            {
                data: "value",
                render: function (data, type, full) {
                    return tools.formatUSD(data);
                }
            },
            {
                data: "workflow_name",
                render: function (data, type, row) {
                    if (data) {
                        return data;
                    } else {
                        return '<input class="action-select" id="' + row.key + 'b" type="checkbox" data-group="workflow" value="' + row.key + '"><label for="' + row.key + 'b">&nbsp;</label>'
                    }
                }
            },
            {
                data: "assigned_user",
                render: function (data, type, row) {
                    if (data) {
                        return data;
                    } else {
                        return '<input class="action-select" id="' + row.key + 'a" type="checkbox" data-group="assign" value="' + row.key + '"><label for="' + row.key + 'a">&nbsp;</label>'
                    }

                }
            },
            {data: "case_outcome"}
        ];
        dataTableOption.aoColumnDefs = [
            {
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).css('width', '7%');
                },
                aTargets: [0]
            },
            {
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    if (sData >= 0.7) {
                        $(nTd).html('<span class="chip-td light-red">' + sData + '</span>');
                    } else if (sData > 0.3 && sData < 0.7) {
                        $(nTd).html('<span class="chip-td light-orange">' + sData + '</span>');
                    } else {
                        $(nTd).html('<span class="chip-td light-green">' + sData + '</span>');
                    }
                },
                aTargets: [2]
            },
            {
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    $(nTd).addClass('right').css('padding-right', '45px');
                },
                aTargets: [4]
            }
        ];
        $('#searchResults').DataTable().destroy();
        resultsTable = $('#searchResults').DataTable(dataTableOption);
    }

    function getWorkflowData() {
        var dataTableOption = tools.getDataTableOption();
        dataTableOption.sDom = "t";
        dataTableOption.bFilterOnEnter = true;
        dataTableOption.bSort = false;
        dataTableOption.oLanguage = {sZeroRecords: "No records found. Create a workflow"};
        dataTableOption.serverSide = false;
        dataTableOption.columns = [
            {"data": "name"},
            {"data": "flowUID"},
            {"data": "flowUID"},
            {"data": "flowUID"},
            {"data": "flowUID"}
        ];
        dataTableOption.aoColumnDefs = [
            {
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    if (oData.flowPoints) {
                        $(nTd).text(oData.flowPoints.length);
                    } else {
                        $(nTd).text(0);
                    }
                },
                aTargets: [1]
            }, {
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    if (oData.flowEvents) {
                        $(nTd).text(oData.flowEvents.length)
                    } else {
                        $(nTd).text(0);
                    }
                },
                aTargets: [2]
            }, {
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    var sHtml = '<input type="radio" name="flowID" id="test' + sData + '" value="' + sData + '" /><label for="test' + sData + '"></label>';
                    $(nTd).html(sHtml);
                },
                aTargets: [3]
            }, {
                fnCreatedCell: function (nTd, sData, oData, iRow, iCol) {
                    var sHtml = '<a href="javascript:void(0)" data-flowuid="' + sData + '" data-click="edit" onclick="editWorkflow(this)" class="removeFilter"><i class="fa fa-pencil"></i></a> ';
                    sHtml += '<a href="javascript:void(0)" data-flowuid="' + sData + '" data-click="delete" onclick="openDeleteModal(this)" class="removeFilter"><i class="fa fa-trash-o"></i></a>';
                    $(nTd).html(sHtml);
                },
                aTargets: [4]
            }];
        $("#workflowTable").DataTable().destroy();

        var workflow_data = [{"wfm_uid":"2","projectUID":"sd0ebba0-5dfa-11e6-8632-6f782cd80ccc","flowUID":"9b0edc9d-5c3c-4818-90d7-5b0f0439cf71","name":"Multi Flow","type":"Multi Flow","description":"Multi Flow","draw2d":"[{\"type\":\"WorkflowShape.WorkflowStart\",\"id\":\"87d742b4-7ece-1247-d18a-0c46b2ec6268\",\"x\":92,\"y\":177,\"width\":100,\"height\":100,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"Start Flow.\",\"type\":\"startFlow\",\"name\":\"L1\",\"customerID\":\"L1\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"537dc480-c104-11e6-a3e3-79e57e11b134\"},\"cssClass\":\"WorkflowShape_WorkflowStart\",\"ports\":[{\"id\":\"d0fc3834-cbe7-5bba-8251-569696355b61\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator\"},{\"id\":\"20e8bb13-52b6-9ab2-3a9b-346ef27460bf\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator\"},{\"id\":\"148af610-7e1c-b3e4-b409-e55293b9c853\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator\"},{\"id\":\"cdfeb2dd-ab25-0dee-ade3-5b047559f0bc\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator\"},{\"id\":\"a593d9ab-8214-8ec4-a3f1-f65f1a996de4\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthWestPortLocator\"},{\"id\":\"be3bca1a-a32b-e36d-17a5-d73278384f4d\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthEastPortLocator\"},{\"id\":\"e8d3072f-ff43-c974-fccc-68b03d572428\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthWestPortLocator\"},{\"id\":\"e54e3b99-bc78-9a74-1a14-e60fcf3226de\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthEastPortLocator\"}],\"bgColor\":\"#228B22\",\"color\":\"#000000\",\"stroke\":1,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"cb94269f-9b3b-73f5-87c2-ba998e6abefd\",\"text\":\"L1\\n(L1)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.WorkflowProcess\",\"id\":\"b197f0b6-3fed-e368-8d82-ce5ec6660745\",\"x\":344,\"y\":91,\"width\":150,\"height\":60,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"Process Queue.\",\"type\":\"processQueue\",\"name\":\"L2\",\"customerID\":\"L2\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"aff94e00-c104-11e6-a3e3-79e57e11b134\"},\"cssClass\":\"WorkflowShape_WorkflowProcessqueue\",\"ports\":[{\"id\":\"86666dd6-d4d4-7df9-11aa-ae7b9da430ff\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator1\"},{\"id\":\"55c2243d-9127-a0a8-f112-df7e040a5064\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator2\"},{\"id\":\"1d40b470-19f6-c2c2-3ef1-b9d748345bbc\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator1\"},{\"id\":\"b1e9badc-fe03-0a49-4558-d11e6b7ee9df\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator2\"},{\"id\":\"0f27571a-a061-73a0-49da-c67f4a30ecce\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator1\"},{\"id\":\"66146ce1-2550-00a7-bb36-182816770840\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator2\"},{\"id\":\"0a88af6c-13c4-5db0-c47d-597d0987316d\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator1\"},{\"id\":\"8451c2f1-ed62-f4c8-ff3a-d643fc58d93f\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator2\"}],\"bgColor\":\"#2B669A\",\"color\":\"#000000\",\"stroke\":1,\"radius\":10,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"2e3e0b18-8c4d-502b-28a9-a57b8c1250ca\",\"text\":\"L2\\n(L2)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.WorkflowProcess\",\"id\":\"229ea75a-587f-174c-fdc0-5861787e7df0\",\"x\":354,\"y\":304,\"width\":150,\"height\":60,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"Process Queue.\",\"type\":\"processQueue\",\"name\":\"QA\",\"customerID\":\"QA_2\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"e4cb0880-c104-11e6-a3e3-79e57e11b134\"},\"cssClass\":\"WorkflowShape_WorkflowProcessqueue\",\"ports\":[{\"id\":\"e9ca44bf-34b0-abed-b7c5-6bf7bf5a27df\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator1\"},{\"id\":\"aa1580a9-e3ba-5f09-c33e-79909faae22f\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator2\"},{\"id\":\"311b1fd5-4b42-8faa-130b-6cb3fc864dea\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator1\"},{\"id\":\"c30becfe-c017-516e-59ef-bcb81b958998\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator2\"},{\"id\":\"900caa79-901d-ce4d-6625-afa197087998\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator1\"},{\"id\":\"b3cb2145-c26d-e788-0206-609e65db3ed2\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator2\"},{\"id\":\"1f7bafa8-066a-9bf3-ac71-655eb9650641\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator1\"},{\"id\":\"d5493e8a-acad-6eb6-7f2d-6e7153e9db59\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator2\"}],\"bgColor\":\"#2B669A\",\"color\":\"#000000\",\"stroke\":1,\"radius\":10,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"ef96230b-1bcb-2fb3-8ef6-95e9118bbc8e\",\"text\":\"QA\\n(QA_2)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.WorkflowProcess\",\"id\":\"bd10eff6-30db-4cdd-3fd0-5b745825c4ff\",\"x\":647,\"y\":189,\"width\":150,\"height\":60,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"Process Queue.\",\"type\":\"processQueue\",\"name\":\"L4\",\"customerID\":\"L4\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"ef885870-c10b-11e6-a578-215bd3c6e474\"},\"cssClass\":\"WorkflowShape_WorkflowProcessqueue\",\"ports\":[{\"id\":\"f726e4e5-2fe6-b817-27f5-31bc175f67ed\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator1\"},{\"id\":\"950870ec-f8d5-747c-3b90-a98836008fc8\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator2\"},{\"id\":\"5068a35c-b71a-d23b-63c3-574fb32fd31c\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator1\"},{\"id\":\"9a772ddf-9944-897f-d9dd-889cad5120f8\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator2\"},{\"id\":\"26c915ed-53ea-c154-480b-5016371b3590\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator1\"},{\"id\":\"82d8636b-385a-b44c-385d-b392f27142fc\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator2\"},{\"id\":\"2cf7a5b5-b78a-292e-f105-e4a5c3c57f64\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator1\"},{\"id\":\"fa339118-9882-be44-6c06-b4851f4baba2\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator2\"}],\"bgColor\":\"#2B669A\",\"color\":\"#000000\",\"stroke\":1,\"radius\":10,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"d434b7f8-a456-b99d-7c4e-6aca40954f7d\",\"text\":\"L4\\n(L4)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.WorkflowEnd\",\"id\":\"c0d4cd01-77a5-96b9-8309-361afbe68b22\",\"x\":1065,\"y\":161,\"width\":100,\"height\":100,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"End Flow.\",\"type\":\"endFlow\",\"name\":\"Completed\",\"customerID\":\"id\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"f21b6390-c104-11e6-a3e3-79e57e11b134\"},\"cssClass\":\"WorkflowShape_WorkflowEnd\",\"ports\":[{\"id\":\"1d34cb61-114b-05bc-3b50-6beae1e26a83\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator\"},{\"id\":\"c9d9680a-8c07-8603-6b59-891115f4e2c7\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator\"},{\"id\":\"12d44994-66af-9d21-e020-bb607ba64cd2\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator\"},{\"id\":\"cb6d7e04-1f45-cb34-6b01-4c8430309664\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator\"},{\"id\":\"3bd40aad-8336-a9c5-d0cb-fd52ff4300ee\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthWestPortLocator\"},{\"id\":\"95708700-5175-eac8-9faf-d2039d50a383\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthEastPortLocator\"},{\"id\":\"fef9aec1-fa34-e525-8b02-71bc3ecb41ca\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthWestPortLocator\"},{\"id\":\"c7d657cf-ea50-dba0-954a-ffa3bf85cc12\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthEastPortLocator\"}],\"bgColor\":\"#C9302C\",\"color\":\"#000000\",\"stroke\":1,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"4dc53e84-e220-3ff1-70a7-13f04029b8ca\",\"text\":\"Completed\\n(id)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"442f2e91-e9d2-7a8b-2d53-fdaf298ac7b2\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Mark Completed\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":797,\"y\":209},{\"x\":931,\"y\":209},{\"x\":931,\"y\":211},{\"x\":1065,\"y\":211}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":1,\"toDir\":3},\"source\":{\"node\":\"bd10eff6-30db-4cdd-3fd0-5b745825c4ff\",\"port\":\"output5\"},\"target\":{\"node\":\"c0d4cd01-77a5-96b9-8309-361afbe68b22\",\"port\":\"output3\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"67fd57ec-6412-8a2d-0254-ffb755268d88\",\"text\":\"Mark Completed()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"60e518ec-985b-aa09-4247-e0098104a482\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Send to L4\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":504,\"y\":324},{\"x\":575.5,\"y\":324},{\"x\":575.5,\"y\":229},{\"x\":647,\"y\":229}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":1,\"toDir\":3},\"source\":{\"node\":\"229ea75a-587f-174c-fdc0-5861787e7df0\",\"port\":\"output5\"},\"target\":{\"node\":\"bd10eff6-30db-4cdd-3fd0-5b745825c4ff\",\"port\":\"output6\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"a9631950-d8e6-06cc-aec6-e34ede060bf1\",\"text\":\"Send to L4()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"cca0c053-837e-a2fb-05b1-6af0b7a4ec9f\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Send to QA_2\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":177.35533905932738,\"y\":262.3553390593274},{\"x\":177.35533905932738,\"y\":324},{\"x\":354,\"y\":324}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":2,\"toDir\":3},\"source\":{\"node\":\"87d742b4-7ece-1247-d18a-0c46b2ec6268\",\"port\":\"output7\"},\"target\":{\"node\":\"229ea75a-587f-174c-fdc0-5861787e7df0\",\"port\":\"output7\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"ca2f76fe-ec0f-290b-e31e-622fa0d9b044\",\"text\":\"Send to QA_2()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"5692802e-6d98-c34e-97f1-e164a2dbd55c\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Send to L2\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":177.35533905932738,\"y\":191.64466094067262},{\"x\":177.35533905932738,\"y\":111},{\"x\":344,\"y\":111}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":0,\"toDir\":3},\"source\":{\"node\":\"87d742b4-7ece-1247-d18a-0c46b2ec6268\",\"port\":\"output5\"},\"target\":{\"node\":\"b197f0b6-3fed-e368-8d82-ce5ec6660745\",\"port\":\"output7\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"943d0455-b6d4-acd7-ea2c-ccfb18aa989a\",\"text\":\"Send to L2()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"e6133f95-e050-6bf5-2ee4-db33effb3f2d\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Send to L4\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":494,\"y\":111},{\"x\":570.5,\"y\":111},{\"x\":570.5,\"y\":209},{\"x\":647,\"y\":209}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":1,\"toDir\":3},\"source\":{\"node\":\"b197f0b6-3fed-e368-8d82-ce5ec6660745\",\"port\":\"output5\"},\"target\":{\"node\":\"bd10eff6-30db-4cdd-3fd0-5b745825c4ff\",\"port\":\"output7\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"0c57feae-aecf-0479-5143-c1aec84a7d75\",\"text\":\"Send to L4()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]}]","wfm_created_guid":null,"wfm_created_date":"2017-01-05T18:30:25.301Z","wfm_inactive_date":null,"createdAt":"2017-01-06T02:30:23.557Z","updatedAt":"2017-01-06T02:30:23.557Z","flowPoints":[{"wfp_uid":"6","flowUID":"9b0edc9d-5c3c-4818-90d7-5b0f0439cf71","uid":"87d742b4-7ece-1247-d18a-0c46b2ec6268","name":"L1","type":"WorkflowShape.WorkflowStart","print":"L1(L1)","rGuid":"537dc480-c104-11e6-a3e3-79e57e11b134","api":"","description":"","nextEvents":"[\"cca0c053-837e-a2fb-05b1-6af0b7a4ec9f\",\"5692802e-6d98-c34e-97f1-e164a2dbd55c\"]","x":"92","y":"177","height":"100","width":"100","color":"#000000","shape":"startFlow","createdAt":"2017-01-06T02:30:25.639Z","updatedAt":"2017-01-06T02:30:25.639Z"},{"wfp_uid":"7","flowUID":"9b0edc9d-5c3c-4818-90d7-5b0f0439cf71","uid":"b197f0b6-3fed-e368-8d82-ce5ec6660745","name":"L2","type":"WorkflowShape.WorkflowProcess","print":"L2(L2)","rGuid":"aff94e00-c104-11e6-a3e3-79e57e11b134","api":"","description":"","nextEvents":"[\"e6133f95-e050-6bf5-2ee4-db33effb3f2d\"]","x":"344","y":"91","height":"60","width":"150","color":"#000000","shape":"processQueue","createdAt":"2017-01-06T02:30:25.639Z","updatedAt":"2017-01-06T02:30:25.639Z"},{"wfp_uid":"8","flowUID":"9b0edc9d-5c3c-4818-90d7-5b0f0439cf71","uid":"229ea75a-587f-174c-fdc0-5861787e7df0","name":"QA","type":"WorkflowShape.WorkflowProcess","print":"QA(QA_2)","rGuid":"e4cb0880-c104-11e6-a3e3-79e57e11b134","api":"","description":"","nextEvents":"[\"60e518ec-985b-aa09-4247-e0098104a482\"]","x":"354","y":"304","height":"60","width":"150","color":"#000000","shape":"processQueue","createdAt":"2017-01-06T02:30:25.639Z","updatedAt":"2017-01-06T02:30:25.639Z"},{"wfp_uid":"9","flowUID":"9b0edc9d-5c3c-4818-90d7-5b0f0439cf71","uid":"bd10eff6-30db-4cdd-3fd0-5b745825c4ff","name":"L4","type":"WorkflowShape.WorkflowProcess","print":"L4(L4)","rGuid":"ef885870-c10b-11e6-a578-215bd3c6e474","api":"","description":"","nextEvents":"[\"442f2e91-e9d2-7a8b-2d53-fdaf298ac7b2\"]","x":"647","y":"189","height":"60","width":"150","color":"#000000","shape":"processQueue","createdAt":"2017-01-06T02:30:25.639Z","updatedAt":"2017-01-06T02:30:25.639Z"},{"wfp_uid":"10","flowUID":"9b0edc9d-5c3c-4818-90d7-5b0f0439cf71","uid":"c0d4cd01-77a5-96b9-8309-361afbe68b22","name":"Completed","type":"WorkflowShape.WorkflowEnd","print":"Completed(id)","rGuid":"f21b6390-c104-11e6-a3e3-79e57e11b134","api":"","description":"","nextEvents":null,"x":"1065","y":"161","height":"100","width":"100","color":"#000000","shape":"endFlow","createdAt":"2017-01-06T02:30:25.639Z","updatedAt":"2017-01-06T02:30:25.639Z"}],"totalObjects":1},{"wfm_uid":"1","projectUID":"sd0ebba0-5dfa-11e6-8632-6f782cd80ccc","flowUID":"e211cd31-fb8c-46b2-86d5-d97a1593af8a","name":"AML Flow","type":"AML","description":"Workflow for AML","draw2d":"[{\"type\":\"WorkflowShape.WorkflowStart\",\"id\":\"e5daccbc-be77-38c3-2378-821f1347e6fd\",\"x\":102,\"y\":236,\"width\":100,\"height\":100,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"Start Flow.\",\"type\":\"startFlow\",\"name\":\"L1 Reviewer\",\"customerID\":\"l1\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"537dc480-c104-11e6-a3e3-79e57e11b134\"},\"cssClass\":\"WorkflowShape_WorkflowStart\",\"ports\":[{\"id\":\"2c681982-14c1-608d-d9ff-f95ca40ec3bc\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator\"},{\"id\":\"bf410496-1382-6b32-64ad-2e47c4f08d6d\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator\"},{\"id\":\"b611aaad-2ad0-610f-a9c0-f050c68fa2e4\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator\"},{\"id\":\"3b348b06-a267-bf1a-6155-e317bd2f28fa\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator\"},{\"id\":\"0c9dc82f-9455-131a-4d9a-f4ff0f680ed1\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthWestPortLocator\"},{\"id\":\"39dca4a8-78ca-9b92-7445-806aeca3f0bf\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthEastPortLocator\"},{\"id\":\"800bb649-a657-bc12-b038-974756b0f8e8\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthWestPortLocator\"},{\"id\":\"5b28945a-639f-df8b-979f-afa1599764df\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthEastPortLocator\"}],\"bgColor\":\"#228B22\",\"color\":\"#000000\",\"stroke\":1,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"33cf54f8-a19d-8d7c-97d1-5779691bfd23\",\"text\":\"L1 Reviewer\\n(l1)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.WorkflowProcess\",\"id\":\"f0f0e5e9-6f93-9131-db7c-cf8a90ef6fa2\",\"x\":369,\"y\":57,\"width\":120,\"height\":60,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"Process Flow.\",\"type\":\"processFLow\",\"name\":\"L2 Reviewer\",\"customerID\":\"l2\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"aff94e00-c104-11e6-a3e3-79e57e11b134\"},\"cssClass\":\"WorkflowShape_WorkflowProcess\",\"ports\":[{\"id\":\"91ec87ba-9d19-5af1-1f19-a3b6d267fbf9\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator1\"},{\"id\":\"e83c880e-e6a4-dc72-ce64-e3fe9e99e6e2\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator2\"},{\"id\":\"148e30b8-60d3-5bb0-eca8-60c9a94e16cb\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator1\"},{\"id\":\"a2f26170-c1b4-3d89-b02e-ee473d74d794\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator2\"},{\"id\":\"b45fc02b-0d2d-63eb-4743-afeba4381e48\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator1\"},{\"id\":\"78537525-ebb1-6807-e9ee-65f5202c4810\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator2\"},{\"id\":\"830c0db8-2114-818a-cc6e-0fc8d72f3607\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator1\"},{\"id\":\"835a0554-af4a-8c95-d6c0-799b442ea8a2\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator2\"}],\"bgColor\":\"#74B2E2\",\"color\":\"#000000\",\"stroke\":1,\"radius\":0,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"6bdd4a21-48ec-96bf-ac9e-1bc00cc5e4f7\",\"text\":\"L2 Reviewer\\n(l2)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.WorkflowProcess\",\"id\":\"5b1ebcf6-b1d7-350e-48f1-ab457114fb5e\",\"x\":592,\"y\":245,\"width\":120,\"height\":60,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"Process Flow.\",\"type\":\"processFLow\",\"name\":\"L3 Reviewer\",\"customerID\":\"lq3\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"30f7c590-deb5-11e6-91fa-5b3981c1fd89\",\"id\":\"5b1ebcf6-b1d7-350e-48f1-ab457114fb5e\"},\"cssClass\":\"WorkflowShape_WorkflowProcess\",\"ports\":[{\"id\":\"fd408f0a-c083-49c2-fbb8-4046cc46d0b3\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator1\"},{\"id\":\"b99a5432-7ef9-0914-5339-a48542e07f09\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator2\"},{\"id\":\"7245ec48-b580-1b1c-7ec1-94d71b6b12b5\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator1\"},{\"id\":\"f240d373-d713-caca-8e60-8c8832206f1f\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator2\"},{\"id\":\"4b4e5c77-b8ae-7588-740d-a3cc083eec86\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator1\"},{\"id\":\"3a94df9d-e531-0642-737c-7e1fad1baedd\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator2\"},{\"id\":\"5192c6ca-5e6a-b278-e884-c8772addb44c\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator1\"},{\"id\":\"9d685ca6-db43-1e8f-de00-cb89d96a7bbb\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator2\"}],\"bgColor\":\"#74B2E2\",\"color\":\"#000000\",\"stroke\":1,\"radius\":0,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"5b451dc9-050e-8601-0ea7-d799c3cdbe36\",\"text\":\"L3 Reviewer\\n(lq3)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.WorkflowProcess\",\"id\":\"651c2aef-550c-0dc5-07ee-1a4b7dbd15c2\",\"x\":950,\"y\":387,\"width\":120,\"height\":60,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"Process Flow.\",\"type\":\"processFLow\",\"name\":\"L QA\",\"customerID\":\"lqa\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"e4cb0880-c104-11e6-a3e3-79e57e11b134\"},\"cssClass\":\"WorkflowShape_WorkflowProcess\",\"ports\":[{\"id\":\"1c06f967-408d-982b-53ae-4714ff828f06\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator1\"},{\"id\":\"8b257a48-6a1a-7f00-0c8f-7633158ad4b7\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator2\"},{\"id\":\"1e1c39c7-b803-9365-b75c-090148670676\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator1\"},{\"id\":\"b79ea926-ac10-c712-1d33-bdc7ba006f54\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator2\"},{\"id\":\"4da4e167-d4c1-f728-7147-fcdde0b8444e\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator1\"},{\"id\":\"c7bd9c0a-60cd-22ab-fd95-42e441c804ac\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator2\"},{\"id\":\"d37a2876-d0c4-fef6-cf55-6d7531f5afbf\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator1\"},{\"id\":\"8bd3a705-baf0-738f-259a-5b2f45cbd956\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator2\"}],\"bgColor\":\"#74B2E2\",\"color\":\"#000000\",\"stroke\":1,\"radius\":0,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"42090278-bd37-aa30-f162-e5a61a4ca534\",\"text\":\"L QA\\n(lqa)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.WorkflowEnd\",\"id\":\"c1377138-d5f2-413a-c6a4-8e1c23dfece3\",\"x\":1311,\"y\":190,\"width\":100,\"height\":100,\"alpha\":1,\"angle\":0,\"userData\":{\"title\":\"End Flow.\",\"type\":\"endFlow\",\"name\":\"Complete\",\"customerID\":\"id\",\"editDialog\":\"[[JSON_FUN_PREFIX_function (setting) {\\r\\n        window.targetProperty = new Object();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n\\r\\n        if (setting.cssClass == \\\"WorkflowShape_EditWithPopupLabel\\\") {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.text.slice(setting.text.lastIndexOf(\\\"(\\\") + 1, setting.text.lastIndexOf(\\\")\\\"));\\r\\n            targetProperty.name = setting.text.slice(0, setting.text.lastIndexOf(\\\"(\\\"));\\r\\n            targetProperty.type = \\\"connection\\\";\\r\\n            targetProperty.title = \\\"Connection\\\";\\r\\n            targetProperty.label = setting;\\r\\n        } else {\\r\\n            targetProperty.id = setting.id;\\r\\n            targetProperty.customerID = setting.userData.customerID;\\r\\n            targetProperty.name = setting.userData.name;\\r\\n            targetProperty.type = setting.userData.type;\\r\\n            targetProperty.title = setting.userData.title;\\r\\n            targetProperty.rGuid = setting.userData.rGuid;\\r\\n        }\\r\\n        targetPropertyDialogInit();\\r\\n    }_JSON_FUN_SUFFIX]]\",\"createConnection\":\"[[JSON_FUN_PREFIX_function (sPort, tPort) {\\r\\n        targetProperty.type = \\\"connection\\\";\\r\\n        targetProperty.title = \\\"Connection\\\";\\r\\n        targetProperty.name = \\\"\\\";\\r\\n        targetProperty.customerID = \\\"\\\";\\r\\n        targetProperty.id = undefined;\\r\\n        targetProperty.connection = {};\\r\\n        targetProperty.connection.sourcePort = sPort;\\r\\n        targetProperty.connection.targetPort = tPort;\\r\\n        targetPropertyDialogInit();\\r\\n        $(\\\"#propertyDialog\\\").modal(\\\"open\\\");\\r\\n    }_JSON_FUN_SUFFIX]]\",\"rGuid\":\"f21b6390-c104-11e6-a3e3-79e57e11b134\"},\"cssClass\":\"WorkflowShape_WorkflowEnd\",\"ports\":[{\"id\":\"ee3896f3-9302-b7f4-ed00-dbd720a45456\",\"name\":\"output0\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthPortLocator\"},{\"id\":\"3d768ae3-d147-0e66-94e5-ee095ae304a6\",\"name\":\"output1\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthPortLocator\"},{\"id\":\"209cdb51-fa19-7c43-8732-1ed4e3456bf2\",\"name\":\"output2\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.EastPortLocator\"},{\"id\":\"a12de331-a655-8f2e-5e68-439967c1ad93\",\"name\":\"output3\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.WestPortLocator\"},{\"id\":\"ea47f13f-8da2-a212-ef9f-4ba292defff4\",\"name\":\"output4\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthWestPortLocator\"},{\"id\":\"6e6b4f08-3f20-ee37-29d0-35015aad74d3\",\"name\":\"output5\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.NorthEastPortLocator\"},{\"id\":\"79d62ebd-2fa9-05ee-d845-f6da5684ba90\",\"name\":\"output6\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthWestPortLocator\"},{\"id\":\"a877c78c-ef8f-3ac7-aee3-5505464e4264\",\"name\":\"output7\",\"port\":\"WorkflowShape.HybridPort\",\"locator\":\"WorkflowShape.SouthEastPortLocator\"}],\"bgColor\":\"#C9302C\",\"color\":\"#000000\",\"stroke\":1,\"dasharray\":null,\"labels\":[{\"labelData\":{\"id\":\"768ef678-ccf2-0c86-d227-97d37a9b56ee\",\"text\":\"Complete\\n(id)\"},\"locator\":\"draw2d.layout.locator.CenterLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"e4b46827-98f8-5fb0-e145-8bafaa34b7a4\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Pushback to L1\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":439,\"y\":117},{\"x\":439,\"y\":286},{\"x\":202,\"y\":286}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":2,\"toDir\":1},\"source\":{\"node\":\"f0f0e5e9-6f93-9131-db7c-cf8a90ef6fa2\",\"port\":\"output2\"},\"target\":{\"node\":\"e5daccbc-be77-38c3-2378-821f1347e6fd\",\"port\":\"output2\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"ec47d71f-0d13-fdaf-e1aa-95a1cab962d8\",\"text\":\"Pushback to L1()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"9ec111c7-86e0-1679-a0c5-8fd8d76c50ae\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Reset to L1\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":1325.6446609406726,\"y\":204.64466094067262},{\"x\":1325.6446609406726,\"y\":184.64466094067262},{\"x\":763.8223304703363,\"y\":184.64466094067262},{\"x\":763.8223304703363,\"y\":286},{\"x\":202,\"y\":286}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":0,\"toDir\":1},\"source\":{\"node\":\"c1377138-d5f2-413a-c6a4-8e1c23dfece3\",\"port\":\"output4\"},\"target\":{\"node\":\"e5daccbc-be77-38c3-2378-821f1347e6fd\",\"port\":\"output2\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"465efb3f-54f7-00e9-7f33-901b0b56caaa\",\"text\":\"Reset to L1()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"d4c4aa7b-dbfb-9f38-d4a8-ab515d254977\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Send to L2\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":202,\"y\":286},{\"x\":285.5,\"y\":286},{\"x\":285.5,\"y\":97},{\"x\":369,\"y\":97}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":1,\"toDir\":3},\"source\":{\"node\":\"e5daccbc-be77-38c3-2378-821f1347e6fd\",\"port\":\"output2\"},\"target\":{\"node\":\"f0f0e5e9-6f93-9131-db7c-cf8a90ef6fa2\",\"port\":\"output6\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"3557f2ee-def0-46df-fd30-b6c98333722c\",\"text\":\"Send to L2()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"38357f3b-4fa2-8153-2778-0baaa2e20131\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Send to QA\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":662,\"y\":305},{\"x\":662,\"y\":407},{\"x\":950,\"y\":407}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":2,\"toDir\":3},\"source\":{\"node\":\"5b1ebcf6-b1d7-350e-48f1-ab457114fb5e\",\"port\":\"output2\"},\"target\":{\"node\":\"651c2aef-550c-0dc5-07ee-1a4b7dbd15c2\",\"port\":\"output7\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"5b41de48-6688-af03-98bb-a0cff87ba56d\",\"text\":\"Send to QA()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"ea753b86-0b41-7eb2-da9c-cb1a3c0b7f98\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Send to L3\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":489,\"y\":97},{\"x\":642,\"y\":97},{\"x\":642,\"y\":245}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":1,\"toDir\":0},\"source\":{\"node\":\"f0f0e5e9-6f93-9131-db7c-cf8a90ef6fa2\",\"port\":\"output4\"},\"target\":{\"node\":\"5b1ebcf6-b1d7-350e-48f1-ab457114fb5e\",\"port\":\"output1\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"50dcf5f3-3684-e7a0-1cb9-077e83ba9d93\",\"text\":\"Send to L3()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]},{\"type\":\"WorkflowShape.Connection\",\"id\":\"01e80417-c129-6780-d976-b38e8fd124b9\",\"alpha\":1,\"angle\":0,\"userData\":{\"name\":\"Mark Complete\",\"customerID\":\"\"},\"cssClass\":\"WorkflowShape_Connection\",\"stroke\":2,\"color\":\"#00A8F0\",\"outlineStroke\":1,\"outlineColor\":\"#303030\",\"policy\":\"draw2d.policy.line.OrthogonalSelectionFeedbackPolicy\",\"vertex\":[{\"x\":1070,\"y\":407},{\"x\":1361,\"y\":407},{\"x\":1361,\"y\":290}],\"router\":\"draw2d.layout.connection.InteractiveManhattanConnectionRouter\",\"radius\":2,\"routingMetaData\":{\"routedByUserInteraction\":false,\"fromDir\":1,\"toDir\":2},\"source\":{\"node\":\"651c2aef-550c-0dc5-07ee-1a4b7dbd15c2\",\"port\":\"output5\"},\"target\":{\"node\":\"c1377138-d5f2-413a-c6a4-8e1c23dfece3\",\"port\":\"output1\",\"decoration\":\"draw2d.decoration.connection.ArrowDecorator\"},\"labels\":[{\"labelData\":{\"id\":\"c550f276-96d3-b8a9-6d38-65eee2dea9ed\",\"text\":\"Mark Complete()\"},\"locator\":\"draw2d.layout.locator.ManhattanMidpointLocator\",\"type\":\"WorkflowShape.EditWithPopupLabel\"}]}]","wfm_created_guid":null,"wfm_created_date":"2017-01-05T17:10:36.967Z","wfm_inactive_date":null,"createdAt":"2017-01-06T01:10:35.176Z","updatedAt":"2017-01-20T02:08:33.600Z","flowPoints":[{"wfp_uid":"21","flowUID":"e211cd31-fb8c-46b2-86d5-d97a1593af8a","uid":"e5daccbc-be77-38c3-2378-821f1347e6fd","name":"L1 Reviewer","type":"WorkflowShape.WorkflowStart","print":"L1 Reviewer(l1)","rGuid":"537dc480-c104-11e6-a3e3-79e57e11b134","api":"","description":"","nextEvents":"[\"d4c4aa7b-dbfb-9f38-d4a8-ab515d254977\"]","x":"102","y":"236","height":"100","width":"100","color":"#000000","shape":"startFlow","createdAt":"2017-01-20T02:08:35.937Z","updatedAt":"2017-01-20T02:08:35.937Z"},{"wfp_uid":"22","flowUID":"e211cd31-fb8c-46b2-86d5-d97a1593af8a","uid":"f0f0e5e9-6f93-9131-db7c-cf8a90ef6fa2","name":"L2 Reviewer","type":"WorkflowShape.WorkflowProcess","print":"L2 Reviewer(l2)","rGuid":"aff94e00-c104-11e6-a3e3-79e57e11b134","api":"","description":"","nextEvents":"[\"e4b46827-98f8-5fb0-e145-8bafaa34b7a4\",\"ea753b86-0b41-7eb2-da9c-cb1a3c0b7f98\"]","x":"369","y":"57","height":"60","width":"120","color":"#000000","shape":"processFLow","createdAt":"2017-01-20T02:08:35.937Z","updatedAt":"2017-01-20T02:08:35.937Z"},{"wfp_uid":"23","flowUID":"e211cd31-fb8c-46b2-86d5-d97a1593af8a","uid":"5b1ebcf6-b1d7-350e-48f1-ab457114fb5e","name":"L3 Reviewer","type":"WorkflowShape.WorkflowProcess","print":"L3 Reviewer(lq3)","rGuid":"30f7c590-deb5-11e6-91fa-5b3981c1fd89","api":"","description":"","nextEvents":"[\"38357f3b-4fa2-8153-2778-0baaa2e20131\"]","x":"592","y":"245","height":"60","width":"120","color":"#000000","shape":"processFLow","createdAt":"2017-01-20T02:08:35.937Z","updatedAt":"2017-01-20T02:08:35.937Z"},{"wfp_uid":"24","flowUID":"e211cd31-fb8c-46b2-86d5-d97a1593af8a","uid":"651c2aef-550c-0dc5-07ee-1a4b7dbd15c2","name":"L QA","type":"WorkflowShape.WorkflowProcess","print":"L QA(lqa)","rGuid":"e4cb0880-c104-11e6-a3e3-79e57e11b134","api":"","description":"","nextEvents":"[\"01e80417-c129-6780-d976-b38e8fd124b9\"]","x":"950","y":"387","height":"60","width":"120","color":"#000000","shape":"processFLow","createdAt":"2017-01-20T02:08:35.937Z","updatedAt":"2017-01-20T02:08:35.937Z"},{"wfp_uid":"25","flowUID":"e211cd31-fb8c-46b2-86d5-d97a1593af8a","uid":"c1377138-d5f2-413a-c6a4-8e1c23dfece3","name":"Complete","type":"WorkflowShape.WorkflowEnd","print":"Complete(id)","rGuid":"f21b6390-c104-11e6-a3e3-79e57e11b134","api":"","description":"","nextEvents":"[\"9ec111c7-86e0-1679-a0c5-8fd8d76c50ae\"]","x":"1311","y":"190","height":"100","width":"100","color":"#000000","shape":"endFlow","createdAt":"2017-01-20T02:08:35.937Z","updatedAt":"2017-01-20T02:08:35.937Z"}],"totalObjects":23}];
        dataTableOption.data = workflow_data;
        $("#workflowTable").DataTable(dataTableOption);

        //     $.ajaxEx({
        //     url: workflowPath + "/getWorkflows",
        //     type: 'get',
        //     success: function (res) {
        //         if (res.code == 0) {
        //             dataTableOption.data = res.data;
        //             $("#workflowTable").DataTable(dataTableOption);
        //         } else {
        //             dataTableOption.data = [];
        //             $("#workflowTable").DataTable(dataTableOption);
        //             console.log(res);
        //         }
        //     }, error: {}
        // });
    }

    function getUserRoleList() {
        var role_user_data = [{"uGuid":"6f093de0-c106-11e6-a3e3-79e57e11b134","puInactiveDate":null,"roles":[{"rGuid":"537dc480-c104-11e6-a3e3-79e57e11b134","rName":"L1","puInactiveDate":null}]},{"uGuid":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","puInactiveDate":null,"roles":[{"rGuid":"f21b6390-c104-11e6-a3e3-79e57e11b134","rName":"Team Leader","puInactiveDate":null}]},{"uGuid":"ba9b031a-bb8e-11e6-98cb-5de0329b28a5","puInactiveDate":null,"roles":[{"rGuid":"aff94e00-c104-11e6-a3e3-79e57e11b134","rName":"L2","puInactiveDate":null},{"rGuid":"537dc480-c104-11e6-a3e3-79e57e11b134","rName":"L1","puInactiveDate":null}]},{"uGuid":"ba9b0319-bb8e-11e6-98cb-5de0329b28a5","puInactiveDate":null,"roles":[{"rGuid":"e4cb0880-c104-11e6-a3e3-79e57e11b134","rName":"QA","puInactiveDate":null}]},{"uGuid":"47175240-c11a-11e6-92dd-29b1cbbdf0e1","puInactiveDate":null,"roles":[{"rGuid":"f21b6390-c104-11e6-a3e3-79e57e11b134","rName":"Team Leader","puInactiveDate":null},{"rGuid":"df0eef20-f80d-11e6-968f-eba469d650af","rName":"L7","puInactiveDate":null}]},{"uGuid":"1ff49e80-c123-11e6-888d-c14841af1fb4","puInactiveDate":null,"roles":[{"rGuid":"537dc480-c104-11e6-a3e3-79e57e11b134","rName":"L1","puInactiveDate":null}]},{"uGuid":"815649e0-c127-11e6-8882-dd1b688f3b31","puInactiveDate":null,"roles":[{"rGuid":"aff94e00-c104-11e6-a3e3-79e57e11b134","rName":"L2","puInactiveDate":null}]},{"uGuid":"5b0a1830-c1ad-11e6-b578-531b67396df3","puInactiveDate":null,"roles":[{"rGuid":"e4cb0880-c104-11e6-a3e3-79e57e11b134","rName":"QA","puInactiveDate":null}]},{"uGuid":"d11fef00-c297-11e6-8f86-9f4dbe57a2c2","puInactiveDate":null,"roles":[{"rGuid":"537dc480-c104-11e6-a3e3-79e57e11b134","rName":"L1","puInactiveDate":null}]},{"uGuid":"c46c6030-ea57-11e6-8834-95f6d572aa76","puInactiveDate":null,"roles":[{"rGuid":"537dc480-c104-11e6-a3e3-79e57e11b134","rName":"L1","puInactiveDate":null}]}];
        $.each(role_user_data, function (key, value) {
            userRoleList[key] = {uguid: value.uGuid};
            $.each(value.roles, function (rKey, rValue) {
                if (userRoleList[key].role_name == undefined) {
                    userRoleList[key].role_name = rValue.rName;
                    userRoleList[key].rguid = rValue.rGuid;
                } else {
                    userRoleList[key].role_name = userRoleList[key].role_name + ';' + rValue.rName;
                    userRoleList[key].rguid = userRoleList[key].rguid + ';' + rValue.rGuid;
                }
            })
        });

        userList = [{"uguid":"1ff49e80-c123-11e6-888d-c14841af1fb4","first_name":"Patrick","last_name":"Aml","username":"patrick@pwc.com"},{"uguid":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","first_name":"Walker","last_name":"C","username":"Walker C"},{"uguid":"5b0a1830-c1ad-11e6-b578-531b67396df3","first_name":"Walker","last_name":"Conolly","username":"walker.conolly@pwc.com"},{"uguid":"d11fef00-c297-11e6-8f86-9f4dbe57a2c2","first_name":"Aml","last_name":"L1","username":"amll1@pwc.com"},{"uguid":"815649e0-c127-11e6-8882-dd1b688f3b31","first_name":"Aml","last_name":"L2","username":"l2@pwc.com"},{"uguid":"c46c6030-ea57-11e6-8834-95f6d572aa76","first_name":"Hiral","last_name":"Patel","username":"hiral.j.patel@pwc.com"},{"uguid":"6f093de0-c106-11e6-a3e3-79e57e11b134","first_name":"Aml","last_name":"Test","username":"AML Test"},{"uguid":"47175240-c11a-11e6-92dd-29b1cbbdf0e1","first_name":"S","last_name":"Test","username":"test.s@pwc.com"},{"uguid":"ba9b0319-bb8e-11e6-98cb-5de0329b28a5","first_name":"Aml","last_name":"Tony","username":"AML Tony"},{"uguid":"ba9b031a-bb8e-11e6-98cb-5de0329b28a5","first_name":"Aml","last_name":"Troy","username":"AML Troy"}];
        var userNameMapping;
        // if (res.code == 0) {
        $.each(userRoleList, function (key, value) {
            userNameMapping = _.findWhere(userList, {uguid: value.uguid});
            userRoleList[key].username = userNameMapping.first_name + ' ' + userNameMapping.last_name;
        });
        initializeUserRoleTable(userRoleList);
        userList = userRoleList;
        // }
        // else {
        //     console.log(res);
        // }


        // $.ajaxEx({
        //     url: rolePath + '/getUserRoles',
        //     method: 'get',
        //     success: function (res) {
        //         if (res.code == 0) {
        //             $.each(res.data, function (key, value) {
        //                 userRoleList[key] = {uguid: value.uGuid};
        //                 $.each(value.roles, function (rKey, rValue) {
        //                     if (userRoleList[key].role_name == undefined) {
        //                         userRoleList[key].role_name = rValue.rName;
        //                         userRoleList[key].rguid = rValue.rGuid;
        //                     } else {
        //                         userRoleList[key].role_name = userRoleList[key].role_name + ';' + rValue.rName;
        //                         userRoleList[key].rguid = userRoleList[key].rguid + ';' + rValue.rGuid;
        //                     }
        //                 })
        //             });
        //             $.ajaxEx({
        //                 url: '/user' + '/getUsers',
        //                 method: 'get',
        //                 success: function (res) {
        //                     userList = res.data;
        //                     var userNameMapping;
        //                     if (res.code == 0) {
        //                         $.each(userRoleList, function (key, value) {
        //                             userNameMapping = _.findWhere(res.data, {uguid: value.uguid});
        //                             userRoleList[key].username = userNameMapping.first_name + ' ' + userNameMapping.last_name;
        //                         });
        //                         initializeUserRoleTable(userRoleList);
        //                         userList = userRoleList;
        //                     } else {
        //                         console.log(res);
        //                     }
        //                 },
        //                 error: function (err) {
        //                     console.log(err);
        //                 }
        //             })
        //         } else {
        //             console.log(res);
        //         }
        //     },
        //     error: function (err) {
        //         console.log(err);
        //     }
        // })
    }

    function getRole() {
        var role_data = [{"uid":"1","uuid":"537dc480-c104-11e6-a3e3-79e57e11b134","rName":"L1","rDescription":"Role L1","rType":null,"createDate":"2016-12-13T07:18:20.000Z","puInactiveDate":null},
            {"uid":"2","uuid":"aff94e00-c104-11e6-a3e3-79e57e11b134","rName":"L2","rDescription":"Role L2","rType":null,"createDate":"2016-12-13T07:20:55.000Z","puInactiveDate":null},
            {"uid":"3","uuid":"e4cb0880-c104-11e6-a3e3-79e57e11b134","rName":"QA","rDescription":"Role QA","rType":null,"createDate":"2016-12-13T07:22:24.000Z","puInactiveDate":null},
            {"uid":"4","uuid":"f21b6390-c104-11e6-a3e3-79e57e11b134","rName":"Team Leader","rDescription":"Role Team Leader","rType":null,"createDate":"2016-12-13T07:22:46.000Z","puInactiveDate":null},
            {"uid":"5","uuid":"ef885870-c10b-11e6-a578-215bd3c6e474","rName":"L4","rDescription":"4","rType":"4","createDate":"2016-12-13T08:12:48.000Z","puInactiveDate":null},
            {"uid":"6","uuid":"30f7c590-deb5-11e6-91fa-5b3981c1fd89","rName":"L3","rDescription":"Role L3","rType":null,"createDate":"2017-01-20T02:07:27.000Z","puInactiveDate":null},
            {"uid":"7","uuid":"df0eef20-f80d-11e6-968f-eba469d650af","rName":"L7","rDescription":"test","rType":"test","createDate":"2017-02-21T08:15:14.000Z","puInactiveDate":null}];

        setRoleFilter(role_data);

        // $.ajaxEx({
        //     url: "/role" + "/getRolesList",
        //     method: 'get',
        //     success: function (res) {
        //         if (res.code == 0) {
        //             console.log("res.data:", JSON.stringify(res.data));
        //             setRoleFilter(res.data);
        //         }
        //         else {
        //             console.log(res);
        //         }
        //     },
        //     error: function (res) {
        //         console.log(res);
        //     }
        // })
    }

    function setRoleFilter(data) {
        $.each(data, function (key, value) {
            var roleHtml = '<option value = "'
                + value.uuid
                + '" data-rguid="'
                + value.uuid
                + '">'
                + value.rName
                + '</option>';
            $('#selectRole').append(roleHtml);
        });
    }

    function getCaseList(proInit, batchId, alertGuid, entityGuid) {
        var caseList_data = [{"case_guid":"2133aa7a-5c28-42db-9314-676091453f93","case_uid":"100002","batch_num":"1","case_risk":"1","case_status":"","case_outcome":"Not Suspicious","workflow_guid":"651c2aef-550c-0dc5-07ee-1a4b7dbd15c2","workflow_name":"L QA","assigned_to":"6f093de0-c106-11e6-a3e3-79e57e11b134","assigned_user":"test, aml","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"2991.47"},{"case_guid":"0e13afaf-d88d-4534-8a68-cca59809c27a","case_uid":"100086","batch_num":"2","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"2","case_trans_amount":"11223.63"},{"case_guid":"743c6a19-fda3-4fee-a4d4-43863d3d0721","case_uid":"100079","batch_num":"1","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"2","case_trans_amount":"2905.28"},{"case_guid":"31cefa46-40ed-4c63-9f33-5d41ab7e536f","case_uid":"100012","batch_num":"2","case_risk":"1","case_status":"","case_outcome":"Not Suspicious","workflow_guid":"f0f0e5e9-6f93-9131-db7c-cf8a90ef6fa2","workflow_name":"L2 Reviewer","assigned_to":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","assigned_user":"C, Walker","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"11022.78"},{"case_guid":"b1ab32db-4e34-4495-9742-6c2f64d922ea","case_uid":"100127","batch_num":"2","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"6491.88"},{"case_guid":"8f4b464c-dbc9-4d8d-adb2-1e188e2cb439","case_uid":"100029","batch_num":"2","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"4","case_trans_amount":"22385.01"},{"case_guid":"99e992c5-40ec-4d8b-9bd8-f5e3f40370d3","case_uid":"100040","batch_num":"1","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"17052.06"},{"case_guid":"29903ded-b32d-43cc-ad82-875b29143269","case_uid":"100017","batch_num":"1","case_risk":"1","case_status":"","case_outcome":"Suspicious","workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","assigned_user":"C, Walker","co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"8243.8"},{"case_guid":"902f9bae-2b4c-4fe2-bf1e-69f61627b5e4","case_uid":"100048","batch_num":"1","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"3","case_trans_amount":"18408.23"},{"case_guid":"07f1fcdf-01db-442e-9697-9f926f55a52c","case_uid":"100103","batch_num":"2","case_risk":"0.2","case_status":"","case_outcome":"Not Suspicious","workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","assigned_user":"C, Walker","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"8","case_trans_amount":"46052.02"},{"case_guid":"9a8ad777-3c04-4b2c-8ca1-75e84cfdf2bb","case_uid":"100096","batch_num":"2","case_risk":"0.6","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"4","case_trans_amount":"13447.08"},{"case_guid":"e977d90f-a844-4e69-87d1-a12ebf130dd2","case_uid":"100036","batch_num":"2","case_risk":"0.6","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"9254.88"},{"case_guid":"4c7a3cfd-2298-4765-a2b6-ceebfb53e9b6","case_uid":"100045","batch_num":"2","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"3","case_trans_amount":"9253.67"},{"case_guid":"526c758c-8fa8-4399-b710-9746e70208f3","case_uid":"100063","batch_num":"2","case_risk":"0.1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"9844.27"},{"case_guid":"a9cab80d-8bae-4061-a945-fffbd8c03947","case_uid":"100071","batch_num":"1","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"8487.96"},{"case_guid":"c91bc5ff-5559-4db3-b210-296f7b4f59a3","case_uid":"100136","batch_num":"1","case_risk":"0.6","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"2","case_trans_amount":"10364.04"},{"case_guid":"f65d9b46-2a02-4d9c-82af-636524f94c72","case_uid":"100038","batch_num":"2","case_risk":"1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"8666.71"},{"case_guid":"dda05f7d-5ac2-4f18-a2bf-f20693eba379","case_uid":"100056","batch_num":"1","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"1799.81"},{"case_guid":"44c20355-f399-4ffa-9f48-0723ab985d64","case_uid":"100072","batch_num":"1","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"14634.38"},{"case_guid":"7cf3445c-78ed-45a6-acaa-a3862c0faba9","case_uid":"100110","batch_num":"2","case_risk":"0.1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"4","case_trans_amount":"19145.42"},{"case_guid":"6af9efd9-a95e-4c99-91d7-725ff9b3cbfc","case_uid":"100037","batch_num":"1","case_risk":"0.6","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"3","case_trans_amount":"16947.98"},{"case_guid":"fbc82102-81e1-4974-90af-86cc74eac4cc","case_uid":"100102","batch_num":"1","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"1415.48"},{"case_guid":"2f222d96-f0ad-4dcb-982b-b6d4e171c9e1","case_uid":"100093","batch_num":"1","case_risk":"1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"5764.18"},{"case_guid":"c439baf7-0973-41cb-8975-3ff3c3f95022","case_uid":"100068","batch_num":"2","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"10482.03"},{"case_guid":"12aa49b5-04a7-4048-8824-9435e8391686","case_uid":"100123","batch_num":"2","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"7396.44"},{"case_guid":"b8a9a9ef-b50b-40ad-8b85-cca65d2c5fd7","case_uid":"100113","batch_num":"2","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"2788.19"},{"case_guid":"e492b395-3a90-4da7-974f-1afd9482c04a","case_uid":"100054","batch_num":"2","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"5","case_trans_amount":"18985.40"},{"case_guid":"6f1a470e-e00a-4ae9-9154-bae0b7b96062","case_uid":"100073","batch_num":"1","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"4243.98"},{"case_guid":"42c37f5a-bc27-412c-8a38-2966767d8e51","case_uid":"100111","batch_num":"1","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"12107.46"},{"case_guid":"d221de92-f97e-434d-bc5e-136ea00ea330","case_uid":"100126","batch_num":"2","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"3","case_trans_amount":"17735.50"},{"case_guid":"c9218cb9-a46c-4e45-8290-93970e7579c9","case_uid":"100089","batch_num":"2","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"16448.37"},{"case_guid":"ddffa8e7-e1c3-42cf-a3be-a88fec70cf04","case_uid":"100091","batch_num":"1","case_risk":"0.3","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"6456.37"},{"case_guid":"b23e340f-da58-48a9-82de-d9dc4407a1e5","case_uid":"100082","batch_num":"2","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"3","case_trans_amount":"25051.06"},{"case_guid":"0a439b96-79ca-454e-bd2a-20cbb7ce22c0","case_uid":"100133","batch_num":"1","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"5","case_trans_amount":"17672.79"},{"case_guid":"630d3d75-aa97-4eb0-aa0b-4bc7f1f5277a","case_uid":"100041","batch_num":"1","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"2","case_trans_amount":"4593.24"},{"case_guid":"a2682024-aa66-4831-8af8-a44f22006e63","case_uid":"100059","batch_num":"1","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"3","case_trans_amount":"16475.17"},{"case_guid":"6bb9f361-a973-4cd5-8e69-9f1145597d1e","case_uid":"100119","batch_num":"2","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"5","case_trans_amount":"22084.24"},{"case_guid":"6ccb3527-a97c-4d3a-8f2a-0c552d8f2740","case_uid":"100078","batch_num":"2","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"3","case_trans_amount":"11896.79"},{"case_guid":"9da3d8cc-b688-47ab-b3a1-130cf984da4f","case_uid":"100130","batch_num":"2","case_risk":"0","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"3","case_trans_amount":"20566.05"},{"case_guid":"8e1ed0d4-4ce9-4663-894b-f0e21ac73fb7","case_uid":"100116","batch_num":"2","case_risk":"0.3","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"9415.24"},{"case_guid":"84370c1a-94f7-41b4-8c98-79ff5e9775dc","case_uid":"100134","batch_num":"1","case_risk":"0.1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"3882.01"},{"case_guid":"730dad6a-7186-4fb6-b53f-57d77cadd278","case_uid":"100049","batch_num":"1","case_risk":"0.1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"10337.93"},{"case_guid":"b48e4617-4ce5-4b2c-a500-15043d1a1fdb","case_uid":"100044","batch_num":"2","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"5390.89"},{"case_guid":"17c8b547-acf3-44dc-a7db-0e91cb5f87d4","case_uid":"100081","batch_num":"1","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"7747.82"},{"case_guid":"71e14d10-eb42-4d61-b66e-b376dfc79f82","case_uid":"100067","batch_num":"2","case_risk":"0.1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"2262.28"},{"case_guid":"a76b61dc-109b-44cb-bfc7-c1f48560105c","case_uid":"100092","batch_num":"2","case_risk":"0.3","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"15445.48"},{"case_guid":"548b9d8c-0067-4ec1-a727-bc1687dff9fc","case_uid":"100075","batch_num":"1","case_risk":"0.3","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"8388.74"},{"case_guid":"ebc56a9d-2020-40b1-9c28-7a864b10a80e","case_uid":"100094","batch_num":"2","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"4","case_trans_amount":"20474.56"},{"case_guid":"73711e4e-798c-473a-8766-def02673ab33","case_uid":"100115","batch_num":"1","case_risk":"0.5","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"2","case_trans_amount":"6221.22"},{"case_guid":"27e70258-6913-4dbd-971a-e648f530a92b","case_uid":"100060","batch_num":"2","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"6993.5"},{"case_guid":"c5dd8adf-6605-47e4-8a9c-22dac83e7044","case_uid":"100008","batch_num":"1","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"6088.62"},{"case_guid":"b9f5d339-0642-439e-8699-cdbbf1316936","case_uid":"100122","batch_num":"2","case_risk":"0.3","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"5","case_trans_amount":"17338.74"},{"case_guid":"e7149567-0225-42a8-957d-ae4101455531","case_uid":"100047","batch_num":"1","case_risk":"0.3","case_status":"","case_outcome":"Suspicious","workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","assigned_user":"C, Walker","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"7408.50"},{"case_guid":"9dd6dfe2-f6fb-461f-8cd0-f65e5bf87e23","case_uid":"100034","batch_num":"1","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"786.6"},{"case_guid":"eedd5703-900f-45f1-87c2-6de5afcb89ba","case_uid":"100074","batch_num":"2","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"3","case_trans_amount":"9419.17"},{"case_guid":"44bff18b-c5cb-4fba-a621-3d09e689735c","case_uid":"100003","batch_num":"1","case_risk":"0.5","case_status":"","case_outcome":"Suspicious","workflow_guid":"5b1ebcf6-b1d7-350e-48f1-ab457114fb5e","workflow_name":"L3 Reviewer","assigned_to":"d11fef00-c297-11e6-8f86-9f4dbe57a2c2","assigned_user":"L1, AML","co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"3","case_trans_amount":"11630.62"},{"case_guid":"2ee0a563-30fb-4cdc-b2cd-279f17fb8abe","case_uid":"100005","batch_num":"2","case_risk":"0.1","case_status":"","case_outcome":"Not Suspicious","workflow_guid":"651c2aef-550c-0dc5-07ee-1a4b7dbd15c2","workflow_name":"L QA","assigned_to":"c46c6030-ea57-11e6-8834-95f6d572aa76","assigned_user":"Patel, Hiral","co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"4024.46"},{"case_guid":"8573bcbc-51e0-4e9d-9f84-fb924d6033bc","case_uid":"100062","batch_num":"1","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"14382.19"},{"case_guid":"268adc8f-a13f-405f-bae4-30da3d28914a","case_uid":"100039","batch_num":"1","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"4","case_trans_amount":"16946.72"},{"case_guid":"816a40c1-296b-434f-8bcf-d02898338c3d","case_uid":"100070","batch_num":"1","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"2","case_trans_amount":"6943.44"},{"case_guid":"e1e803b0-2973-4fb5-84b7-71cba004ed4f","case_uid":"100020","batch_num":"1","case_risk":"0.3","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"9601.87"},{"case_guid":"59993614-59a4-4b3a-80b9-c527f22a9d89","case_uid":"100080","batch_num":"2","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"3","case_trans_amount":"9124.42"},{"case_guid":"13cc480d-c0d7-42c7-9023-c1d0d5c438e7","case_uid":"100120","batch_num":"1","case_risk":"0","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"8647.50"},{"case_guid":"a02fc607-1dac-450c-aef4-d7ab26cd4886","case_uid":"100084","batch_num":"1","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"3","case_trans_amount":"12574.77"},{"case_guid":"969435d4-e42a-4014-b1d8-a2db6b385982","case_uid":"100051","batch_num":"1","case_risk":"0","case_status":"","case_outcome":"Suspicious","workflow_guid":"f0f0e5e9-6f93-9131-db7c-cf8a90ef6fa2","workflow_name":"L2 Reviewer","assigned_to":"815649e0-c127-11e6-8882-dd1b688f3b31","assigned_user":"L2, AML","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"5","case_trans_amount":"14853.43"},{"case_guid":"939276a8-6a6a-433b-8a25-4b7534d51ae8","case_uid":"100050","batch_num":"2","case_risk":"0","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"2948.21"},{"case_guid":"b0ba646e-b97a-4b2a-8ba1-d5643c0624a1","case_uid":"100105","batch_num":"2","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"1541.75"},{"case_guid":"51d52e9a-9f6f-404a-a702-64e9690e7dec","case_uid":"100043","batch_num":"1","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"5310.23"},{"case_guid":"3424986c-f565-4f20-a374-83953b1ea3de","case_uid":"100055","batch_num":"2","case_risk":"0.5","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"6005.34"},{"case_guid":"5b3c22cb-dcc8-4830-a0da-483a902ceed3","case_uid":"100088","batch_num":"1","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","assigned_user":"C, Walker","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"7","case_trans_amount":"35187.85"},{"case_guid":"5ab70fbd-e595-4e82-af17-fe1252e9436b","case_uid":"100100","batch_num":"1","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"3","case_trans_amount":"24517.36"},{"case_guid":"7f10ed2f-2a75-4af5-bbbe-fb2847cc0276","case_uid":"100132","batch_num":"2","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"4761.18"},{"case_guid":"9e5043db-953c-4e1b-aff1-ea416a2ec3b0","case_uid":"100085","batch_num":"2","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"4","case_trans_amount":"20816.13"},{"case_guid":"ced7c5e3-7ba5-483d-9f03-822dea174c6a","case_uid":"100033","batch_num":"1","case_risk":"1","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"2","case_trans_amount":"10432.11"},{"case_guid":"2fc7ce7a-a58d-41a5-bccc-996a494e3a30","case_uid":"100112","batch_num":"1","case_risk":"0.1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"5825.12"},{"case_guid":"c4d2c03d-c7b4-47e5-b1a3-bd6df020ef0d","case_uid":"100099","batch_num":"2","case_risk":"0.1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"7675.46"},{"case_guid":"619e9a3d-d7ec-489f-bc33-5f4f1ba7e02d","case_uid":"100114","batch_num":"1","case_risk":"1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"6067.05"},{"case_guid":"ba253683-f23a-49db-888a-716fe27c232f","case_uid":"100066","batch_num":"2","case_risk":"1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"3","case_trans_amount":"14427.75"},{"case_guid":"ccfecd5c-88ea-4cfe-853d-b9c211926bed","case_uid":"100097","batch_num":"2","case_risk":"0.1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"7018.41"},{"case_guid":"532b461b-028d-4070-b119-0bbe9463ffd5","case_uid":"100083","batch_num":"2","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"3","case_trans_amount":"13956.06"},{"case_guid":"b53f594d-a941-4a21-9c6b-966e8ba614c2","case_uid":"100011","batch_num":"2","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":"f0f0e5e9-6f93-9131-db7c-cf8a90ef6fa2","workflow_name":"L2 Reviewer","assigned_to":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","assigned_user":"C, Walker","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"8798.84"},{"case_guid":"de72c5bf-de36-4746-8fdc-67b67c1db8b8","case_uid":"100023","batch_num":"1","case_risk":"0.5","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"6059.81"},{"case_guid":"d92e8286-bb04-47be-9b9b-53af62b32d02","case_uid":"100016","batch_num":"2","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","assigned_user":"C, Walker","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"3","case_trans_amount":"7510.60"},{"case_guid":"669c2c9b-ad94-4ab2-9a72-cb7ed6317c6d","case_uid":"100098","batch_num":"2","case_risk":"0","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"11379.20"},{"case_guid":"712d064f-d415-4d57-bda3-8c41f9a29c08","case_uid":"100090","batch_num":"2","case_risk":"0","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"4","case_trans_amount":"15123.94"},{"case_guid":"ad19ff2f-93c3-43d6-b3a2-df4c17b4e796","case_uid":"100121","batch_num":"1","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"1134.83"},{"case_guid":"cd71db64-690d-4d0a-9286-f2a1780de3b0","case_uid":"100053","batch_num":"1","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"5","case_trans_amount":"21828.15"},{"case_guid":"13d68f49-0c5e-4f55-963d-a79f41c67fa6","case_uid":"100109","batch_num":"2","case_risk":"0.6","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"3886.49"},{"case_guid":"c8442ab8-b1b0-4415-bece-2ab09db78cc9","case_uid":"100128","batch_num":"1","case_risk":"0.6","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"7075.62"},{"case_guid":"ee950055-fbeb-42fb-96f9-e7ed9c324582","case_uid":"100118","batch_num":"1","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"4","case_trans_amount":"20030.61"},{"case_guid":"fa742c9b-9a11-4286-b218-cc453bbfd310","case_uid":"100065","batch_num":"2","case_risk":"0","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"7930.84"},{"case_guid":"00942750-7869-4e5f-b216-3c3f83879d14","case_uid":"100107","batch_num":"1","case_risk":"0.4","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"2521.91"},{"case_guid":"30588983-48c8-4366-8ede-dfebdf1ee285","case_uid":"100058","batch_num":"2","case_risk":"0.5","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"6116.3"},{"case_guid":"08b92ed9-1ba9-45df-a289-fd2a2896c9be","case_uid":"100108","batch_num":"2","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"7605.40"},{"case_guid":"9bc45a6c-7ef0-4777-8535-006bb817b3b7","case_uid":"100106","batch_num":"2","case_risk":"0.8","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"3","case_trans_amount":"9121.80"},{"case_guid":"41d08104-722d-4ed4-a432-d29e7a614d8b","case_uid":"100031","batch_num":"1","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"7427.52"},{"case_guid":"f7f602ce-8ac9-4f19-b455-35c765e23d28","case_uid":"100057","batch_num":"2","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"9808.23"},{"case_guid":"b3c2bb78-82a0-4eef-96a6-e5d05139958c","case_uid":"100095","batch_num":"2","case_risk":"0.1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"2","case_trans_amount":"10834.49"},{"case_guid":"5481e24a-0de3-4f76-b582-d18f28f6f19f","case_uid":"100101","batch_num":"1","case_risk":"1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"3","case_trans_amount":"22207.92"},{"case_guid":"51f069ae-a0c2-4926-86bc-6806d6abbbf3","case_uid":"100035","batch_num":"2","case_risk":"0.9","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"9900.06"},{"case_guid":"e72a803f-44e1-4c4a-a128-4298623754d4","case_uid":"100129","batch_num":"2","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"4","case_trans_amount":"27514.01"},{"case_guid":"c3522fb7-3ea2-49e0-8d2a-d8623f8cc4b5","case_uid":"100125","batch_num":"1","case_risk":"0.3","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"1","case_trans_amount":"3403.52"},{"case_guid":"17707192-8c8e-480c-8792-aac6991e1f93","case_uid":"100046","batch_num":"2","case_risk":"0.6","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"3","case_trans_amount":"22618.12"},{"case_guid":"e40c48cd-df5a-4b76-99b7-d375eb7235bf","case_uid":"100087","batch_num":"2","case_risk":"1","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"2","case_trans_amount":"10713.75"},{"case_guid":"24f63fb1-ab9f-4d24-8fc0-00c4c1045145","case_uid":"100069","batch_num":"2","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"4","case_trans_amount":"20829.02"},{"case_guid":"e9bc5d4a-4e9f-4ec9-ba71-5c1c2bc3e62b","case_uid":"100077","batch_num":"1","case_risk":"0.5","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"3","case_trans_amount":"13008.41"},{"case_guid":"a020fd26-921f-4e4f-9b74-ae67c4ac5ce7","case_uid":"100021","batch_num":"2","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":null,"assigned_user":null,"co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"8671.9"},{"case_guid":"4d8f932c-1c99-487d-aa38-b16aee86837a","case_uid":"100025","batch_num":"1","case_risk":"0.1","case_status":"","case_outcome":"Not Suspicious","workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","assigned_user":"C, Walker","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"3","case_trans_amount":"14837.96"},{"case_guid":"201ee35e-9db8-41e5-bad8-f479373fe137","case_uid":"100024","batch_num":"2","case_risk":"0.7","case_status":"","case_outcome":null,"workflow_guid":"87d742b4-7ece-1247-d18a-0c46b2ec6268","workflow_name":"L1","assigned_to":null,"assigned_user":null,"co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"7580.16"},{"case_guid":"96b04043-6825-48d0-b1df-dc6b63d40d83","case_uid":"100004","batch_num":"2","case_risk":"0.1","case_status":"","case_outcome":"Not Suspicious","workflow_guid":"e5daccbc-be77-38c3-2378-821f1347e6fd","workflow_name":"L1 Reviewer","assigned_to":"5b0a1830-c1ad-11e6-b578-531b67396df3","assigned_user":"Conolly, Walker","co_type":null,"priority":"l","co_create_date":null,"case_trans_count":"1","case_trans_amount":"1888.45"},{"case_guid":"fd4bf514-093f-4b11-9922-567916682aa9","case_uid":"100052","batch_num":"1","case_risk":"0.2","case_status":"","case_outcome":null,"workflow_guid":null,"workflow_name":null,"assigned_to":null,"assigned_user":null,"co_type":null,"priority":"m","co_create_date":null,"case_trans_count":"2","case_trans_amount":"6378.31"},{"case_guid":"6533e4a1-ddfd-405e-b7c9-8188a0c6ec46","case_uid":"100006","batch_num":"2","case_risk":"0.4","case_status":"","case_outcome":"Not Suspicious","workflow_guid":"651c2aef-550c-0dc5-07ee-1a4b7dbd15c2","workflow_name":"L QA","assigned_to":"ba9b0318-bb8e-11e6-98cb-5de0329b28a5","assigned_user":"C, Walker","co_type":null,"priority":"h","co_create_date":null,"case_trans_count":"1","case_trans_amount":"5403.86"}];
        if(proInit == true){
            initData = caseList_data;
        }
        fullData = caseList_data.slice();
        currentData = caseList_data;

        initData.forEach(function(item){
            // donutchartlabels.push(item.workflow_name);
            if(item[colMap.WORKFLOW_NAME] == null){
                item[colMap.POINT_NAME] = "No Workflow";
            } else {
                item[colMap.POINT_NAME] = item[colMap.WORKFLOW_NAME]
            }
        });
        var aggregatedFullData = [];
        aggregatedFullData = crossfilter(initData).dimension(function(d){
            return d[colMap.POINT_NAME];
        }).group()
            .reduceCount(function(d){return d[colMap.POINT_NAME];})
            .top(Infinity);

        aggregatedFullData.forEach(function(item){
            donutchartlabels.push(item.key);
        })

        renderSlider("#amountSlider", fullData);
        renderSlider1("#riskSlider", fullData);

        filterData(null);



        // $.ajaxEx({
        //     url: "/search" + "/getCaseList",
        //     method: "post",
        //     data: {
        //         "batchid": batchId,
        //         "alert_guid": alertGuid,
        //         "cust_guid": entityGuid
        //     },
        //     success: function (res) {
        //         if (res.code == 0) {
        //
        //             if(proInit == true){
        //                 initData = res.data;
        //             }
        //             fullData = res.data.slice();
        //             currentData = res.data;
        //
        //             initData.forEach(function(item){
        //                 // donutchartlabels.push(item.workflow_name);
        //                 if(item[colMap.WORKFLOW_NAME] == null){
        //                     item[colMap.POINT_NAME] = "No Workflow";
        //                 } else {
        //                     item[colMap.POINT_NAME] = item[colMap.WORKFLOW_NAME]
        //                 }
        //             });
        //             var aggregatedFullData = [];
        //             aggregatedFullData = crossfilter(initData).dimension(function(d){
        //                 return d[colMap.POINT_NAME];
        //             }).group()
        //                 .reduceCount(function(d){return d[colMap.POINT_NAME];})
        //                 .top(Infinity);
        //
        //             aggregatedFullData.forEach(function(item){
        //                 donutchartlabels.push(item.key);
        //             })
        //
        //             renderSlider("#amountSlider", fullData);
        //             renderSlider1("#riskSlider", fullData);
        //
        //             filterData(null);
        //         } else {
        //             console.log(res);
        //         }
        //         if (proInit) {
        //             hideSearchProgress();
        //         }
        //     },
        //     error: function (res) {
        //         console.log(res);
        //         if (proInit) {
        //             hideSearchProgress();
        //         }
        //     }
        // })
    }

    function filterData(criteria) {
        var filteredData = fullData.slice(),
            filter = crossfilter(filteredData);

        if(criteria == null) {
            criteriaGroup = {
                POINT_NAME: [],
                CASE_TRANS_AMOUNT:[],
                CASE_RISK: []
            };

            updateDisFilter(criteriaGroup);
            currentData = filteredData;
            renderCharts(currentData);
            return;
        }

        if(criteria.POINT_NAME || criteriaGroup.POINT_NAME.length !== 0){
            if(criteriaGroup.POINT_NAME.length == 0) {
                criteriaGroup.POINT_NAME[0] = criteria.POINT_NAME;
            } else if(criteriaGroup.POINT_NAME.length === 1 && criteria.POINT_NAME == undefined) {
                // criteriaGroup.POINT_NAME.pop();
            } else if(criteriaGroup.POINT_NAME.length === 1 && criteriaGroup.POINT_NAME.indexOf(criteria.POINT_NAME) >= 0){
                criteriaGroup.POINT_NAME.pop();
            } else if(criteriaGroup.POINT_NAME.length === 1 && criteriaGroup.POINT_NAME.indexOf(criteria.POINT_NAME) < 0){
                criteriaGroup.POINT_NAME[0] = criteria.POINT_NAME;
            }

            filteredData = filter.dimension(function(d){
                return d[colMap.POINT_NAME]
            })
                .filter(criteriaGroup.POINT_NAME[0])
                .top(Infinity);
        }

        //case_trans_amount
        if (criteria.CASE_TRANS_AMOUNT || criteria.CASE_TRANS_AMOUNT == 0) {
            if (criteriaGroup.CASE_TRANS_AMOUNT.length === 0) {
                criteriaGroup.CASE_TRANS_AMOUNT.push(criteria.CASE_TRANS_AMOUNT)
            } else if (criteriaGroup.CASE_TRANS_AMOUNT.length === 1 && criteriaGroup.CASE_TRANS_AMOUNT.indexOf(criteria.CASE_TRANS_AMOUNT) >= 0) {
                // criteriaGroup.CASE_TRANS_AMOUNT.pop();
            } else if (criteriaGroup.CASE_TRANS_AMOUNT.length === 1 && criteriaGroup.CASE_TRANS_AMOUNT.indexOf(criteria.CASE_TRANS_AMOUNT) < 0) {
                criteriaGroup.CASE_TRANS_AMOUNT[0] = criteria.CASE_TRANS_AMOUNT
            }

            filteredData = filter.dimension(function (d) {
                return parseFloat(d[colMap.CASE_TRANS_AMOUNT]);
            })
                .filter(function(d) { return d <= parseFloat(criteriaGroup.CASE_TRANS_AMOUNT[0]); })
                .top(Infinity);
        }

        //CASE_RISK
        if (criteria.CASE_RISK || criteria.CASE_RISK == 0) {
            if (criteriaGroup.CASE_RISK.length === 0) {
                criteriaGroup.CASE_RISK.push(criteria.CASE_RISK)
            } else if (criteriaGroup.CASE_RISK.length === 1 && criteriaGroup.CASE_RISK.indexOf(criteria.CASE_RISK) >= 0) {
                // criteriaGroup.CASE_RISK.pop();
            } else if (criteriaGroup.CASE_RISK.length === 1 && criteriaGroup.CASE_RISK.indexOf(criteria.CASE_RISK) < 0) {
                criteriaGroup.CASE_RISK[0] = criteria.CASE_RISK
            }

            if(criteriaGroup.CASE_RISK[0] == 0){
                filteredData = filter.dimension(function (d) {
                    return parseFloat(d[colMap.CASE_RISK]);
                })
                    .filter(parseFloat(criteriaGroup.CASE_RISK[0]))
                    .top(Infinity);
            } else {
                filteredData = filter.dimension(function (d) {
                    return parseFloat(d[colMap.CASE_RISK]);
                })
                    .filter(function(d) { return d <= parseFloat(criteriaGroup.CASE_RISK[0]); })
                    .top(Infinity);
            }
        }

        currentData = filteredData;
        updateDisFilter(criteriaGroup);
        renderCharts(currentData);
    }

    function renderCharts(data){
        $("#donutChart_div text").remove();
        if(data.length == 0){
            d3.select("#donutChart_div").append("text")
                .attr("x", $("#donutChart_div").width() * 0.1)
                .attr("y", $("#donutChart_div").height() * 0.15)
                .attr("text-anchor", "middle")
                .style("font-size", "1.5em")
                .text("No Data Found!");
        }
        dataAggregation(data);
        $("#donutChart").css("height", "600px");
        renderBubbleChart("#donutChart_div", aggregatedBubbleChartData);
        drawd3PieChart("#donutChart_div", aggregatedPieChartData, "outer", "");

        setSearchResultTable(aggregatedBubbleChartData);
    }

    function updateDisFilter(criteriaGroup){
        var arr = [];
        var filterHtml;
        aggregatedBubbleChartData = [];
        aggregatedPieChartData = [];

        if (criteriaGroup.POINT_NAME.length > 0) {
            arr.push("<b>workflow name: </b>" + criteriaGroup.POINT_NAME.join(","));
        }

        if (criteriaGroup.CASE_TRANS_AMOUNT.length > 0) {
            arr.push("<b>case transaction amount: </b>" + criteriaGroup.CASE_TRANS_AMOUNT.join(","));
        }

        if (criteriaGroup.CASE_RISK.length > 0) {
            arr.push("<b>case transaction count: </b>" + criteriaGroup.CASE_RISK.join(","));
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

    $(window).resize(function(){
        renderCharts(currentData);
    });

    function dataAggregation(data){

        data.forEach(function(item){
            var group = "", color="";
            if(parseFloat(item[colMap.CASE_RISK]) >= 0.7) {
                group = "high";
                color = "#de3228";
            } else if(parseFloat(item[colMap.CASE_RISK]) >0.3 && parseFloat(item[colMap.CASE_RISK]) < 0.7){
                group = "medium";
                color = "#f6b61d"
            } else {
                group = "low";
                color = "#35c167";
            }

            if(item[colMap.WORKFLOW_NAME] == null){
                item[colMap.POINT_NAME] = "No Workflow";
            } else {
                item[colMap.POINT_NAME] = item[colMap.WORKFLOW_NAME];
            }

            if(item[colMap.ASSIGNED_USER] == null){
                item[colMap.USER_ASSIGNED] = "no assign";
            } else {
                item[colMap.USER_ASSIGNED] = item[colMap.ASSIGNED_USER];
            }
            if(item[colMap.CASE_OUTCOME] == null){
                item[colMap.RECOMMENDATION_AFTER] = "no recommendation";
            } else {
                item[colMap.RECOMMENDATION_AFTER] = item[colMap.CASE_OUTCOME]
            }

            aggregatedBubbleChartData.push({
                key: item[colMap.GUID],
                case_uid: item[colMap.CASE_UID],
                batch_num: item[colMap.BATCH_NUM],
                case_risk: item[colMap.CASE_RISK],
                value: item[colMap.CASE_TRANS_AMOUNT],
                group: group,
                color: color,
                trans_count: item[colMap.CASE_TRANS_COUNT],
                workflow_name: item[colMap.WORKFLOW_NAME],
                reviewStage: item[colMap.POINT_NAME],
                assigned_user:item[colMap.ASSIGNED_USER],
                currentReviewer: item[colMap.USER_ASSIGNED],
                recommendation: item[colMap.RECOMMENDATION_AFTER],
                case_outcome: item[colMap.CASE_OUTCOME]
            })
        });

        var filter = crossfilter(data);

        aggregatedPieChartData = filter.dimension(function(d){
            return d[colMap.POINT_NAME];
        }).group()
            .reduceCount(function(d){return d[colMap.POINT_NAME];})
            .top(Infinity);

        // var labels = [];
        var colors = d3.scale.ordinal().range(["#E0301E","#f47602", "#ed5e76", "#3fe825","#2593e8","#e5f92a", "#d8d23a", "#9ed3c6", "#6ada6a", "#7fcecf"]).domain(donutchartlabels);
        // var colors = d3.scale.linear().range(["#E0301E","#f47602","#3fe825"]).domain([0, parseInt(donutchartlabels.length/2),donutchartlabels.length]);
        aggregatedPieChartData.forEach(function(item, i){
            item["label"] = item.key;
            item["color"] = colors(item["label"]);
        });
    }

    function renderSlider(div_selector, data) {
        var max = d3.max(data, function(d){ return parseFloat(d.case_trans_amount);});
        var min = d3.min(data, function(d){ return Math.floor(d.case_trans_amount);});
        $(div_selector).slider({
            range:"max",
            min: 0,
            max: max + 10,
            value: max,
            step:0.01,
            slide: function(event, ui){
                $("#amount").val(ui.value);
            },
            change: function(event, ui){
                var amount=parseFloat(ui.value);
                var risk=parseFloat($("#risk").val());

                filterData({
                    CASE_TRANS_AMOUNT: ui.value,
                    CASE_RISK: risk
                });
            }
        });
        $("#amount").val($(div_selector).slider("value"));
    }

    function renderSlider1(div_selector, data) {
        var max = d3.max(data, function(d){ return parseFloat(d.case_risk);});
        var min = d3.min(data, function(d){ return parseFloat(d.case_risk);});
        $(div_selector).slider({
            range: "max",
            min: min,
            max: max,
            value: max,
            step: 0.1,
            slide: function(event, ui){
                $("#risk").val(ui.value);
            },
            change: function(event, ui){
                var amount=parseFloat($("#amount").val());
                var risk=parseFloat(ui.value);

                filterData({
                    CASE_RISK: ui.value,
                    CASE_TRANS_AMOUNT: amount
                });
            }
        });
        $("#risk").val($(div_selector).slider("value"));
    }

    function renderBubbleChart(div_selector, data){
        $("#svg_vis").remove();
        $("#gates_tooltip").remove();

        var chart,
            _this = this;
        chart = null;
        render_vis(data);

        $("#donutChart_div svg:nth-child(2)").css("position", "absolute").css("z-index", 0);
    }

    function render_vis(data){
        var width = $("#donutChart").width(),
            height = $("#donutChart").height();
        var chart = new BubbleChart(fullData, data, width, height);
        chart.start();
        return display_all();

        function display_all() {
            return chart.display_by_year();
        };
    }

    function drawd3PieChart(div_selector, data, ps_outer_inner, color){

        $(div_selector + ">#" + ps_outer_inner).remove();
        var W = document.querySelector("#donutChart").clientWidth,
            H = document.querySelector("#donutChart").clientHeight;

        var segments_colors = [];
        data.forEach(function(item){
            segments_colors.push(item.color);
        });

        var pie = new d3pie(div_selector, {
            header:{
                title: {
                    text: ""
                },
                location: "top-center"
            },
            size: {
                canvasHeight: $(div_selector).height() * 1.0,
                canvasWidth: $(div_selector).width(),
                pieInnerRadius: "80%",
                pieOuterRadius: "150%"
            },
            data: {
                content: data
            },
            ps_outer_inner: ps_outer_inner,
            id: ps_outer_inner,
            misc: {
                colors: {
                    segments: [
                        segments_colors
                    ]
                }
            },
            labels: {
                percentage: {
                    decimalPlaces: 2
                }
            },
            callbacks: {
                onClickSegment: showPathText
            }
        });

        function showPathText(d) {
            filterData({
                CASE_TRANS_AMOUNT: parseFloat($("#amount").val()),
                CASE_RISK: parseFloat($("#risk").val()),
                POINT_NAME: d.data.key
            });
        }

        $("#pie svg").css("margin-top", "-2.0rem");
        $("#donutChart_div svg:nth-child(1)").css("position", "absolute").css("z-index", 10);
    }


    function eventBinding() {
        $('main').delegate('.batch_num_block a', 'click', function () {
            batchId = this.getAttribute('data-batchid');
            getCaseList(false, batchId, alertGuid, entityGuid);

        });

        $('body input[type=text]').on("change", function () {
            if (tools.checkInputInformation($(this).val())) {
                $(this).val("");
                tools.showWarning("Invalid input, please re-type!");
            }
        });

        $('#removeFilter').click(function (e) {
            $(this).closest('tr').remove()
        });

        $('#selectAllCasesForAssignment').on('change', function () {
            var rows = resultsTable.rows({'search': 'applied'}).nodes();
            $('input[data-group="assign"]:checkbox:enabled', rows).prop('checked', this.checked);
            $('#assignButton').removeClass("disabled").addClass('waves-effect waves-light submit');
        });

        $('#selectAllCasesForAttachment').on('change', function () {
            var rows = resultsTable.rows({'search': 'applied'}).nodes();
            $('input[data-group="workflow"]:checkbox:enabled', rows).prop('checked', this.checked);
            $('#assignButton').removeClass("disabled").addClass('waves-effect waves-light submit');
        });

        $('#batchList').on('change', 'input[data-group="batch_guid"]', function () {
            if ($(this).is(':checked')) {
                batchId = batchId + $(this).val() + '|';
            } else {
                batchId = batchId.replace($(this).val(), '');
            }
            batchId = batchId.split('|');
            batchId = batchId[0];
            getCaseList(false, batchId, alertGuid, entityGuid);
        });

        $('#alertList').on('change', 'input[data-group="alertguid"]', function () {
            //alertGuid ='';
            if ($(this).is(':checked')) {
                alertGuid = alertGuid + $(this).val() + '|';
            } else {
                alertGuid = alertGuid.replace($(this).val(), '');
            }

            alertGuid = alertGuid.split('|');
            alertGuid = alertGuid[0];
            getCaseList(false, batchId, alertGuid, entityGuid);

        });

        $('#alertList').delegate('tr', 'click', function () {
            var triangleSpan = $(this).children('td').find('span');
            if(triangleSpan.css('display') == 'block') {
                triangleSpan.css('display','none');
                alertGuid = '';
            }else{
                alertGuid = triangleSpan.attr('id');
                triangleSpan.css('display','block');
            }
            getCaseList(false, null, alertGuid, entityGuid);
        });

        $('#entityList').delegate('tr', 'click', function () {
            var triangleSpan = $(this).children('td').find('span');
            if(triangleSpan.css('display') == 'block') {
                triangleSpan.css('display','none');
                entityGuid  = '';
            }else{
                entityGuid = triangleSpan.attr('id');
                triangleSpan.css('display','block');
            }
            getCaseList(false, null, alertGuid, entityGuid);
        });

        $('#entityList').on('change', 'input[data-group="entityguid"]', function () {
            if ($(this).is(':checked')) {
                entityGuid = entityGuid + $(this).val() + '|';
            } else {
                entityGuid = entityGuid.replace($(this).val(), '');
            }
            entityGuid = entityGuid.split('|');
            entityGuid = entityGuid[0];
            getCaseList(false, batchId, alertGuid, entityGuid);
        });

        $('#userTable').on('change', 'input[type=radio][name=group1]', function () {
            $('#assignCase').removeClass('btn-flat').addClass('btn');
        });

        $('#selectUser').on('change', function () {
            var role = $('#selectUser :selected').text().trim();
            userRole.search(role).draw();
        });

        $('#searchResultsTable').on('change', 'input[type=checkbox][name=caseResultCheck]', function () {
            $('#assignButton').removeClass("disabled");
        });

        $('#unaSearchResults').on('change', 'input[type=checkbox][name=caseResultCheck]', function () {
            $('#assignButton2').removeClass("disabled").addClass('waves-effect waves-light submit');
        });

        $('#selectFilter').on('change', function () {
            $('input:checkbox').removeAttr('checked');
            $("#operatorList option").remove();
            var selected = $('#selectFilter').find(':selected');
            var fType = selected.val();
            var fName = selected.text().trim();
            switch (fType) {
                case "free-text": //free text
                    $('#enterValue').show();
                    $('#staticText').hide();
                    $("#freeTextInput").val('');
                    $('#freeText').fadeIn();
                    $('#manageFilters').fadeIn();
                    $('#searchResultsTable').fadeIn();
                    break;
                case "static": //static text, from api call
                    $('#enterValue').fadeIn();
                    $('#freeText').hide();
                    $('#staticText').fadeIn();
                    $('#manageFilters').fadeIn();
                    $('#searchResultsTable').fadeIn();
                    apiToCall(fName); //call appropriate api
                    break;
                case "date":
                    $('#enterValue').show();
                    $('#staticText').hide();
                    $("#freeTextInput").val('');
                    $('#freeText').fadeIn();
                    $('#manageFilters').fadeIn();
                    $('#searchResultsTable').fadeIn();
                    break;
                default:
            }
            if (selected.data('validation') == 'numeric') {
                document.getElementById('freeTextInput').type = 'number';
            } else if (selected.data('validation') == 'date') {
                document.getElementById('freeTextInput').type = 'date';
                document.getElementById('freeTextInput').class = 'datepicker';
            } else {
                document.getElementById('freeTextInput').type = 'text';
            }
            if (selected.data('operator').indexOf('|') > 0) {
                $('#showOperator').fadeIn();
                var str = selected.data('operator');
                str = str.split('|');
                $.each(str, function (idx, val) {
                    $('#operatorList').append("<option value='" + val + "'> " + val + " </option>");
                });
            } else {
                $('#showOperator').hide();
                $('#operatorList').append("<option value='" + selected.data('operator') + "'> " + selected.data('operator') + " </option>");
            }
            $('.filled-in2 input:checkbox').on('change', function () {
                $('.filled-in2 input:checkbox').not(this).prop('checked', false);
            });

        });

        $('#selectRole').on('change', function () {
            var rGuid = $('#selectRole :selected').val();
            var searchResult = [];
            $.each(userRoleList, function (key, value) {
                if (value.rguid.indexOf(rGuid) > -1) {
                    searchResult.push(value);
                }
            });
            initializeUserRoleTable(searchResult);
        });

        $('#filterAdded tbody').on("click", '.removeFilter', function (e) {
            var filterTypeRemove = $(this).closest('tr').children('td.filterType').data('id');
            filterJson.splice(filterTypeRemove, 1); //also removes it from stored list
            displayFilterTable();
        });

        $('#selectSavedSearch').on('change', function () {
            var savedJson = $('#selectSavedSearch').find(':selected').data().json;
            $.each(savedJson, function (index, item) {
                if (searchName == 'case') {
                    filterJson.push({
                        name: item.name,
                        value: item.value,
                        tableName: item.tableName,
                        sField: item.sField,
                        typeUid: item.typeUid,
                        sOperator: item.sOperator
                    });
                } else {
                    filterJson.push({
                        name: item.name,
                        value: item.value,
                        tableName: item.tableName,
                        sField: item.sField,
                        typeUid: item.typeUid,
                        sOperator: item.sOperator
                    });
                }
                displayFilterTable();
            });
        });

        $('#assignCase').on("click", function (e) {
            var uGuid = $('input[name=group1]:checked', '#userTable').data('uguid');
            var oGuid = $('input[name=caseResultCheck]:checked', '#unaSearchResults').data('oguid');
            var oGuids;
            var unaChecked = $("#unaSearchResults input:checkbox:enabled:checked").map(function () {
                return $(this).val();
            }).get();
            var rows = resultsTable.rows({'search': 'applied'}).nodes();
            var allChecked = $('input[data-group=assign]:checkbox:enabled:checked', rows).map(function () {
                return $(this).val();
            }).get();
            if (unaChecked.length != 0) {
                oGuids = unaChecked;
            } else {
                oGuids = allChecked;
            }
            var formattedoGuids = [];
            $.each(oGuids, function (index, item) {
                formattedoGuids.push({"oGuid": item})
            });
            var cAssignmentData = new Object();
            cAssignmentData['uGuid'] = uGuid;
            cAssignmentData['objects'] = formattedoGuids;
            var maxLength = 500;
            if (formattedoGuids.length > maxLength) {
                var n = formattedoGuids.length % maxLength == 0 ? formattedoGuids.length / maxLength : parseInt(formattedoGuids.length / maxLength) + 1;
                var i = 0;
                var fun1 = function (i) {
                    assignCase({
                        uGuid: uGuid,
                        objects: formattedoGuids.slice(i * maxLength, i * maxLength + maxLength)
                    }, function () {
                        i++;
                        if (i == n) {
                            $('#userAssignment').modal('close');
                            initSearchResultTable();
                            tools.showSuccess("Case Assigned");
                        } else {
                            fun1(i)
                        }
                    })
                }
                fun1(i);
            } else {
                assignCase({uGuid: uGuid, objects: formattedoGuids}, function () {
                    $('#userAssignment').modal('close');
                    initSearchResultTable();
                    tools.showSuccess("Case Assigned");
                });
            }
        });

        $('#attachWorkflow').on("click", function (e) {
            if ($(this).attr("class") != 'btn right btn disabled') {
                var workflow_id = $(':checked', '#workflowTable').val();
                if (workflow_id != null) {
                    var oGuids;
                    var rows = resultsTable.rows({'search': 'applied'}).nodes();
                    var allChecked = $('input:checkbox:enabled:checked', rows).map(function () {
                        return $(this).val();
                    }).get();
                    oGuids = allChecked;
                    var workflowAssignmentData = new Object();
                    workflowAssignmentData['workflow_id'] = workflow_id;
                    workflowAssignmentData['objects'] = oGuids;
                    var maxLength = 500;
                    if (oGuids.length > maxLength) {
                        var n = oGuids.length % maxLength == 0 ? oGuids.length / maxLength : parseInt(oGuids.length / maxLength) + 1;
                        var i = 0;
                        var fun1 = function (i) {
                            attachWorkflow({
                                flowId: workflow_id,
                                oGuids: oGuids.slice(i * maxLength, i * maxLength + maxLength)
                            }, function () {
                                i++;
                                if (i == n) {
                                    $('#workflowAttachment').modal('close');
                                    tools.showSuccess('Case(s) attached to workflow');
                                    initSearchResultTable();
                                } else {
                                    fun1(i);
                                }
                            });
                        };
                        fun1(i);
                    } else {
                        attachWorkflow({flowId: workflow_id, oGuids: oGuids}, function () {
                            $('#workflowAttachment').modal('close');
                            tools.showSuccess('Case(s) attached to workflow');
                            initSearchResultTable();
                        });
                    }
                }
                else {
                    tools.showWarning('Please Select a Workflow to associate with.');
                }
            }
            else {
                tools.showWarning('Please Select a Case to associate with.');
            }
        });

        $('#searchForm').submit(function (event) {
            $("#filterAdded").find("tr:gt(0)").remove();
            filterJson = [];
            event.preventDefault(); // Prevent the form from submitting via the browser
            var input = $(this).serializeArray();
            var searchData = input[0].value;
            if (searchName == 'case') {
                filterJson.push({
                    name: "Case Number",
                    value: searchData,
                    tableName: "vw_case_summary_search_basic",
                    sField: "case_number",
                    typeUid: searchData,
                    sOperator: "="
                });
            } else {
                filterJson.push({
                    name: "Name",
                    value: searchData,
                    tableName: "vw_entity_search_basic",
                    sField: "primary_name",
                    typeUid: searchData,
                    sOperator: "like"
                });
            }
            initSearchResultTable();
        });
        $("#btb-addToFilterTable").click(function () {
            var selected = $('#selectFilter').find(':selected');
            var filterType = selected.text().trim(); //this is the Filter Type Name. e.g: Type, Status..
            var filterValue; //this is the typeUid: e.g claim->clm
            var filterText; //this is the actual text/value obtained from front-end e.g: open,'test'
            var tableName;
            var sOperator;
            var sField;
            if ($('.inputBox:visible').val() != null) {
                if (document.getElementById('freeTextInput').type == 'text') {
                    filterValue = $('.inputBox:visible').val();
                } else {
                    filterValue = $('.inputBox:visible').val();
                }
                if (filterType == 'Value') {
                    filterText = $('#operatorList').find(':selected').text().trim() + $('.inputBox:visible').val();
                } else {
                    filterText = $('.inputBox:visible').val();
                }
                tableName = selected.data('tsearch');
                sField = selected.data('sfield');
                sOperator = $('#operatorList').find(':selected').text().trim();
            } else { //else if static text from db
                filterValue = $('#staticTextInput').find(':selected').val();
                filterText = $('#staticTextInput').find(':selected').text().trim();
                tableName = selected.data('tsearch');
                sField = selected.data('sfield');
                sOperator = $('#operatorList').find(':selected').text().trim();
            }
            if ($('#' + filterType).length && filterType != 'Date' && filterType != 'Value') {
                tools.showWarning("Filter Type already in list. Please remove to add new filter.")
            } else {
                if (searchName == 'case') {
                    filterJson.push({
                        name: filterType,
                        value: filterText,
                        tableName: tableName,
                        sField: sField,
                        typeUid: filterValue,
                        sOperator: sOperator
                    })
                } else {
                    filterJson.push({
                        name: filterType,
                        value: filterText,
                        tableName: tableName,
                        sField: sField,
                        typeUid: filterValue,
                        sOperator: sOperator
                    })
                }
                displayFilterTable();
            }
            return false;
        });

        $("#btn-saveSearch").click(function () {
            $.ajaxEx({
                url: rootPath + '/search' + '/saveSearchFilters',
                type: post,
                data: filterTableList,
                success: function (res) {
                    console.log(res);
                },
                error: function (err) {
                    console.log(err);
                }
            })
        });

        $("#btn-performSearch").click(function () {
            performSearch();
        });

        $('#searchResults').on('click', 'a[data-click="removeAssignment"]', function () {
            var assignmentData = {
                oGuid: $(this).attr('data-click-data')
            };
            $.ajaxEx({
                beforeSend: function (request) {
                    if (confirm('Are you sure you want to remove case assignment?')) {
                        return true;
                    }
                    return false;
                },
                url: assignmentPath + '/removeAssignment',
                type: 'post',
                data: assignmentData,
                success: function (res) {
                    tools.showSuccess('Case Unassigned');
                    performSearch();
                },
                error: function (err) {
                    console.log(err);
                }
            });
        })
    }

    function initPage() {
        $('#filterAdded tbody > tr').remove();
        if (searchName == 'case') {
            $("#searchResults").find("tr").first().append('<th style="width:26%;">Name</th><th>Case Number</th><th>Case Date</th><th>Case Type</th><th>Case Basis</th><th>Case Status</th><th>Case Amount</th><th><input type="checkbox" class="filled-in" id="selectAllCases" name="selectCase" /><label for="selectAllCases">Assigned to</label></th>');
        } else {
            $("#searchResults").find("tr").first().append('<th style="width:26%;">Case ID</th><th>Batch ID</th><th>Risk Weight</th><th># Transaction</th><th>Transaction Amount</th><th><input type="checkbox" class="filled-in" id="selectAllCasesForAttachment" name="selectCase1" /><label for="selectAllCasesForAttachment">Review Stage</label></th><th><input type="checkbox" class="filled-in" id="selectAllCasesForAssignment" name="selectCase" /><label for="selectAllCasesForAssignment">Assigned User </label></th><th>Recommendation</th>');
        }
        if (searchName == 'entity') {
            $("#assignButton").hide();
        }
    }

    function performSearch() {
        $.ajaxEx({
            url: '/assignment' + '/getAssignments',
            type: 'get',
            success: function (response) {
                assignedOguids = [];
                $.each(response.data, function (index, item) {
                    assignedOguids.push(item.oGuid);
                    userAssigned.push({name: item.oGuid, user: item.assignCurrent})
                });
                var assignedObjects = assignedOguids;
                if (searchName == 'case') {
                    $.ajaxEx({
                        url: '/search' + '/caseSearch',
                        type: 'post',
                        data: {filterJson: filterJson},
                        success: function (res) {
                            updateSearchResult(res.data, assignedObjects);
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                } else {
                    $.ajaxEx({
                        url: '/search' + '/entitySearch',
                        type: 'post',
                        data: {filterJson: filterJson},
                        success: function (res) {
                            if (res.code == 0) {
                                updateSearchEntityResult(res.data, assignedObjects);
                            } else {
                                console.log(res);
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    })
                }
            },
            error: function (jqXhr, textStatus, errorThrown) {
                console.log(errorThrown);
            }
        });
    }

    function attachWorkflow(param, callback) {
        $.blockUI();
        $.ajaxEx({
            url: "/workflow" + '/attachWorkflow',
            type: 'post',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code != 0) {
                    $('#workflowAttachment').modal('close');
                    initSearchResultTable();
                    console.log(res);
                }
                callback();
                $.unBlockUI();
            },
            error: function (error) {
                console.log(error);
                tools.showError("Something went wrong");
                $.unBlockUI();
            }
        });
    }

    function assignCase(param, callback) {
        $.blockUI();
        $.ajaxEx({
            url: '/assignment' + '/assignCase',
            type: 'post',
            dataType: 'json',
            data: param,
            success: function (res) {
                if (res.code != 0) {
                    console.log(res);
                }
                callback();
                $.unBlockUI();
            },
            error: function (error) {
                console.log(error);
                tools.showError("Something went wrong");
                $.unBlockUI();
            }
        });
    }

    function updateSearchEntityResult(data) {
        $('#searchResults').DataTable().destroy();
        var dataTableOption = tools.getDataTableOption();
        dataTableOption.data = data;
        dataTableOption.DT_RowId = 'eguid';
        dataTableOption.columns = [{
            targets: 0,
            render: function (data, type, full, meta) {
                return '<a href="' + rootPath + entityPath + '/entityDetails/' + encodeURIComponent(full.eguid) + '">' + full.primary_name + '</a>';
            }
        },
            {data: "contact_name"},
            {data: "email"},
            {data: "phone"},
            {data: "case_count",},
            {
                data: "case_value",
                render: function (data, type, full) {
                    return tools.formatUSD(data);
                }
            },
            {data: "entity_type"}
        ];
        $('#searchResults').DataTable(dataTableOption);
    }

    function apiToCall(fName) {
        var apiCall;
        if (searchName == 'case') {
            switch (fName) {
                case "Type":
                    apiCall = "getCaseTypes";
                    attrib = "ctype"
                    fillStatic(apiCall, attrib); //call function to fill options of select menu
                    break;
                case "Basis":
                    apiCall = "getCaseBasis";
                    attrib = "cbasis"
                    fillStatic(apiCall, attrib);
                    break;
                case "Status":
                    apiCall = "getCaseStatus";
                    attrib = "cstatus"
                    fillStatic(apiCall, attrib);
                    break;
                default:
            }
        } else {
            switch (fName) {
                case "Type":
                    apiCall = "getEntityTypes";
                    fillEntityStatic(apiCall); //call function to fill options of select menu
                    break;
                default:
            }
        }
    }

    function fillEntityStatic(apiCall) {
        $.ajaxEx({
            url: '/search' + '/' + apiCall,
            type: 'post',
            success: function (res) {
                if (res.code == 0) {
                    var optionItems = res.data;
                    $("#staticTextInput option").remove(); // Remove all <option> child tags.
                    $.each(optionItems, function (index, item) { // Iterates through a collection
                        $("#staticTextInput").append( // Append an object to the inside of the select box
                            $("<option></option>")
                                .text(item["zct_short_desc"])
                                .val(item["zlk_ce_type"])
                                .data('uid', item["zlk_ce_type"])
                        );
                    });
                    $('select').material_select();
                } else {
                    console.log(res);
                }
            },
            error: function (err) {
                console.log(err);
            }
        });
    }

    function fillStatic(apiCall, attrib) {
        $.ajaxEx({
            url: '/search' + '/' + apiCall,
            type: 'post',
            success: function (res) {
                var optionItems = res.data;
                $("#staticTextInput option").remove(); // Remove all <option> child tags.
                $.each(optionItems, function (index, item) { // Iterates through a collection
                    $("#staticTextInput").append( // Append an object to the inside of the select box
                        $("<option></option>")
                            .text(item[attrib + "desc"])
                            .val(item[attrib + "uid"])
                            .data('uid', item[attrib + "uid"])
                    );
                });
            },
            error: function (err) {
                console.log(err);
                tools.showError('error');
            }
        })
    }

    function displayFilterTable() {
        $("#filterAdded").find("tr:gt(0)").remove();
        $.each(filterJson, function (index, item) {
            $('#filterAdded tbody').append(
                '<tr>' +
                '<td class="filterType" id="' + item.name + '" data-id="' + index + '">' + item.name + '</td>' +
                '<td class="filterValue">' + item.value + '</td>' +
                '<td> <a href="javascript:;" class="removeFilter"><span class="fa fa-trash-o"></span></a></td>' +
                '</tr>'
            );
        });
        performSearch();
    }

    function updateSearchResult(data, assignedOguids) {
        var dataTableOption = tools.getDataTableOption();
        dataTableOption.data = data;
        dataTableOption.columns = [{
            "targets": 0,
            "render": function (data, type, full, meta) {
                return '<a href="' + rootPath + '/case' + '/case-summary/' + encodeURIComponent(full.cguid) + '">' + full.ename + '</a>';
            }
        }, {
            data: "cnumber"
        }, {
            data: "cdate",
            render: function (data, type, full) {
                return tools.formatDate(data);
            }
        },
            {data: "ctype"},
            {data: "cbasis"},
            {data: "cstatus"}, {
                data: "camount",
                render: function (data, type, full) {
                    return tools.formatUSD(data);
                }
            }, {
                mRender: function (data, type, row) {
                    return assignedOguids.indexOf(row.cguid) >= 0 ? '<td style="text-align: center; ">' +
                    '<p><input name="caseResultCheck" type="checkbox" checked="checked" disabled="disabled"' + ' value="' + row.cguid + '" class="filled-in2" id="chkbox' +
                    row.cnumber + '"' + ' data-eguid="' + row.eguid + '"  />' +
                    '<label for="chkbox' + row.cnumber + '"> </label><a href="javascript:void(0)" data-click="removeAssignment" data-click-data="' + row.cguid + '"><span  id="fn' + row.cguid + '" class="label label-warning">Assigned</span></a>' +
                    '</p>' +
                    '</td>' : '<td style="text-align: center; ">' +
                    '<p><input name="caseResultCheck" type="checkbox" ' + ' value="' + row.cguid + '" class="filled-in2 disabled" id="chkbox' +
                    row.cnumber + '"' + ' data-eguid="' + row.eguid + '"  />' +
                    '<label for="chkbox' + row.cnumber + '">Unassigned</label>' +
                    '</p>' +
                    '</td>'
                }
            }
        ]
        $('#searchResults').DataTable().destroy();
        resultsTable = $('#searchResults').DataTable(dataTableOption);
    }

    function initializeUserRoleTable(data) {
        var dataTableOption = tools.getDataTableOption();
        dataTableOption.data = data;
        dataTableOption.iDisplayLength = 7;
        dataTableOption.columns = [
            {data: "username"},
            {data: "role_name"}, {
                mRender: function (data, type, row) {
                    return '<td style="text-align: center; ">' +
                        '<p><input name="group1" type="radio"' + ' value="' + row.uguid + '" id="chkbox' + row.uguid + row.rguid + '"' + ' data-rguid="' + row.rguid + '"' +
                        ' data-uguid="' + row.uguid + '"  />' +
                        '<label for="chkbox' + row.uguid + row.rguid + '">Assign</label>' +
                        '</p>' +
                        '</td>'
                }
            }
        ];
        $('#userRole').DataTable().destroy();
        $('#userRole').DataTable(dataTableOption);
    }

    function search(nameKey, myArray) {
        for (var i = 0; i < myArray.length; i++) {
            if (myArray[i].name === nameKey) {
                return myArray[i];
            }
        }
    }

    function showSearchProgress() {
        $('#progress-search').css({display: 'block'});
    }

    function hideSearchProgress() {
        $('#progress-search').css({display: 'none'});
    }
});

