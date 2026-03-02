const express = require('express');
const {getBookings, getBooking, addBooking, updateBooking, deleteBooking} = require('../controllers/bookings');

const router = express.Router({mergeParams: true});

const {protect, authorize} = require('../middleware/auth');

router.route('/').get(protect, getHotels).post(protect, authorize('admin', 'user'),addHotel);
router.route('/:id').get(protect, getHotel).put(protect, authorize('admin', 'user'),updateHotel).delete(protect, authorize('admin', 'user'),deleteHotel);

module.exports = router;