class NotificationCore {
    constructor(){
        // this.isPosted = false;
        // this.lastPostTime = '';

        this.loopCount = 0;

        this.msgQueue = [];
        this.statusQueue = [];

        this.statusMsg = [];
        this.statusMsg['online'] = 'stream online';
        this.statusMsg['offline'] = 'stream offline';

        this.statusQueue.push('unknown');
    }

    setOnlineMsg(msg){
        this.statusMsg['online'] = msg;
    }

    setOfflineMsg(msg){
        this.statusMsg['offline'] = msg;
    }

    start(){
        this._autoPost();
    }
    
    _addStatusQueue(status){
        this.statusQueue.push(status);

        if(this.statusQueue.length > 2){
            this.statusQueue.shift();
        }

        //console.log(this.statusQueue[this.statusQueue.length-1]);     
    }

    sendOnlineMsg(){
        this._addStatusQueue('online');
    }

    sendOfflineMsg(){
        this._addStatusQueue('offline');
    }

    _autoPost(){
        setTimeout(async () => {
            if(this.statusQueue.length > 1){
                try {
                    if(this._needToPost(this.statusQueue)){
                        await this._post(this.statusMsg[this.statusQueue[this.statusQueue.length-1]]);
                    }
                } catch (error) {
                    console.log(error);
                }
            }
            //test
            //if(this.statusQueue.length > 2){
            //    console.log('[Error]Queue is large than 2');
            //}else{
            //    console.log('[QueueLength]:' + this.statusQueue.length);
            //}
            this.loopCount++;

            this._autoPost();
        }, 1000);
    }

    _post(msg){} /* extends 這個 class 然後 override 這個 function */

    _needToPost(statusQueue){
        if(statusQueue[0] !== 'unknown'){
            if(statusQueue[this.statusQueue.length-2] === 'offline' && statusQueue[this.statusQueue.length-1] === 'online'){
                return true;
            }else{
                return false;
            } 
        }else{
            return false;
        }
    }
}

module.exports = NotificationCore;