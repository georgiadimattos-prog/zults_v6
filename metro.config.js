const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// ✅ Add support for .mp4 video files
config.resolver.assetExts.push("mp4");

module.exports = config;
