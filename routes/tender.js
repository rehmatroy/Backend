const express = require('express');
const tenderController = require('../controller/tender');
const { addTenderBid, getTenderWinner } = require('../controller/tenderbids');

const router = express.Router();

// Get all tenders
router.get('/alltender', tenderController.getAllTenders);

// Get a specific tender by ID
// router.get("/:id", tenderController.getTenderById);

// Create a new tender
router.post('/createTender', tenderController.createTender);
router.post('/addTenderBid', addTenderBid);

router.get('/getTenderWinner/:id', getTenderWinner);

// Update a tender
router.put('/updateTender/:id', tenderController.updateTender);

// Delete a tender
router.delete('/:id', tenderController.deleteTender);

module.exports = router;
