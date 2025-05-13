import Address from "../models/Address.js";

export const addAddress = async (req, res) => {
  try {
    const { userId,address, city, postalCode, country } = req.body; // Check if userId is available
    const newAddress = new Address({
      user: userId,
      address,
      city,
      postalCode,
      country
    });

    const savedAddress = await newAddress.save();

    res.status(201).json({
      success:true,
      message: 'Address added successfully',
      address: savedAddress
    });
  } catch (error) {
    console.error('Error in addAddress:', error); // Log any error
    res.status(500).json({ message: 'Error adding address', error: error.message });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const { userId, address, city, postalCode, country } = req.body;
    const updatedAddress = await Address.findOneAndUpdate(
      { user: userId },
      { address, city, postalCode, country },
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({ message: 'Address not found or unauthorized' });
    }

    res.json({ message: 'Address updated successfully', address: updatedAddress });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating address', error: error.message });
  }
};


export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.user._id;

    const deleted = await Address.findOneAndDelete({ _id: addressId, user: userId });

    if (!deleted) {
      return res.status(404).json({ message: 'Address not found or unauthorized' });
    }

    res.json({ message: 'Address deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting address', error: error.message });
  }
};

export const fetchAddress = async (req, res) => {
  try {
    const userId = req.params.userId;

    const address = await Address.findOne({ user: userId }).select('address city postalCode country');

    if (!address) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.json({ address });
  } catch (error) {
    console.error('Error fetching address:', error);
    res.status(500).json({ message: 'Error fetching address', error: error.message });
  }
};


