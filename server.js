const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = '0x4AAAAAAA7Dxl7rF4gKcQjMsdD22bT31MI'; // Replace with your Cloudflare Turnstile secret key

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/your-form-handler', async (req, res) => {
    const token = req.body['cf-turnstile-response'];
    const exampleField = req.body.exampleField;

    if (!token) {
        return res.status(400).send('Turnstile token is missing');
    }

    try {
        const response = await axios.post('https://challenges.cloudflare.com/turnstile/v0/siteverify', null, {
            params: {
                secret: SECRET_KEY,
                response: token
            }
        });

        if (response.data.success) {
            // Token is valid, process the form data
            res.send(`Form submitted successfully! Example Field: ${exampleField}`);
        } else {
            res.status(400).send('Invalid Turnstile token');
        }
    } catch (error) {
        res.status(500).send('Error verifying Turnstile token');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});