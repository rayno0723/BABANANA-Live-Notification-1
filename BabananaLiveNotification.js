var http = require('http');
var fs = require('fs');
var path = require('path');
const LangLiveStatus = require('./src/LangLiveStatus.js');
const DiscordWebhook = require('./src/DiscordWebhook.js');
const config = require('./config.json');

try {
    if(config.LangPlayRoomId == "") throw new Error('請輸入LangLive room id');
    if(config.DiscordWebhookLink == "") throw new Error('請輸入Discord Webhook Link');
    if(config.OnlineMsg == "") throw new Error('請輸入開台訊息');
    if(config.OfflineMsg == "") throw new Error('請輸入關台訊息');
} catch (error) {
    console.error(error);
    process.exit();
}

//const lang_play_room_id = '2132991'; //國動台
//const lang_play_room_id = '7777777'; //統神台
const lang_play_room_id = config.LangPlayRoomId;
const discord_webhook_url = config.DiscordWebhookLink;

const lls = new LangLiveStatus(lang_play_room_id);
const dw = new DiscordWebhook(discord_webhook_url);

dw.setOnlineMsg(config.OnlineMsg);
dw.setOfflineMsg(config.OfflineMsg);

dw.start();

console.log(`目前偵測頻道: ${lang_play_room_id}`);

lls.on('status', (status) => {
    console.log(`[Lang API] ${status}`);
    
    if(status === 'online'){
        //在線
        dw.sendOnlineMsg();
    }else if(status === 'offline'){
        //離線
        dw.sendOfflineMsg();
    }else{
        //錯誤
    }
});

lls.start();


http.createServer(function (request, response) {
   if(request.url == '/test'){
       response.writeHead(200,{'Content-Type':'text/html'});
       dw.post_test('Webhook測試');
       response.write('<html><body>已發送測試</body></html>');
       response.end();
   }else if(request.url == '/'){
       response.writeHead(200,{'Content-Type':'text/html'});
       console.log('已重新喚醒');
       response.write('<html><body>已重新喚醒</body></html>');
       response.end();
   }
}).listen(process.env.PORT || 5000)

console.log('Server running at https://banana-live-notification.herokuapp.com');



