const express = require("express");
const {addAuctionDetail, getAllauction, updateAuctionPrice} = require('../controller/auction');
const {addAuctionBidDetail,getAllauctionWinner} = require('../controller/auctionBid');
const imageUpload = require('../config/fileUpload')

const router = express.Router();


router.post("/addAuction",imageUpload, addAuctionDetail);
router.get("/getAllauctionWinner/:id", getAllauctionWinner)
router.get("/getAllauction", getAllauction)
router.post("/updateAuctionPrice", updateAuctionPrice)
router.post("/addAuctionBidDetail", addAuctionBidDetail)


module.exports = router;