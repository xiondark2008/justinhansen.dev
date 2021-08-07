export default class UpdateError {
    constructor(data){
        this.ssCode = data.ssCode
        this.coCode = data.coCode
        this.tid = data.tid
        this.aid = data.aid
        this.sid = data.sid
        this.errorMessage = data.errorMessage
        this.lastOccurredOn = data.lastOccurredOn ? data.lastOccurredOn : new Date()
        this.otherArgs = data.otherArgs
    }
}