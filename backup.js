const chalk = require('chalk')


const PORT = 'port here'
const HOST = 'host here'
const PWD = 'password'
const DB = 'the DB, normally an INT'
const prefix = 'used when you want to tag your files'


var rds = require("redis");
var cli = rds.createClient(PORT, HOST, { auth_pass: PWD, tls: { servername: HOST } });
const fs = require("fs");
let keys = null
let timestamp = Date.now()
let errors=0;
let errorKeys = [];

fs.readFile(`${prefix}Keys.json`, "utf-8", (err, data) => {
	if (err) throw err;
	keys = data.replace(/[\[\]"]+/g, '').split(','); //esse regex é para remover os square brackets e as aspas duplas.
	//console.log(keys);
})

//conecta ao Redis
cli.on('connect', (err, res) => {
	cli.select(DB, () => {
		if (err) throw err;
		console.log('INFO:: DB ', DB, ' selected.')
	})

	const bar = new cliProgress.SingleBar({},cliProgress.Presets.shades_classic)
	bar.start(100,0)
	let percent = 0;

	let count = 0;
	for (let key of keys) {
		if(key.includes('canc')) {
			errorKeys.push(key.toString())
			errors++;
			continue;
		}

		cli.get(key, (err, reply) => {
			if (err) {
				throw err;
			}

				//console.log(key)
				fs.appendFile(`${prefix}DB${DB}Values${timestamp}Backup.txt`,`${key}  :  `+reply + "\n", () => {
					console.clear();
					percent = ((count/keys.length)*100).toFixed(2);
					
					console.log(
						chalk.green("Backup of "),
						chalk.blueBright(`DB${DB}-${prefix}`),
						chalk.greenBright("in progress."),
						chalk.greenBright("\nKey "),
						chalk.blueBright(`${count}`),
						chalk.greenBright("of"),
						chalk.blueBright(`${keys.length}`),
						chalk.greenBright("keys."),
						chalk.yellowBright(percent),
						chalk.greenBright("% done.")
						)
				});
				count++;
			}
		)}
	
	console.log(`\nThere were ${errors}:\n`,errorKeys)
	cli.quit();
})





