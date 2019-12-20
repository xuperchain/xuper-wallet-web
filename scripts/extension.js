/**
 * @file (extension)
 */

const fs = require('fs');
const path = require('path');
const currentPath = process.cwd();
const customRoot = process.cwd().substring(0, process.cwd().lastIndexOf('/'));

// package.json object
const packageInfo = require(path.join(currentPath, 'package.json'));

// static file path
const staticPath = path.join('static', packageInfo.name);

// configuration file
const defaultConf = {
    static: {
        url: '/',
        devUrl: '/'
    },
    name: packageInfo.name
};
const confPath = path.join(currentPath, 'conf.json');
const conf = Object.assign({}, defaultConf, fs.existsSync(confPath) ? require(confPath) : {});

// common url
exports.commonUrl = conf.static;

// custom conf
exports.custom = conf.custom;

// custom root
exports.customRoot = customRoot;

// compile conf
exports.commonPath = {
    rootPath: currentPath,
    modulesPathMatch: /(node_modules|bower_compontents)/,
    buildPath: path.join(currentPath, 'build'),
    packagePath: path.join(currentPath, 'package.json'),
    htmlPath: path.join('static', conf.name || packageInfo.name, 'page'),
    static: {
        path: staticPath,
        cssPath: path.join(staticPath, 'css'),
        jsPath: path.join(staticPath, 'js'),
        assetsPath: path.join(staticPath, 'assets')
    }
};

// project information
exports.info = {
    version: packageInfo.version || '1.0.0',
    projectName: packageInfo.name || '',
    projectTitle: packageInfo.title || '',
    entry: conf.entry || packageInfo.main || './index.js'
};

/**
 * export -> path join function
 * @param {...string} paths join path
 * @return {*} path string
 */
exports.join = (...paths) => {
    return path.join.apply(null, paths);
};
