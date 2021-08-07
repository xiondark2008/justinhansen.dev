const path = require('path')

module.exports = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(process.cwd(), 'node_modules')],
  }
}
