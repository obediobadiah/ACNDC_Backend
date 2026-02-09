const pool = require('../db');
const { newsletterQueries } = require('../queries/queries');

// Get all newsletter subscribers
const getSubscribers = (req, res) => {
    pool.query(newsletterQueries.getSubscribers, (error, results) => {
        if (error) {
            console.error('Error fetching newsletter subscribers:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json(results.rows);
    });
};

// Get newsletter subscriber by ID
const getSubscriberById = (req, res) => {
    const id = parseInt(req.params.id);
    
    pool.query(newsletterQueries.getSubscriberById, [id], (error, results) => {
        if (error) {
            console.error('Error fetching newsletter subscriber:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Subscriber not found' });
        }
        
        res.status(200).json(results.rows[0]);
    });
};

// Add new newsletter subscriber
const addSubscriber = (req, res) => {
    const { email, name, message } = req.body;

    console.log('Received newsletter subscription request:', { email, name, message });

    // Validate required field
    if (!email || !email.trim()) {
        console.log('Missing email field');
        return res.status(400).json({ error: 'Email is required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        console.log('Invalid email format:', email);
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Set default status
    const status = 'active';

    pool.query(
        newsletterQueries.addSubscriber, 
        [email.toLowerCase().trim(), name || null, message || null, status], 
        (error, results) => {
            if (error) {
                console.error('Database error adding newsletter subscriber:', error);
                
                // Check if it's a duplicate email error
                if (error.code === '23505') {
                    return res.status(409).json({ 
                        error: 'Email already subscribed',
                        details: 'This email address is already subscribed to the newsletter'
                    });
                }
                
                return res.status(500).json({ 
                    error: 'Database error',
                    details: error.message 
                });
            }
            
            console.log('Newsletter subscriber added successfully:', results.rows[0]);
            res.status(201).json({
                message: 'Successfully subscribed to newsletter',
                subscriber: results.rows[0]
            });
        }
    );
};

// Update newsletter subscriber status
const updateSubscriberStatus = (req, res) => {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status || !['active', 'inactive', 'unsubscribed'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status. Must be: active, inactive, or unsubscribed' });
    }

    pool.query(
        newsletterQueries.updateSubscriberStatus, 
        [status, id], 
        (error, results) => {
            if (error) {
                console.error('Error updating newsletter subscriber status:', error);
                return res.status(500).json({ error: 'Database error' });
            }
            
            if (results.rows.length === 0) {
                return res.status(404).json({ error: 'Subscriber not found' });
            }
            
            console.log('Newsletter subscriber status updated successfully:', results.rows[0]);
            res.status(200).json({
                message: 'Subscriber status updated successfully',
                subscriber: results.rows[0]
            });
        }
    );
};

// Delete newsletter subscriber
const deleteSubscriber = (req, res) => {
    const id = parseInt(req.params.id);

    pool.query(newsletterQueries.deleteSubscriber, [id], (error, results) => {
        if (error) {
            console.error('Error deleting newsletter subscriber:', error);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (results.rowCount === 0) {
            return res.status(404).json({ error: 'Subscriber not found' });
        }
        
        console.log('Newsletter subscriber deleted successfully, ID:', id);
        res.status(200).json({
            message: 'Subscriber deleted successfully'
        });
    });
};

module.exports = {
    getSubscribers,
    getSubscriberById,
    addSubscriber,
    updateSubscriberStatus,
    deleteSubscriber
};
