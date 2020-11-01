module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: process.env.NODE_ENV === 'development' ? '/' : '/vue-search-jobs/' /* Again, since "production" is on my server we need to specify  */
};
