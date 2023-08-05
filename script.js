const cart = [];
const cartTotalElement = document.getElementById('cart-total');

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCartTotal();
}

function updateCartTotal() {
    const total = cart.reduce((acc, item) => acc + item.price, 0);
    cartTotalElement.textContent = total.toFixed(2);
}

const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// PayPal API credentials
const client_id = 'YOUR_CLIENT_ID';
const client_secret = 'YOUR_SECRET_KEY';

app.use(express.urlencoded({ extended: true }));

// Capture Payment
app.post('/capture-payment', async (req, res) => {
    const paymentId = req.body.paymentId; // Payment ID/token from the return URL

    try {
        const response = await axios.post(
            `https://api.paypal.com/v2/checkout/orders/${paymentId}/capture`,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        // Payment captured successfully
        res.json({ success: true, message: 'Payment captured successfully.' });
    } catch (error) {
        console.error('Error capturing payment:', error);
        res.status(500).json({ success: false, error: 'An error occurred while capturing payment.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
