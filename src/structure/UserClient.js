const Base = require("./Base.js")
class UserClient extends Base {
  constructor(options = {}, client) {
    super()
    this.recache = "user"
    this.id = options?._id
    this.username = options?.username
    //this.avatar = options.user.avatar
    //this.banner = options.user.banner
    //this.bot = options.type === "bot" ? true : false;
    this.recache = "user"
  }
  
  /*displayAvatarURL(options = {}) {
    if(!options?.size) options.size = 256
    if(!options?.static) options.static = true
    return ""
  }
  
  displayBannerURL(options = {}) {
    
  }*/
}

module.exports = UserClient
