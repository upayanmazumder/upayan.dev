const express = require('express');
const axios = require('axios');
const logger = require('winston');
const dotenv = require('dotenv');

dotenv.config();
const CONTACT_WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL;

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { name, email, longtext, imageUrl } = req.body;

        if (!name || !longtext) {
            return res.status(400).json({ error: 'Name and longtext are required' });
        }

        logger.info(`Contact form submitted: Name: ${name}, Email: ${email || 'N/A'}, Message: ${longtext}, Image URL: ${imageUrl || 'N/A'}`);

        try {
            await axios.post(CONTACT_WEBHOOK_URL, {
                content: `New Contact Form Submission`,
                avatar_url: imageUrl || '',
                embeds: [
                    {
                        title: name,
                        color: 3447003,
                        fields: [
                            { name: 'Message', value: longtext, inline: false },
                        ],
                        footer: {
                            text: email || 'N/A',
                        },
                        timestamp: new Date(),
                    },
                ],
            });

            res.status(200).json({ message: 'Contact information received' });
        } catch (err) {
            logger.error(`Failed to send webhook: ${err.message}`);
            res.status(500).json({ error: 'Failed to send contact information' });
        }
    } catch (err) {
        logger.error(`Error handling request to '/contact': ${err.message}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
