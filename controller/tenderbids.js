const TenderBid = require('../model/tenderbids');

const tender = new TenderBid();

module.exports.addTenderBid=(req,res,next)=>{
    
  let {user_id, tender_id, amount, description,time}= req.body;
 
  
  if (!user_id ||!tender_id ||! amount ||!description || !time) {
      return res.status(400).json({status:false,message:"bad request"});
  }
  tender.addTenderBid(user_id, tender_id, amount, description,time).then(()=>{
      return res.status(200).json({ message: "tender details added successfully" });
  }).catch((error)=>{
      res.status(400).json({error:error.message});
  })
};



module.exports.getTenderWinner = (req, res) => {
  let id = req.params.id;
  tender.getTenderWinner(id).then(([data, columns]) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      const jsonData = JSON.stringify(data);
      res.write(jsonData);
      res.end();
  }).catch((err) => {
      console.log(err);
  })
}