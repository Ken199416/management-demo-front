module.exports = {
  devServer: {
    open: true,
    port: 8537
  },
  publicPath: process.env.NODE_ENV === "production" ? "/management-front/" : "/",

  lintOnSave: false
}
