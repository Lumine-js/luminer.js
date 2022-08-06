//========== STRUCTURE DATA
const Constants = require("./../util/constants.js")

const UserClient = require("./../structure/UserClient.js")
const Message = require("./../structure/Message.js")
//========== PACKAGE
const { EventEmitter } = require("node:events")
const axios = require('axios')
const WebSocket = require("ws");

//========= CLASS
class Client extends EventEmitter {
  constructor(options = {}) {
    super()

    this.token = options?.token || null;
  }

  login(token) {
    if (this.token === null) {
      if (!token) throw new Error("Token Tidak Ada")
    }
    this.startWebsocket()
  }

  destroy() {
    return this.ws.destroy()
  }

  startWebsocket() {
    let wssurl = `wss://ws.revolt.chat?version=1&format=json`
 
    this.ws = new WebSocket(wssurl);
    this.ws.onopen = () => {
      this.sendWebsocket("Authenticate", {token: this.token})
      setInterval(function(){
        this.sendWebsocket("Ping", {data:0})
      }.bind(this),12000)
      console.log('Lumine.js Succesfull To Connect Websocket');
    }
    this.ws.onclose = this.ws.onerror = (e) => {
      this.ws = null
      console.log('Reconnect...')
      this.startWebsocket()
    }
    this.ws.onmessage = ({ data }) => {
      let packet = JSON.parse(data)
      console.log(packet)

      switch (packet.type) {
        case "Ready":
          console.log(packet.users[0].bot)
          this.emit("ready", new UserClient(packet.users[0], this))
        break;
        case "Message":
          this.emit("messageCreate", new Message(packet, this))
      }
      
    };
  }

  sendWebsocket(type, data) {
    var lostnest = data || {}
    lostnest.type = type
    this.ws.send(JSON.stringify(lostnest));
  }

  requestAPI(method = "", params = "", data) {
    let object = {
      method: method,
      url: "https://api.revolt.chat" + params,
      headers: {
        "x-session-token": this.token,
        "Accept": "application/json",
        "Content-type": "application/json"
      }
    }
  
    if (data) object.data = data
    console.log(object)
  
    return axios(object).then(x => "").catch(err => {
      console.log(err)
    })
  }
  
  sendMessage(channelId, data) {
    this.requestAPI("POST", Constants.ENDPOINTS.MESSAGE(channelId), data)
  }

}

module.exports = Client
