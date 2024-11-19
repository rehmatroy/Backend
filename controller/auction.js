const Auction = require('./../model/auction');


const auction = new Auction();

module.exports.addAuctionDetail = (req, res, next) => {
    let { name, price, image, category, description, remaingtime } = req.body;
    image = req.file.filename;
  
    const parsedDate = new Date(remaingtime);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ status: false, message: "Invalid date format" });
    }
  
    // Format the date as 'YYYY-MM-DD HH:mm:ss'
    const formattedDate = parsedDate.toISOString().slice(0, 19).replace("T", " ");
  
    if (!name || !price || !image || !category || !description || !formattedDate) {
      return res.status(400).json({ status: false, message: "Bad request" });
    }
  
    auction.addAuctionDetail(name, price, image, category, description, formattedDate)
      .then(() => {
        return res.status(200).json({ message: "Auction details added successfully" });
      })
      .catch((error) => {
        res.status(400).json({ error: error.message });
      });
  };
  

module.exports.getAllauction = (req, res) => {
    auction.getAllauction().then(([data, columns]) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const jsonData = JSON.stringify(data);
        res.write(jsonData);
        res.end();
    }).catch((err) => {
        console.log(err);
    });
};
module.exports.updateAuctionPrice=(req,res)=>{
    let {id,price}= req.body;
     price = parseInt(price, 10);
   
    if (!price || !id) {
        return res.status(400).json({status:false,message:"bad request"});
    }
    auction.updateAuctionPrice(id,price).then(()=>{
        return res.status(200).json({ message: "auction price  update successfully" });
    }).catch((error)=>{
        res.status(400).json({error:error.message});
    });
}
