const path = require('path');

module.exports = {
  debug: true,
    i18n: {
      defaultLocale: 'en',
      locales: ['en', 'ja'],
      localePath: path.resolve('./public/locales')
    },
}