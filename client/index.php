<?php
        //Include our session php file
        include "config/session.php";
?>


<html lang="en">
<head>
    <title>Login</title>
    
    <!-- Bootstrap CSSS -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css">
    
    <!-- Optional Bootstrap Theme -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap-theme.min.css">
    
    <!-- CSS for Index page -->
    <link rel="stylesheet" type="text/css" href="styles/default.css">
</head>

<body>

    <!-- Include JQuery which is required by Bootstrap -->
    <script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
    <script src="//code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
    
    <script type="text/Javascript">
        var serverList;
        
        $( document ).ready(function() {
            console.log("Test");
            getServerList();
        });
        
        function getServerList()
        {
            console.log("getServerList");
            $.ajax({
                url: "http://vandergriftw.koding.io/ServerMonitor/api/server-list.php?apiKey=105af23f-917f-4ed0-b0fd-71c1b0a9df12&companyId=1",
                context: document.body,
                success: function(data){
                    console.log(data);
                    serverList = data;
                    JSON.parse(serverList);
                    alert(serverList);
                }
            });
            
            
        }
        
    </script>

    <!-- Bootstrap Javascript -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min.js"></script>
</body>
</html>