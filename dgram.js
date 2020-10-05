
dgram = require('dgram');
s = dgram.createSocket('udp4');
/*
s.on('message', function(msg, rinfo){
    console.log(msg, rinfo);
    console.log(msg.toString('ascii'));
});
*/
s.bind(2100, (err)=>{
    //s.setBroadcast(true);
    console.log("binded");
    s.on('message', function(msg, rinfo){
        console.log(msg, rinfo);
        console.log(msg.toString('ascii'));
    });
})