"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const winston_1 = __importDefault(require("winston"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CONTACT_WEBHOOK_URL = process.env.CONTACT_WEBHOOK_URL;
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    try {
        const { name, email, longtext, imageUrl } = req.body;
        if (!name || !longtext) {
            res.status(400).json({ error: "Name and longtext are required" });
            return;
        }
        winston_1.default.info(`Contact form submitted: Name: ${name}, Email: ${email || "N/A"}, Message: ${longtext}, Image URL: ${imageUrl || "N/A"}`);
        try {
            await axios_1.default.post(CONTACT_WEBHOOK_URL, {
                content: `New Contact Form Submission`,
                avatar_url: imageUrl || "",
                embeds: [
                    {
                        title: name,
                        color: 3447003,
                        fields: [{ name: "Message", value: longtext, inline: false }],
                        footer: {
                            text: email || "N/A",
                        },
                        timestamp: new Date(),
                    },
                ],
            });
            res.status(200).json({ message: "Contact information received" });
        }
        catch (err) {
            winston_1.default.error(`Failed to send webhook: ${err.message}`);
            res.status(500).json({ error: "Failed to send contact information" });
        }
    }
    catch (err) {
        winston_1.default.error(`Error handling request to '/contact': ${err.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.default = router;
