const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude android and ios directories from the watcher to avoid ENOENT errors on Windows
config.resolver.blockList = [
  /android\/.*/,
  /ios\/.*/,
];

module.exports = config;
