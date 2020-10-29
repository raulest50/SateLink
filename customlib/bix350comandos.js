

const {getBorderCharacters} = require('table');


exports.PORT = 9100; // puerto tcp de la impresora
exports.LF_bytes = [0x0a]; // print and line feed
exports.CR_bytes = [0x0d]; // print and carriage return
exports.ESC_bytes = [0x1b]; // scape character
exports.printmode_bytes = [0x1b, 0x21]; // ESC!n sets print mode n de 0 a 255
exports.printfeed_bytes = [0x1b, 0x64]; // ESC d n print and feed n lines
exports.printfeed8_bytes = [0x1b, 0x64, 0x08]; // ESC d n print and feed 8 lines
exports.partialcut_bytes = [0x1b, 0x69]; // ESC i partial cut 
exports.charsize_bytes = [0x1d, 0x21]; // GS ! n first 4 bits of n sets height, remaining 4 width. size 1-8
exports.printnv00_bytes = [0x1d, 0x28, 0x4c, 0x06, 0x00, 0x30, 0x45, 0x30, 0x30, 0x01, 0x01]; // print stored img 00    .(L..0E00..
exports.printnv01_bytes = [0x1d, 0x28, 0x4c, 0x06, 0x00, 0x30, 0x45, 0x30, 0x31, 0x01, 0x01]; // print stored img 01    .(L..0E01..

exports.setLeftAlign_bytes = [0x1b, 0x61, 0x00];
exports.setCenterAlign_bytes = [0x1b, 0x61, 0x01];
exports.setRightAlign_bytes = [0x1b, 0x61, 0x02];

exports.LF = new Buffer.from(this.LF_bytes).toString('ascii');
exports.CR = new Buffer.from(this.CR_bytes).toString('ascii');
exports.ESC = new Buffer.from(this.ESC_bytes).toString('ascii');
exports.printmode = new Buffer.from(this.printmode_bytes).toString('ascii');
exports.printfeed8 = new Buffer.from(this.printfeed8_bytes).toString('ascii');
exports.printfeed = new Buffer.from(this.printfeed_bytes).toString('ascii');
exports.partialcut = new Buffer.from(this.partialcut_bytes).toString('ascii');
exports.charsize = new Buffer.from(this.charsize_bytes).toString('ascii');
exports.printnv00 = new Buffer.from(this.printnv01_bytes).toString('ascii');
exports.printnv01 = new Buffer.from(this.printnv00_bytes).toString('ascii');

exports.setLeftAlign = new Buffer.from(this.setLeftAlign_bytes).toString('ascii');
exports.setCenterAlign = new Buffer.from(this.setCenterAlign_bytes).toString('ascii');
exports.setRightAlign = new Buffer.from(this.setRightAlign_bytes).toString('ascii');


// getBorderCharacters(`void`)
exports.tbConfig_bottomLine = {
        border: {
            topBody: ``,
            topJoin: ``,
            topLeft: ``,
            topRight: ``,
        
            bottomBody: `─`,
            bottomJoin: ``,
            bottomLeft: ``,
            bottomRight: ``,
        
            bodyLeft: ``,
            bodyRight: ``,
            bodyJoin: ``,
        
            joinBody: ``,
            joinLeft: ``,
            joinRight: ``,
            joinJoin: ``
        },
        singleLine: true,
        columns: {
            0: {
            alignment: 'left',
            width: 8
            },
            1: {
            alignment: 'center',
            width: 7
            },
            2: {
            alignment: 'right',
            width: 19
            }
        }
    };  





    // getBorderCharacters(`void`)
exports.tbConfig = {
    border:getBorderCharacters(`void`),
    singleLine: true,
    columns: {
        0: {
        alignment: 'left',
        width: 8
        },
        1: {
        alignment: 'center',
        width: 7
        },
        2: {
        alignment: 'right',
        width: 19
        }
    }
};  