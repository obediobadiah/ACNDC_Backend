const pool = require("../db");
const donationQueries = require('../queries/queries');

const getDonations = (req, res) => {
    pool.query(donationQueries.getDonations, (error, results) => {
        if (error) {
            console.error('Error fetching donations:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results.rows);
    });
};

const getDonationsById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(donationQueries.getDonationsById, [id], (error, results) => {
        if (error) {
            console.error('Error fetching donation by ID:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Donation not found' });
        }
        res.status(200).json(results.rows[0]);
    });
};

const addDonation = (req, res) => {
    const { 
        name, 
        email, 
        country, 
        organization, 
        phone, 
        donation_mode, 
        amount, 
        payment_method, 
        payment_detail, 
        terms_accepted 
    } = req.body;

    console.log('Received donation request:', {
        name, 
        email, 
        country, 
        organization, 
        phone, 
        donation_mode, 
        amount, 
        payment_method, 
        payment_detail, 
        terms_accepted 
    });

    // Validate required fields
    if (!name || !email || !donation_mode || !amount || !payment_method || !payment_detail || terms_accepted === undefined) {
        console.log('Missing required fields');
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('Invalid email format:', email);
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Set default status
    const status = 'pending';

    pool.query(
        donationQueries.addDonation, 
        [name, email, country, organization, phone, donation_mode, amount, payment_method, payment_detail, terms_accepted, status], 
        (error, results) => {
            if (error) {
                console.error('Database error adding donation:', error);
                return res.status(500).json({ 
                    error: 'Database error',
                    details: error.message 
                });
            }
            console.log('Donation added successfully:', results.rows[0]);
            res.status(201).json({
                message: 'Donation created successfully',
                donation: results.rows[0]
            });
        }
    );
};

const updateDonationStatus = (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    // Validate status values
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    pool.query(donationQueries.getDonationsById, [id], (error, results) => {
        if (error) {
            console.error('Error checking donation existence:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        pool.query(donationQueries.updateDonationStatus, [status, id], (error, updateResults) => {
            if (error) {
                console.error('Error updating donation status:', error);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({
                message: 'Donation status updated successfully',
                status: status
            });
        });
    });
};

const deleteDonation = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(donationQueries.getDonationsById, [id], (error, results) => {
        if (error) {
            console.error('Error checking donation existence:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Donation not found' });
        }

        pool.query(donationQueries.deleteDonation, [id], (error, deleteResults) => {
            if (error) {
                console.error('Error deleting donation:', error);
                return res.status(500).json({ error: 'Database error' });
            }
            res.status(200).json({
                message: 'Donation deleted successfully'
            });
        });
    });
};

module.exports = {
    getDonations,
    getDonationsById,
    addDonation,
    updateDonationStatus,
    deleteDonation,
};
