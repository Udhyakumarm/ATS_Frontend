/** @type {import('next').NextConfig} */

const nextConfig = {
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true
	},
	reactStrictMode: true,
	images: {
		domains: ["localhost", "127.0.0.1"]
	}
};

module.exports = nextConfig;
