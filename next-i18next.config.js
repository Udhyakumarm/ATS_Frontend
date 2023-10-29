const path = require("path");

module.exports = {
	debug: true,
	i18n: {
		defaultLocale: "ja",
		locales: ["en", "ja"],
		localePath: path.resolve("./public/locales")
	}
};
