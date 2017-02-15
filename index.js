'use strict';

// add timestamps in front of log messages
require('console-stamp')(console, 'yyyy/mm/dd HH:MM:ss');
const config = require('./config/config.json');
const CML_MAIL_IP = '140.112.29.132'
const Promise = require('bluebird');
const table2json = require('tabletojson');
const request = require('request-promise');
const iconv = require('iconv-lite');
const fs = Promise.promisifyAll(require('fs'));

const option = {
    method: 'POST',
    uri: 'http://cert.ntu.edu.tw/Module/Index/ip.php',
    encoding: null,
    form: {
        ip1: 140,
        ip2: 112,
        ip3: 29,
        ip4: 132,
        isset: 'ok'
    }
};

request(option)
    .then(buffer => {
        const decoded = iconv.decode(new Buffer(buffer), 'big5');
        const table = table2json.convert(decoded)[1];
        const status = table.length ? '<span style="color:#f00">Down</span>' : '<span style="color:#0f0">Operational</span>';
        return fs.writeFile(config.output_path + '/index.html', '<div style="font-size:28px; margin: 10px auto;width:500px;"><span>CMLab Mail Server Status: </span>' + status + '<div style="font-size: 14px;margin: 20px;">Update: ' + new Date() + '</div></div>');
    })
    .then(() => console.log('Refresh done.'))
    .catch(err => console.error(err));
