
const Instagram = require('instagram-web-api')
module.exports.IntaPost=async (dealText,caption) => {
    const client = new Instagram({ username:"deals_point_official", password:"Ranasoni1@" });
    const nodeHtmlToImage = require('node-html-to-image') 
    nodeHtmlToImage({
    output: './images/deal.jpg',
    html: `<div style="font-size:4vw; background-color:black;min-height:100vh;color:white; display:flex; flex-direction:row; align-items:center;justify-content:center;">
            <p>${dealText}</p>
        </div>`
    })
    .then(async () =>{
    const photo ='./images/deal.jpg';
    await client.login()
    const { media } = await client.uploadPhoto({ photo: photo, caption: 'Best Online Shopping Deals Daily, Check Bio to Join The WhatsApp Group #shoppingdeals #online #shopping #moneysavings', post: 'feed' })
    console.log(`https://www.instagram.com/p/${media.code}/`)
  })
}