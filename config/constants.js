module.exports = {
  apiVersion: 'v1',
  tokenExpiryTime: '48hr',
  tokenHeaderKey: 'x-auth-token',
  userTypes: {
    user: 'USER',
    admin: 'ADMIN',
    moderator: 'MODERATOR',
  },
};
