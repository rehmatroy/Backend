const Query = require('../model/query');

const queryy = new Query();

module.exports.addQuery = (req,res)=>{
    const { name, query } = req.body;
    if(!name || !query){
        return res.status(404).json({ message: "bad request" });
    }
    queryy.addQuery(name,query).then(()=>{
        return res.status(200).json({ message: "query added successfully" });
    }).catch((error)=>{
        res.status(400).json({error:error.message});
    });
};
module.exports.getQuery = (req,res)=>{
  
    queryy.getQuery().then(([data, columns]) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        const jsonData = JSON.stringify(data);
        res.write(jsonData);
        res.end();
    }).catch((err) => {
        console.log(err);
    });
};