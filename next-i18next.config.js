const path = require("path");

module.exports = {
	debug: true,
	i18n: {
		defaultLocale: "en",
		locales: ["en", "ja"],
		localeDetection: true,
		localePath: path.resolve("./public/locales")
	}
};
