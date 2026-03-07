// User queries
const getUsers = "SELECT * FROM users";
const getUsersById = "SELECT * FROM users WHERE id = $1";
const checkUsersExist = "SELECT * FROM users WHERE username = $1";
const addUsers = "INSERT INTO users (username, password) VALUES ($1, $2)";
const deleteUsers = "DELETE FROM users WHERE id = $1";
const UpdateUsers = "UPDATE users SET username = $1, password = $2 WHERE id = $3";

// Actuality queries
const getCountActuality = "SELECT COUNT(*) FROM actuality";
const getActuality = "SELECT * FROM actuality";
const getActualityByTitle = "SELECT * FROM actuality WHERE title LIKE '%' || $1 || '%'";
const getActualityById = "SELECT * FROM actuality WHERE id = $1";
const addActuality = "INSERT INTO actuality (title, description, image, slug, content) VALUES ($1, $2, $3, $4, $5)";
const AddActualityById = "INSERT INTO actuality (title, description, image, slug, content) SELECT title, description, image, slug, content FROM actuality WHERE id = $1";
const deleteActuality = "DELETE FROM actuality WHERE id = $1";
const UpdateActuality = "UPDATE actuality SET title = $1 , description = $2, image = $3, slug = $4, content = $5 WHERE id = $6";
const getActualityBySlug = "SELECT * FROM actuality WHERE slug = $1";

// Donation queries
const getDonations = "SELECT * FROM donations ORDER BY created_at DESC";
const getDonationsById = "SELECT * FROM donations WHERE id = $1";
const addDonation = "INSERT INTO donations (name, email, country, organization, phone, donation_mode, amount, payment_method, payment_detail, terms_accepted, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *";
const updateDonationStatus = "UPDATE donations SET status = $1 WHERE id = $2";
const deleteDonation = "DELETE FROM donations WHERE id = $1";

// Newsletter queries
const getSubscribers = "SELECT * FROM newsletter_subscribers ORDER BY created_at DESC";
const getSubscriberById = "SELECT * FROM newsletter_subscribers WHERE id = $1";
const addSubscriber = "INSERT INTO newsletter_subscribers (email, name, message, status) VALUES ($1, $2, $3, $4) RETURNING *";
const updateSubscriberStatus = "UPDATE newsletter_subscribers SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *";
const deleteSubscriber = "DELETE FROM newsletter_subscribers WHERE id = $1";
const getSubscriberByEmail = "SELECT * FROM newsletter_subscribers WHERE email = $1";

// Query groups
const userQueries = {
    getUsers,
    getUsersById,
    checkUsersExist,
    addUsers,
    deleteUsers,
    UpdateUsers
};

const actualityQueries = {
    getCountActuality,
    getActuality,
    getActualityByTitle,
    getActualityById,
    addActuality,
    AddActualityById,
    deleteActuality,
    UpdateActuality,
    getActualityBySlug
};

const donationQueries = {
    getDonations,
    getDonationsById,
    addDonation,
    updateDonationStatus,
    deleteDonation
};

const newsletterQueries = {
    getSubscribers,
    getSubscriberById,
    addSubscriber,
    updateSubscriberStatus,
    deleteSubscriber,
    getSubscriberByEmail
};

module.exports = {
    userQueries,
    actualityQueries,
    donationQueries,
    newsletterQueries
};