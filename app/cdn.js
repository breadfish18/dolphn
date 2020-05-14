const AWS = require('aws-sdk');

const s3 = new AWS.S3({
    accessKeyId: process.env.ACCESS_ID,
    secretAccessKey: process.env.SECRET
});


class CDN {
    async uploadFile (file, name) {
        const params = {
            Bucket: 'dolphn',
            Key: `messages/${name}`,
            Body: file
        };
        const res = await s3.upload(params).promise();
    }
    async uploadAvatar (file, name) {
        const params = {
            Bucket: 'dolphn',
            Key: `avatars/${name}`,
            Body: file
        };
        const res = await s3.upload(params).promise()
    }
}

module.exports = CDN;