var Vibe = require('ui/vibe');
var Vector2 = require('vector2');
var UI = require('ui');
var ajax = require('ajax');

// Construct URL for fetching server list
var apiKey = '***';
var companyId = '***';
var curServer;
var serverListUrl = 'http://vandergriftw.koding.io/ServerMonitor/api/server-list.php?apiKey=' + apiKey + '&companyId=' + companyId;
var serverDetailsUrl = 'http://vandergriftw.koding.io/ServerMonitor/api/server-state.php?recordLimit=1&apiKey=' + apiKey + '&serverId=';
var serverHistoryUrl = 'http://vandergriftw.koding.io/ServerMonitor/api/server-state.php?recordLimit=44&apiKey=' + apiKey + '&serverId=';
var serverList = [];
var serverMenuItems = [];
var curServerDetails = [];
var curServerHistory = [];

//Variables for Server Status page
var txtRamUsagePct;
var rectRamUsagePct;
var txtRamTotal;
var txtRamFree;

//Windows
var loadingWindow;


//Initialize our App
appInit();


function appInit() {
    //Display the loading screen
    showLoadingScreen();

    //Display our first screen
    displayServerMenu();
}


function displayServerMenu() {
    // Fetch a list of servers using Ajax
    ajax(
    {
        url: serverListUrl,
        type: 'json'
    },
    function (data) {
        //Successfully fetched information from server, build server menu
        console.log("Fetched server list");
        buildServerMenu(data);

        var menu = new UI.Menu({
            sections: [{
                items: serverMenuItems
            }]
        });

        //Wire up the event handler for server menu item select
        menu.on('select', function (e) { ServerMenuItemClick(e); });

        //Hide the loading screen
        loadingWindow.hide();

        //Display the menu
        menu.show();
    });
}


function ServerMenuItemClick(e) {
    //Event handler for server menu item select
    curServer = serverList[e.itemIndex];
    displayServerDetails(curServer);
}

function displayServerDetails(server) {
    console.log("Server Details Url: " + serverDetailsUrl + curServer.id);

    loadingWindow.show();
    curServerDetails = [];

    // Fetch the latest server_log generated from the given server
    ajax(
    {
        url: serverDetailsUrl + curServer.id,
        type: 'json'
    },
    function (data) {
        //Successfully fetched server details from server
        curServerDetails.push(data[0]);

        //Display the server ram window
        buildServerRamWindow();
    });
}

function displayServerHistoryDetails(server) {
    console.log("Server History Url: " + serverHistoryUrl + curServer.id);

    loadingWindow.show();

    // Fetch up to 50 server_log records for the given server to show it's history
    ajax(
    {
        url: serverHistoryUrl + curServer.id,
        type: 'json'
    },
    function (data) {
        //Successfully fetched server details from server
        curServerHistory = data;

        //Display the server history window
        buildServerRamHistoryWindow();
    });
}

function buildServerRamWindow() {
    // Display the server details card for the specified server
    var serverWindow = new UI.Window();

    //Server name text box
    var txtName = new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(144, 30),
        font: 'gothic-24-bold',
        text: curServerDetails[0].serverName,
        textAlign: 'center'
    });
    serverWindow.add(txtName);

    //Server name text box
    var txtRam = new UI.Text({
        position: new Vector2(0, 25),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: 'RAM Info',
        textAlign: 'center'
    });
    serverWindow.add(txtRam);

    //Divider Top
    var rectDividerTop = new UI.Rect({
        position: new Vector2(0, 45),
        size: new Vector2(144, 2)
    });
    serverWindow.add(rectDividerTop);

    //Server used ram pct progress bar
    rectRamUsagePct = new UI.Rect({
        position: new Vector2(0, 60),
        size: new Vector2(1, 10)
    });
    serverWindow.add(rectRamUsagePct);

    //Server used ram label text box
    var txtRamUsagePctLabel = new UI.Text({
        position: new Vector2(0, 70),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: "Usage: ",
        textAlign: 'left'
    });
    serverWindow.add(txtRamUsagePctLabel);

    //Server used ram text box
    txtRamUsagePct = new UI.Text({
        position: new Vector2(0, 70),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: curServerDetails[0].ramUsagePct + "%",
        textAlign: 'right'
    });
    serverWindow.add(txtRamUsagePct);

    //Server total ram label text box
    var txtRamTotalLabel = new UI.Text({
        position: new Vector2(0, 90),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: "Total: ",
        textAlign: 'left'
    });
    serverWindow.add(txtRamTotalLabel);

    //Server total ram value text box
    txtRamTotal = new UI.Text({
        position: new Vector2(0, 90),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: curServerDetails[0].ramTotal + " MB",
        textAlign: 'right'
    });
    serverWindow.add(txtRamTotal);

    //Server free ram text box
    var txtRamFreeLabel = new UI.Text({
        position: new Vector2(0, 110),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: "Free: ",
        textAlign: 'left'
    });
    serverWindow.add(txtRamFreeLabel);

    //Server free ram text box
    txtRamFree = new UI.Text({
        position: new Vector2(0, 110),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: curServerDetails[0].ramFree + " MB",
        textAlign: 'right'
    });
    serverWindow.add(txtRamFree);

    //Wire up events for the serverCard
    serverWindow.on('click', 'back', function (e) { serverWindow.hide(); });
    serverWindow.on('click', 'select', function (e) { updateServerDetails(); });
    serverWindow.on('click', 'down', function (e) {
        serverWindow.hide();
        displayServerHistoryDetails(curServer);
    });

    //Hide the loading window
    loadingWindow.hide();

    // Show the server info window
    serverWindow.show();

    //Animate the progress bar
    var size = rectRamUsagePct.size();
    size.x = (curServerDetails[0].ramUsagePct / 100) * 144;
    rectRamUsagePct.animate('size', size, 1000);
}

