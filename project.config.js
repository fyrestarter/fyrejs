
const path = require("path");

const config = {};

const rootDir = path.resolve("./");
const srcDirName = "src";
const distDirName = "dist";
const tempDirName = "temp";
const srcDir = rootDir + "/" + srcDirName;
const distDir = rootDir + "/" + distDirName;
const distDirTemp = rootDir + "/" + tempDirName;

const standaloneDir = "bin";

config.Environments = {

    DEVELOPMENT:"development",
    TEST:"test",
    PRODUCTION:"production"

};

config.srcDirName = srcDirName;
config.rootDir = rootDir;
config.distDir = distDir;
config.distDirTemp = distDirTemp;
config.srcDir = srcDir;

config.bundleMainFile = config.distDirTemp + "/" + srcDirName+ "/main.js";

config.testsDir = rootDir + "/tests";

config.standAloneDir = distDir + '/' + standaloneDir;

module.exports = config;