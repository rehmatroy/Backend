const AuctionBid = require('./../model/auctionBid');


const auction = new AuctionBid();

module.exports.addAuctionBidDetail=(req,res,next)=>{
    
    let {user_id,auction_id,name,amount}= req.body;
   
    if (!user_id ||!auction_id || !name || !amount) {
        return res.status(400).json({status:false,message:"bad request"});
    }
    auction.addAuctionBidDetail(user_id,name,auction_id,amount).then(()=>{
        return res.status(200).json({ message: "auction details added successfully" });
    }).catch((error)=>{
        res.status(400).json({error:error.message});
    });
}
module.exports.getAllauctionWinner = (req, res) => {
    let id = req.params.id;
    auction.getAllauctionWinner(id).then(([data, columns]) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const jsonData = JSON.stringify(data);
        res.write(jsonData);
        res.end();
    }).catch((err) => {
        console.log(err);
    });
};