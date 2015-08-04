<?php

namespace Model;

class Server {
    
    public $id;
    public $company_id;
    public $name;
    public $description;
    public $createdOn;
    
    
    public function jsonEncodeServerInfo()
    {
        return json_encode($this);
    }
}