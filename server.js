const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const app = express();
const port = 3000;

app.use(bodyParser.json());

// PayPal API credentials
const client_id = 'AVOCiKCfPNhkW_dtri7rySgAwrAfCwxnDIPWeVebZ5DGPNZkxb5ylBDfv-sgqJZtcDRjBaPvxVT0LSKy'; //Client ID
const client_secret = 'EB-RucuIG5Hyz8dnrpuA2AA7trC3db1MGclLZuv0B23PQX6gQHp5TZLP4Bgx3Feyo9A2ChBwF8MCdYHW'; //Client Secret Key

let access_token = null;

// Function to get or refresh the access token
const getAccessToken = async () => {
    if (!access_token) {
        try {
            const response = await axios.post(
                'https://api-m.sandbox.paypal.com/v1/oauth2/token',
                'grant_type=client_credentials',
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    auth: {
                        username: client_id,
                        password: client_secret,
                    },
                }
            );

            access_token = response.data.access_token;
            return access_token;
        } catch (error) {
            console.error('Error getting access token:', error);
            throw error;
        }
    } else {
        return access_token;
    }
};

app.get('/make-payment', async (req, res) => {
    try {
        const token = await getAccessToken();

        const response = await axios.post(
            'https://api-m.sandbox.paypal.com/v2/checkout/orders',
            {
                intent: 'CAPTURE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: 'USD',
                            value: '100.00',
                        },
                        shipping: {
                            name: {
                                full_name: 'Andrea Epoxi',
                            },
                            address: {
                                address_line_1: '3900 Yupon St',
                                address_line_2: 'Houston',
                                state_or_province: 'TX',
                                zip_or_postal_code: '77006',
                                country_code: 'US',
                            },
                        },
                    },
                ],
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


// Example endpoint to capture/execute the PayPal payment
app.post('/capture-payment', async (req, res) => {
    const orderId = req.body.orderId; // PayPal Order ID obtained after payment approval

    try {
        const token = await getAccessToken();

        const response = await axios.post(
            `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const transactionId = response.data.id; // Transaction ID
        res.json({ success: true, transactionId });
    } catch (error) {
        console.error('Error capturing payment:', error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});
