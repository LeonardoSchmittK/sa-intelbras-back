const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: 'AKIA6EBXBUKPXQOA3XQ5',
    secretAccessKey: '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',
    region: 'sa-east-1'
});

const s3 = new AWS.S3();

module.exports = {s3};
