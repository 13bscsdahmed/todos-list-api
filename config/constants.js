module.exports = {
  apiVersion: 'v1',
  tokenExpiryTime: '48hr',
  tokenHeaderKey: 'x-auth-token',
  reportExpiryTime: 15 * 60 * 1000, // 15 minutes
  paths: {
    staticAssetsDirectory: './static-assets',
  },
};
