const db = require('./../config/database')

class Auction{
    constructor (){
        this.table='auction';
    }
    addAuctionDetail = (name, price, image, category, description, formattedDate) => {
        const sql = `INSERT INTO ${this.table} SET name=?, price=?, image=?, category=?, description=?, remaingtime=?`;
        return db.execute(sql, [name, price, image, category, description, formattedDate]);
      };
      
    getAllauction(){
        return db.execute(`SELECT * FROM ${this.table}`);
    }
    updateAuctionPrice(id, price){
        return db.execute(`UPDATE ${this.table} SET price=${price} WHERE id=${id}`);
    }
}

module.exports= Auction;