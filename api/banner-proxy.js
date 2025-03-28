require('dotenv').config();
const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // Verify request source
    if (req.headers['x-authorized'] !== process.env.API_KEY || 
        req.headers['x-source'] !== 'official-tool') {
        return res.json({
            error: true,
            message: "Protected by MACBRUH FF",
            contact: "https://www.instagram.com/macbruh_ff",
            banners: []
        });
    }

    // Process valid request
    try {
        const region = req.query.region;
        const apiUrl = `https://ff-banner-api.vercel.app/banner/filter?region=${region}`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Add watermark to each banner
        const protectedData = Array.isArray(data) ? data.map(item => ({
            ...item,
            _copyright: "MACBRUH FF - https://www.instagram.com/macbruh_ff"
        })) : [];
        
        res.json(protectedData);
    } catch (error) {
        res.json({
            error: true,
            message: "API error - Content by MACBRUH FF",
            contact: "https://www.instagram.com/macbruh_ff",
            banners: []
        });
    }
};