const db = require('./../config/database')

class AuctionBid{
    constructor (){
        this.table='auctionbid';
    }
    addAuctionBidDetail(user_id,name,auction_id,amount){
        return db.execute(`INSERT INTO ${this.table} SET user_id=${user_id}, name= "${name}",auction_id=${auction_id}, amount=${amount} `)
    }
    getAllauctionBid(){
        return db.execute(`SELECT * FROM ${this.table}`);
    }
    getAllauctionWinner(id){
        return db.execute(`SELECT user_id,amount,name
        FROM ${this.table}
        WHERE auction_id = ${id} AND  amount = (SELECT MAX(amount) FROM ${this.table} );
        `);
    }
}

module.exports= AuctionBid;