const pool = require('./db');
const fs = require('fs');
const path = require('path');

async function setupDonationsTable() {
    try {
        console.log('Setting up donations table...');
        
        // Read the migration file
        const migrationPath = path.join(__dirname, 'migrations', 'create_donations_table.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Execute the migration
        await pool.query(migrationSQL);
        
        console.log('✅ Donations table created successfully!');
        
        // Test the table by inserting a test record
        const testQuery = `
            INSERT INTO donations (name, email, donation_mode, amount, payment_method, payment_detail, terms_accepted, status) 
            VALUES ('Test User', 'test@example.com', 'onetime', 25.00, 'mobile-money', 'Test Provider: 123456789', true, 'pending')
            RETURNING id;
        `;
        
        const testResult = await pool.query(testQuery);
        console.log(`✅ Test record inserted with ID: ${testResult.rows[0].id}`);
        
        // Clean up the test record
        await pool.query('DELETE FROM donations WHERE name = \'Test User\'');
        console.log('✅ Test record cleaned up');
        
        console.log('🎉 Donations table is ready for use!');
        
    } catch (error) {
        console.error('❌ Error setting up donations table:', error);
        
        // Check if table already exists
        if (error.code === '42P07') {
            console.log('ℹ️  Donations table already exists');
        } else {
            console.error('Detailed error:', error.message);
        }
    } finally {
        await pool.end();
    }
}

setupDonationsTable();
