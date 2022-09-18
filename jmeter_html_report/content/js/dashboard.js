/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 90.39301310043668, "KoPercent": 9.606986899563319};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5938775510204082, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.625, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0"], "isController": false}, {"data": [0.125, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3"], "isController": false}, {"data": [0.625, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7"], "isController": false}, {"data": [0.25, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7"], "isController": false}, {"data": [0.5625, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7"], "isController": false}, {"data": [0.90625, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages"], "isController": false}, {"data": [0.0, 500, 1500, "03_Go To My Info"], "isController": true}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses"], "isController": false}, {"data": [1.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-6"], "isController": false}, {"data": [0.625, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-4"], "isController": false}, {"data": [0.625, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-5"], "isController": false}, {"data": [0.875, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-3"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-3"], "isController": false}, {"data": [0.875, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-4"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-6"], "isController": false}, {"data": [0.625, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles"], "isController": false}, {"data": [0.6875, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/"], "isController": false}, {"data": [0.0, 500, 1500, "01_Homepage"], "isController": true}, {"data": [0.375, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-6"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://opensource-demo.orangehrmlive.com/-3"], "isController": false}, {"data": [0.625, 500, 1500, "https://opensource-demo.orangehrmlive.com/-2"], "isController": false}, {"data": [0.875, 500, 1500, "https://opensource-demo.orangehrmlive.com/-1"], "isController": false}, {"data": [0.375, 500, 1500, "https://opensource-demo.orangehrmlive.com/-0"], "isController": false}, {"data": [0.5625, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details"], "isController": false}, {"data": [0.0, 500, 1500, "02_Login"], "isController": true}, {"data": [0.4375, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees"], "isController": false}, {"data": [0.0, 500, 1500, "04_Click Personal Details"], "isController": true}, {"data": [0.71875, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31"], "isController": false}, {"data": [0.75, 500, 1500, "https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 229, 22, 9.606986899563319, 937.1834061135371, 206, 7944, 411.0, 2345.0, 3850.5, 7565.5, 1.476647687337585, 190.09748962840388, 1.4871638651736836], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-0", 4, 0, 0.0, 866.75, 375, 1069, 1011.5, 1069.0, 1069.0, 1069.0, 0.22100668545223492, 0.3761322276092602, 0.20357866802033261], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-1", 4, 0, 0.0, 399.25, 366, 434, 398.5, 434.0, 434.0, 434.0, 0.220592290299454, 0.5127585927590581, 0.1650672289472233], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-2", 4, 0, 0.0, 421.5, 238, 589, 429.5, 589.0, 589.0, 589.0, 0.22044640396803528, 1.3272531172499311, 0.1706091554147148], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0", 8, 2, 25.0, 391.37499999999994, 286, 542, 389.5, 542.0, 542.0, 542.0, 0.09329119680944108, 0.08315580067169662, 0.06131345259057992], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate", 4, 0, 0.0, 1901.5, 1012, 2345, 2124.5, 2345.0, 2345.0, 2345.0, 0.20893183598850876, 3.061647133716375, 1.3463759303995821], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-3", 4, 0, 0.0, 257.75, 217, 295, 259.5, 295.0, 295.0, 295.0, 0.21774632553075668, 0.21083543140990746, 0.18287289058247141], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-0", 4, 0, 0.0, 1078.5, 393, 1428, 1246.5, 1428.0, 1428.0, 1428.0, 0.13167423793534794, 2.135752281667654, 0.09245486042530779], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-4", 4, 0, 0.0, 257.5, 216, 295, 259.5, 295.0, 295.0, 295.0, 0.21777003484320556, 0.21117738730400698, 0.18427513202308363], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-1", 4, 0, 0.0, 627.75, 335, 911, 632.5, 911.0, 911.0, 911.0, 0.13189567052461504, 0.23426294020180036, 0.10098262274540838], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-5", 4, 0, 0.0, 261.5, 218, 295, 266.5, 295.0, 295.0, 295.0, 0.21773447281040773, 0.21119605968646238, 0.18312872530074575], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-6", 4, 0, 0.0, 260.0, 215, 294, 265.5, 294.0, 294.0, 294.0, 0.21777003484320556, 0.21139005335365854, 0.18406246597343207], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/auth/validate-7", 3, 0, 0.0, 264.6666666666667, 208, 295, 291.0, 295.0, 295.0, 295.0, 0.51440329218107, 0.49933288323045266, 0.4310136959876543], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7", 4, 0, 0.0, 1393.25, 1045, 1699, 1414.5, 1699.0, 1699.0, 1699.0, 0.06309347298022021, 1.4525978244581847, 0.3069029188617937], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7", 8, 2, 25.0, 700.1249999999999, 291, 2868, 381.5, 2868.0, 2868.0, 2868.0, 0.094025833597781, 0.08925108423539367, 0.05187948826440064], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/core/i18n/messages", 16, 0, 0.0, 472.6875, 322, 1123, 361.5, 986.5000000000001, 1123.0, 1123.0, 0.11148815786723154, 2.679635294363577, 0.07253807146390918], "isController": false}, {"data": ["03_Go To My Info", 4, 1, 25.0, 7385.75, 4681, 11129, 6866.5, 11129.0, 11129.0, 11129.0, 0.15579357351509251, 5.9086310248296, 1.6898429892891917], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses", 4, 1, 25.0, 365.25, 314, 406, 370.5, 406.0, 406.0, 406.0, 0.2140067412123482, 0.21944050612594299, 0.13312724038307208], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-6", 1, 0, 0.0, 318.0, 318, 318, 318.0, 318.0, 318.0, 318.0, 3.1446540880503147, 3.0525255503144653, 2.4843995676100628], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-4", 4, 0, 0.0, 759.0, 318, 914, 902.0, 914.0, 914.0, 914.0, 0.13104013104013104, 0.1271690724815725, 0.10451858108108109], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-0", 4, 0, 0.0, 702.25, 330, 964, 757.5, 964.0, 964.0, 964.0, 0.06339948012426298, 1.0856851403505992, 0.04563028989412287], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-5", 4, 0, 0.0, 604.5, 295, 904, 609.5, 904.0, 904.0, 904.0, 0.13104013104013104, 0.1272010647010647, 0.10384674447174448], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-1", 4, 0, 0.0, 481.75, 298, 917, 356.0, 917.0, 917.0, 917.0, 0.06342461192065581, 0.11261894592259027, 0.04855946850175211], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits", 4, 1, 25.0, 367.5, 309, 407, 377.0, 407.0, 407.0, 407.0, 0.21282255919127427, 0.3664642358339984, 0.13010441606810322], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-2", 4, 0, 0.0, 605.0, 287, 911, 611.0, 911.0, 911.0, 911.0, 0.13104013104013104, 0.1270091113841114, 0.10455057330057331], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-2", 4, 0, 0.0, 581.75, 298, 916, 556.5, 916.0, 916.0, 916.0, 0.06384574867121035, 0.061881743707203396, 0.050939430336307476], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails-3", 4, 0, 0.0, 912.5, 901, 932, 908.5, 932.0, 932.0, 932.0, 0.13103583830177554, 0.12706893304068662, 0.10397130724628185], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-3", 4, 0, 0.0, 582.0, 298, 917, 556.5, 917.0, 917.0, 917.0, 0.06384574867121035, 0.061912918389171755, 0.0506588581985922], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-4", 4, 0, 0.0, 430.25, 206, 916, 299.5, 916.0, 916.0, 916.0, 0.06384574867121035, 0.0619596804121243, 0.05092384299532329], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-5", 4, 0, 0.0, 581.75, 298, 915, 557.0, 915.0, 915.0, 915.0, 0.06384574867121035, 0.061975267753108486, 0.05059650883465547], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewPersonalDetails/empNumber/7-6", 1, 0, 0.0, 812.0, 812, 812, 812.0, 812.0, 812.0, 812.0, 1.2315270935960592, 1.1954471982758619, 0.9729545104679802], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles", 4, 1, 25.0, 453.25, 409, 544, 430.0, 544.0, 544.0, 544.0, 0.21246082753492324, 0.746465763929463, 0.13029824188665215], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal", 8, 2, 25.0, 380.375, 280, 511, 383.0, 511.0, 511.0, 511.0, 0.09336959185817159, 0.09033781556004249, 0.05990607602619017], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/", 4, 0, 0.0, 7248.0, 5923, 7944, 7562.5, 7944.0, 7944.0, 7944.0, 0.3392130257801899, 1205.3599467594556, 1.6142432369402986], "isController": false}, {"data": ["01_Homepage", 4, 0, 0.0, 7723.5, 6275, 8697, 7961.0, 8697.0, 8697.0, 8697.0, 0.3153827958684854, 1150.0306605052037, 1.691486635654025], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC", 4, 1, 25.0, 616.75, 304, 796, 683.5, 796.0, 796.0, 796.0, 0.2146728921805399, 2.514282875140879, 0.15303829227714272], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/pim/viewMyDetails", 4, 0, 0.0, 2092.25, 1698, 2342, 2164.5, 2342.0, 2342.0, 2342.0, 0.1278281989006775, 2.8274186992681836, 0.6195423351016234], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-6", 4, 0, 0.0, 4906.5, 3942, 6433, 4625.5, 6433.0, 6433.0, 6433.0, 0.45162018742237775, 643.7475302021, 0.31445819690640175], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-5", 4, 0, 0.0, 3994.75, 3453, 4409, 4058.5, 4409.0, 4409.0, 4409.0, 0.5182018396165307, 587.2648861575333, 0.36587883793237463], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-4", 4, 0, 0.0, 2852.5, 2693, 3276, 2720.5, 3276.0, 3276.0, 3276.0, 0.5746300818847866, 274.48855678063495, 0.40123096537853753], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-3", 4, 0, 0.0, 3523.75, 2422, 6451, 2611.0, 6451.0, 6451.0, 6451.0, 0.45034902049088044, 229.70438808826842, 0.31885062485926596], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-2", 4, 0, 0.0, 732.25, 249, 1002, 839.0, 1002.0, 1002.0, 1002.0, 0.8861320336730173, 1.448618187859991, 0.6187347696056712], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-1", 4, 0, 0.0, 426.0, 361, 502, 420.5, 502.0, 502.0, 502.0, 0.8403361344537815, 3.619641215861345, 0.5358784138655462], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/-0", 4, 0, 0.0, 1252.5, 745, 2405, 930.0, 2405.0, 2405.0, 2405.0, 0.5952380952380953, 0.6126767113095238, 0.36562965029761907], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details", 8, 2, 25.0, 647.125, 309, 1945, 476.5, 1945.0, 1945.0, 1945.0, 0.0940910801656003, 0.1066794375705683, 0.05917446838539706], "isController": false}, {"data": ["02_Login", 4, 1, 25.0, 4072.75, 2846, 4761, 4342.0, 4761.0, 4761.0, 4761.0, 0.4723107804935648, 15.895171913744244, 4.567093037843901], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees", 8, 2, 25.0, 591.8750000000001, 287, 1330, 511.0, 1330.0, 1330.0, 1330.0, 0.0928268083822608, 0.4230690573437609, 0.05103661437423128], "isController": false}, {"data": ["04_Click Personal Details", 4, 1, 25.0, 5631.25, 4809, 6914, 5401.0, 6914.0, 6914.0, 6914.0, 0.11062558769843464, 4.302298246584435, 1.2018649054151225], "isController": true}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31", 16, 4, 25.0, 389.06249999999994, 280, 509, 391.5, 469.1, 509.0, 509.0, 0.1859211229635827, 0.421182153315206, 0.10930128517976248], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed", 16, 4, 25.0, 376.6875, 275, 439, 404.5, 432.0, 439.0, 439.0, 0.18574198117040666, 0.16529041048977838, 0.10484264171532719], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 22, 100.0, 9.606986899563319], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 229, 22, "401/Unauthorized", 22, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/screen/personal/attachments?limit=50&offset=0", 8, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7", 8, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/employment-statuses", 4, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/subunits", 4, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/admin/job-titles", 4, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/custom-fields?screen=personal", 8, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees?limit=50&offset=0&model=detailed&includeEmployees=onlyCurrent&sortField=employee.firstName&sortOrder=ASC", 4, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees/7/personal-details", 8, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/pim/employees", 8, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/holidays?fromDate=2022-01-01&toDate=2022-12-31", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://opensource-demo.orangehrmlive.com/web/index.php/api/v2/leave/workweek?model=indexed", 16, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
