require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dma7hehw8',
    api_key: '326753918922412',
    api_secret: 'v_tf_049AqJnZIjXZrnWE28XwFs',
});

module.exports = cloudinary;
