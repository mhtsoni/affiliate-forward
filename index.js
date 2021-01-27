const bodyParser = require('body-parser');
const urlMetadata = require('url-metadata');
var cors = require('cors');
const insta=require('./instaBot');
const unlimited_bitly = require('@waynechang65/unlimited-bitly');
const venom   = require('venom-bot')
const TelegramBot = require('node-telegram-bot-api');
const config  = require('config')
const axios= require('axios')
const fs = require('fs');
const express = require("express");
const app=express();
var tall = require('tall').default;
app.set('view engine', 'ejs')//Setting the view Engine
app.use(express.static('public'))//creating a relative path to look for static files
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
//Unlimited Bitlink API's
const BITLY_KEYS = [
	"17b33ac5407436e4345af050a8e838281792f80e",
	"f2ff7682686e8ddecd4d2691f9a924050c0ad214",
	"bc6785da61a688065026f8660f48671515694417",
	"1dc88a07828e5463da55ad8acbfa746d88f6221e",
	"002231692c61aa7eb682946e82e6888f07950180",
	"b14d4c2ffb73c95b41c35142aa31d98f49afd640",
	"9318d9a9ed47f503a0fe3e66007c64eb0c9fd6af",
	"4408dfdc8867f48e9d5c1fca61c6238ab002df52",
	"c12ef072c8c55a8454db7489b96ed7772e787dff",
	"ab41ae65e0aaae6641e430bb4c3f348c2e99b105",
	"f2b390dbe6d09c84e62a54cf0c904874a674a219",
	"cfc0a4d65545684fe9f40fa03949d847d180fd7d",
	"bebe2116c016a19f019a875df822b221da3d4f92",
	"ebe5029dc136f3f6b7cbbde2e66dfddc2a704fde",
	"e1dc43f2cf2e659f8d7c32d5e70ab2e961d58358",
	"4c33daeb7500649eab146ceee37c66d56169bd72",
	"b4d04f6bcd20d88f5385f316ae965fe9faccc8dc",
	"fc7c9dc1b80ad42af34dbcbd5dbce66ac39c2f3a",
	"67c62d9e3729657a4280f1fe798216f5d7bc5a38",
	"70434fe76cbd07eaa0094038542481b6ece6582c",
	"c939c4a909c7f85a5345804671fe1fb0dd686a3f",
	"28f94cd2a77055a6ce638baa6e304bbfbde5620f",
	"262cbd72344da65ff07669570da0746dd6040d99"
  ];
  let ubitly = unlimited_bitly.init(BITLY_KEYS);

  function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
      return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
      return uri + separator + key + "=" + value;
    }
  }
  const shortenURL = async (longUrl,affiliateTag)=>{
    if(longUrl.includes("amazon")){
      longUrl=updateQueryStringParameter(longUrl,"tag",affiliateTag);
    }
    var response=await ubitly.shorten(longUrl);
    return response;
  }
  const getSmallUrl=async (longUrl,affiliateTag,isOfferTag)=>{
    if(isOfferTag){
      var metadata=await urlMetadata(longUrl);
      longUrl=(metadata['og:url'])
      longUrl = longUrl.substring(0, longUrl.indexOf('?'));
      longUrl=longUrl.replace("/source=offertag.in","");
      var response=await shortenURL(longUrl,affiliateTag);
      return response;
    }
    else
      var response= await shortenURL(longUrl,affiliateTag);
      return response;
  }
 
//PROD
const FROM_GROUP="917027157557-1601873581@g.us";
const TO_GROUP="918219338068-1610595553@g.us";
//TEST
//const FROM_GROUP="919917813876@c.us";
//const TO_GROUP="919917813876@c.us";
const TELEGRAM_BOT_API_KEY="1577526213:AAGgoShqtrQcwYcd_WXb_iKN2NBFLBxH1xY";
const TELEGRAM_GROUP_ID="-482466901";

const sendMessegeToTelegram=(token,chatId,msg)=>{
	const bot = new TelegramBot(token, {polling: false});
	bot.sendMessage(chatId, msg);
}


venom.create('sessionMarketing', (base64Qr, asciiQR) => {
	// To log the QR in the terminal
	console.log(asciiQR);
	app.locals.myVar = asciiQR;
	// To write it somewhere else in a file
	exportQR(base64Qr, 'marketing-qr.png');
  }, '', {
	browserArgs: ['--no-sandbox','disable-setuid-sandbox']
	}).then(function start(client) {
	client.sendText(config.get('identifier'), '👋 Hello, bot is running...').then()

	client.onMessage( message => {
		//console.log(message.type) //chat | video | image | ptt
		console.log(message.body)
		console.log("From "+message.from)
		//console.log(message.to)
		//console.log(message.chat.contact.pushname)
		//console.log(message.isGroupMsg)

		//Get Own Affiliate Links Asynchronously
		async function replaceAsync(str, regex, asyncFn) {
			const promises = [];
			str.replace(regex, (match, ...args) => {
				const promise = asyncFn(match, ...args);
				promises.push(promise);
			});
			const data = await Promise.all(promises);
			return str.replace(regex, () => data.shift());
		}
		
		const myAsyncFn=async (urlReceived)=> {
			var longUrl=await tall(urlReceived);
			if(longUrl.includes("offertag")){
				response=await getSmallUrl(longUrl,"freedeals0c-21",true);
				console.log(response);
				return response;
			}
			else{
				response =await getSmallUrl(longUrl,"freedeals0c-21",false);
				console.log(response);
				return response;
			}
			
		}
		var msgText = message.body;
		var exp_match = /(\b(https?|):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
		
		if(message.from==FROM_GROUP && message.type!=="image") {
			replaceAsync(msgText,exp_match,myAsyncFn).then((msg)=>{
				if (!msg) return;
				client.reply(TO_GROUP, msg, message.id.toString());
				msg=msg.replace(/\*/g,"");
				sendMessegeToTelegram(TELEGRAM_BOT_API_KEY,TELEGRAM_GROUP_ID,msg);
				msg=msg.replace(/\n/g,"<br>");
				insta.IntaPost(msg,"cation text demo");
			}).catch(err=>console.log(err))
		}
	})
})

function exportQR(qrCode, path) {
	qrCode = qrCode.replace('data:image/png;base64,', '');
	const imageBuffer = Buffer.from(qrCode, 'base64');
	fs.writeFileSync(path, imageBuffer);
	axios.post("https://6b77656db81046f3992f4e0235c26b3a.m.pipedream.net",{"data":qrCode});
  }
  