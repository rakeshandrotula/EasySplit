const axios = require('axios');

const API_URL = 'http://localhost:3000/api';

async function runTest() {
    try {
        console.log('--- Starting API Test ---');

        // 1. Create Users
        console.log('Creating users...');
        const user1 = await axios.post(`${API_URL}/users`, { name: 'Rahul', phone_number: '9999999991', upi_id: 'rahul@okaxis' });
        const user2 = await axios.post(`${API_URL}/users`, { name: 'Priya', phone_number: '9999999992', upi_id: 'priya@okicici' });
        const user3 = await axios.post(`${API_URL}/users`, { name: 'Amit', phone_number: '9999999993', upi_id: 'amit@paytm' });

        console.log(`Created Users: ${user1.data.name}, ${user2.data.name}, ${user3.data.name}`);

        // 2. Create Group
        console.log('Creating group...');
        const group = await axios.post(`${API_URL}/groups`, {
            group_name: 'Goa Trip',
            category: 'Trip',
            created_by: user1.data.id,
            currency: 'INR'
        });
        console.log(`Created Group: ${group.data.group_name}`);

        // 3. Add Members
        console.log('Adding members...');
        await axios.post(`${API_URL}/groups/${group.data.id}/members`, { user_id: user2.data.id });
        await axios.post(`${API_URL}/groups/${group.data.id}/members`, { user_id: user3.data.id });
        console.log('Members added.');

        // 4. Create Expense: Rahul pays 300, split equally (100 each)
        console.log('Adding expense...');
        await axios.post(`${API_URL}/expenses`, {
            group_id: group.data.id,
            paid_by: user1.data.id,
            amount: 300,
            description: 'Dinner',
            splits: [
                { user_id: user1.data.id, amount_owed: 100, share_type: 'equal' }, // Rahul's share
                { user_id: user2.data.id, amount_owed: 100, share_type: 'equal' }, // Priya's share
                { user_id: user3.data.id, amount_owed: 100, share_type: 'equal' }  // Amit's share
            ]
        });
        console.log('Expense added: Rahul paid 300 for Dinner (SPLIT: 100 each).');

        // 5. Check Settlements
        console.log('Calculating settlements...');
        const response = await axios.get(`${API_URL}/groups/${group.data.id}/settlements`);
        console.log('--- Settlements ---');
        console.log(JSON.stringify(response.data, null, 2));

        // Expected: Priya -> Rahul 100, Amit -> Rahul 100
        // (Or simplified if there were more transactions)

    } catch (error) {
        console.error('Test Failed:', error.response ? error.response.data : error.message);
    }
}

// Add a small delay to ensure server is up if called immediately
setTimeout(runTest, 2000);
