import express from 'express';
import {
  addAddress,
  updateAddress,
  deleteAddress,
  fetchAddress
} from '../controllers/addressController.js';

const router = express.Router();

router.post('/add', addAddress);
router.get('/fetch/:userId', fetchAddress);
router.put('/update', updateAddress);
router.delete('/delete', deleteAddress);

export default router;
