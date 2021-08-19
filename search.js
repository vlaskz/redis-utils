
const PORT = 'port here'
const HOST = 'host here'
const PWD = 'password'
const DB = 'the DB, normally an INT'
const prefix = 'used when you want to tag your files'


var rds = require("redis");
var cli = rds.createClient(PORT, HOST, { auth_pass: PWD, tls: { servername: HOST } });
const fs = require("fs");
let keys = null
let count = 0;


//numero de resultados a serem exibidos.
let maxCount = 1000;


//parâmetros a seren pesquisados (pode-se pesquisar por mais de um).
let queries = ["31087315808"]


fs.readFile("hmlKeys.json", "utf-8", (err, data) => {
	if (err) throw err;
	keys = data.replace(/[\[\]"]+/g, '').split(','); //esse regex é para remover os square brackets e as aspas duplas.
//	console.log(keys);
})




cli.on('connect', (err, res) => {
	cli.select(DB, () => {
		if (err) throw err;
		
		console.log('INFO:: DB ', DB, ' selected.');
		console.log(`Searching for ${queries}`);
	})


	for (let key of keys) {
		if(key.includes('canc')){
		console.log(`Key ${key} has been ignored.`)
			continue;
		}
		template = key
		cli.get(template, (err, reply) => {
			if (err) throw err;
			if (count == maxCount) {
				process.exit();
			}

			if(queries.every((val)=>reply.includes(val))){
				count++;
				console.log(
					`\n\n-----------------------------------------------------------`,
					`\nResultado ${count}:`,
					 `chave ${key}\n\n`,
					 reply)
			}
		})
	}

	cli.quit();
});