function buildServerRamHistoryWindow() {
    // Display the server details card for the specified server
    var serverHistoryWindow = new UI.Window();

    //Calculate the size of each individual bar based on total number of data points
    var dataPoints = {};
    var numDataPoints = curServerHistory.length;
    var barWidth = Math.floor(132 / numDataPoints);
    var barStartX = 4;

    //Server name text box
    var txtName = new UI.Text({
        position: new Vector2(0, 0),
        size: new Vector2(144, 30),
        font: 'gothic-24-bold',
        text: curServerHistory[0].serverName,
        textAlign: 'center'
    });
    serverHistoryWindow.add(txtName);

    //Server name text box
    var txtRam = new UI.Text({
        position: new Vector2(0, 25),
        size: new Vector2(144, 20),
        font: 'gothic-18-bold',
        text: 'History',
        textAlign: 'center'
    });
    serverHistoryWindow.add(txtRam);

    //Divider Top
    var rectDividerTop = new UI.Rect({
        position: new Vector2(0, 45),
        size: new Vector2(144, 2)
    });
    serverHistoryWindow.add(rectDividerTop);

    //bar graph border
    var rectGraphBorder = new UI.Rect({
        position: new Vector2(4, 50),
        size: new Vector2(136, 100),
        borderColor: 'white',
        backgroundColor: 'black'
    });
    serverHistoryWindow.add(rectGraphBorder);

    //Loop through our data points and create a rect for each one
    for (var i = 0; i < numDataPoints; i++) {
        console.log('Begin data point: ' + i);
        console.log('Position: ' + (barStartX + ((numDataPoints - i) * barWidth)));
        console.log('Bar Width: ' + barWidth);
        console.log('Ram Usage: ' + curServerHistory[i].ramUsagePct);

        dataPoints['dp' + i] = new UI.Rect({
            position: new Vector2(barStartX + ((numDataPoints - i) * barWidth), (150 - curServerHistory[i].ramUsagePct)),
            size: new Vector2(barWidth - 1, curServerHistory[i].ramUsagePct)
        });
        serverHistoryWindow.add(dataPoints['dp' + i]);
    }

    //Wire up events for the serverCard
    serverHistoryWindow.on('click', 'back', function (e) { serverHistoryWindow.hide(); });
    serverHistoryWindow.on('click', 'up', function (e) {
        serverHistoryWindow.hide();
        displayServerDetails(curServer);
    });

    //Hide the loading window
    loadingWindow.hide();

    // Show the server info window
    serverHistoryWindow.show();
}

function updateServerDetails() {
    //Notify the user that we're updating data
    Vibe.vibrate('short');

    // Fetch a list of servers using Ajax
    ajax(
    {
        url: serverDetailsUrl + curServer.id,
        type: 'json'
    },
    function (data) {
        curServerDetails = [];
        curServerDetails.push(data[0]);

        //Update server window
        txtRamUsagePct.text(curServerDetails[0].ramUsagePct + "%");
        rectRamUsagePct.size(new Vector2((curServerDetails[0].ramUsagePct / 100) * 144, 10));
        txtRamTotal.text(curServerDetails[0].ramTotal + " MB");
        txtRamFree.text(curServerDetails[0].ramFree + " MB");
    });
}

function showLoadingScreen() {
    loadingWindow = new UI.Window();
    var loading_image = new UI.Image({
        position: new Vector2(0, 0),
        size: new Vector2(144, 168),
        backgroundColor: '',
        image: 'images/loading.png',
    });

    loadingWindow.add(loading_image);
    loadingWindow.show();
}

function buildServerMenu(jsonData) {
    //Build the server menu and store a list of all fetched servers in serverList
    console.log("Build Server Menu");
    //Clear the server list and menu
    serverList = [];
    serverMenuItems = [];

    for (var i = 0; i < jsonData.length; i++) {
        //Add the item to our serverList
        serverList.push(jsonData[i]);

        //Create a menu item for the current server
        var server = jsonData[i];
        serverMenuItems.push({
            title: server.name,
            subtitie: server.description
        });
    }
}
