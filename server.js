require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
var cors = require('cors')
const pool = require('./db');
// const locals = require("./middleware/siteTitle");
const appRouters = require("./routers/users-routers");

const PORT = process.env.SERVER_PORT || 5001;

const app = express();

// allows to use POST and GET json from our endpoints
app.use(cors())
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json({ limit: '500mb' }));
// app.use(bodyParser.urlencoded({ extended: true, limit: '500mb' }));

app.use('/images/actuality', express.static('images/actuality'));
app.use('/images/rapports', express.static('images/rapports'));
// app.set("view engine", "pug");
// app.set("views", process.cwd() + "/src/views");

// app.use(locals);
app.use("/api", appRouters);

// Initialize donations table and test database connection
async function initializeDatabase() {
    try {
        console.log('🔍 Testing database connection...');
        
        // Test database connection
        await pool.query('SELECT NOW()');
        console.log('✅ Database connection successful');
        
        // Create donations table if it doesn't exist
        const createDonationsTableQuery = `
            CREATE TABLE IF NOT EXISTS donations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL,
                country VARCHAR(255),
                organization VARCHAR(255),
                phone VARCHAR(50),
                donation_mode VARCHAR(50) NOT NULL,
                amount DECIMAL(10, 2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL,
                payment_detail TEXT NOT NULL,
                terms_accepted BOOLEAN NOT NULL DEFAULT false,
                status VARCHAR(50) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(email);
            CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
            CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
        `;
        
        await pool.query(createDonationsTableQuery);
        console.log('✅ Donations table initialized successfully');
        
        // Create newsletter subscribers table if it doesn't exist
        const createNewsletterTableQuery = `
            CREATE TABLE IF NOT EXISTS newsletter_subscribers (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) NOT NULL UNIQUE,
                name VARCHAR(255),
                message TEXT,
                status VARCHAR(50) NOT NULL DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            
            CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
            CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscribers(status);
            CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON newsletter_subscribers(created_at);
            
            CREATE OR REPLACE FUNCTION update_newsletter_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
            
            DROP TRIGGER IF EXISTS update_newsletter_subscribers_updated_at ON newsletter_subscribers;
            CREATE TRIGGER update_newsletter_subscribers_updated_at 
                BEFORE UPDATE ON newsletter_subscribers 
                FOR EACH ROW 
                EXECUTE FUNCTION update_newsletter_updated_at_column();
        `;
        
        await pool.query(createNewsletterTableQuery);
        console.log('✅ Newsletter subscribers table initialized successfully');
        
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
    }
}

// Test route
app.get('/api/test', (req, res) => {
    res.json({ 
        message: 'API is working!',
        timestamp: new Date().toISOString(),
        port: PORT
    });
});

// Initialize database and start server
initializeDatabase().then(() => {
    app.listen(PORT, () =>
        console.log(`✅ Server is running on http://localhost:${PORT} 🚀`)
    );
}).catch(error => {
    console.error('❌ Failed to start server:', error);
});