const db = require("../config/database");


class Admin{
    constructor(){
        this.table='admin';
    }
    adminlogin(email,password){
        return db.execute('')
    }
}