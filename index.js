const venom   = require('venom-bot')
const config  = require('config')
const axios= require('axios')
const fs = require('fs');
const express = require("express");
const app=express();
const port=process.env.PORT || 3000;
app.set('view engine', 'ejs')//Setting the view Engine
app.use(express.static('public'))//creating a relative path to look for static files

venom.create('sessionMarketing', (base64Qr, asciiQR) => {
	// To log the QR in the terminal
	console.log(asciiQR);
	app.get('/',(req,res)=>{
		res.render("./index.ejs");
	})
	app.locals.myVar = asciiQR;
	// To write it somewhere else in a file
	exportQR(base64Qr, 'marketing-qr.png');
  }).then(function start(client) {
	client.sendText(config.get('identifier'), '👋 Hello, bot is running...').then()

	client.onMessage( message => {
		console.log(message.type) //chat | video | image | ptt
		console.log(message.body)
		console.log("From"+message.from)
		console.log(message.to)
		console.log(message.chat.contact.pushname)
		console.log(message.isGroupMsg)

		//Get Own Affiliate Links
		async function replaceAsync(str, regex, asyncFn) {
			const promises = [];
			str.replace(regex, (match, ...args) => {
				const promise = asyncFn(match, ...args);
				promises.push(promise);
			});
			const data = await Promise.all(promises);
			return str.replace(regex, () => data.shift());
		}
		async function myAsyncFn(x) {
			// match is an url for example.
			var promise=await axios.post('https://chat-affiliate.herokuapp.com/message', {
				url: x
			})
			console.log(promise.data)
			return promise.data;
		}
		
		
		  var msgText = message.body;
		  var exp_match = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
		 
		if(message.from=="917404297424-1547970443@g.us") 
			replaceAsync(msgText,exp_match,myAsyncFn).then((msg)=>{
				if (!msg) return;
				client.reply("918219338068-1610595553@g.us", msg, message.id.toString());
				
			})




			//client.forwardMessages("918219338068-1610898702@g.us", [message.id.toString()], true);
	})
})

function exportQR(qrCode, path) {
	qrCode = qrCode.replace('data:image/png;base64,', '');
	const imageBuffer = Buffer.from(qrCode, 'base64');
   
	// Creates 'marketing-qr.png' file
	fs.writeFileSync(path, imageBuffer);
  }
  
app.listen(port,()=>console.log("Listning on port "+port))