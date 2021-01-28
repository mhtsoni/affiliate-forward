
const Instagram = require('instagram-web-api')
const nodeHtmlToImage = require('node-html-to-image') 
module.exports.IntaPost=async (dealText,caption) => {
    const client = new Instagram({ username:"deals_point_official", password:"Ranasoni1@",
	browserArgs: ['--no-sandbox','disable-setuid-sandbox'] });
    nodeHtmlToImage({
        output: './images/deal.jpg',
        html: `<div style="font-size:4vw; background-color:black;min-height:100vh;color:white; display:flex; flex-direction:row; align-items:center;justify-content:center;">
                <p>${dealText}</p>
            </div>`
      }).then(async ()=>{
        await client.login()
        client.uploadPhoto({ photo: './images/deal.jpg', caption: 'Best Online Shopping Deals Daily, Check Bio to Join The WhatsApp Group #shoppingdeals #online #shopping #moneysavings', post: 'feed' })
        .then((res)=>{
            console.log(`https://www.instagram.com/p/`+res.media.code);
        })
        .catch((err)=>{
            console.log(err);
        })
      })
}