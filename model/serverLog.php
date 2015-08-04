<?php

namespace Model;

class ServerLog {
    
    public $id;
    public $server_id;
    public $serverName;
    public $serverDescription;
    public $ramUsagePct;
    public $createdOn;
    
    
    public function jsonEncodeServerInfo()
    {
        return json_encode($this, JSON_PRETTY_PRINT);
    }
}