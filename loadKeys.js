
const PORT = 'port here'
const HOST = 'host here'
const PWD = 'password'
const DB = 'the DB, normally an INT'


var rds = require("redis");

//client retornado. conexão se for usar ssl, se não, não precisa usar tls.
var cli = rds.createClient(PORT, HOST, { auth_pass: PWD, tls: { servername: HOST } });

var fs = require("fs");


let keys = null;

cli.on('connect', (err, res) => {
	cli.select(DB, () => {
		if (err) throw err;
		console.log('INFO:: DB ', DB, ' selected.')
	})

	cli.KEYS("*", (err, reply) => {
		if (err) throw err;
		keys = reply;
		keys = JSON.stringify(keys);
		fs.writeFile("hmlKeys.json", keys, () => { console.log("Done!") });
		console.log(reply.length);
		cli.quit();
	});
});