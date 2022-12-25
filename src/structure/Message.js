class Message {
  constructor(options = {}, client) {
    this.client = client
    if(client?.advmode) {
      //Maintenance
    } else {
      this.authorId = options?.author || null
      this.channelId = options?.channel || null
      this.id = options?._id || null
      this.content = options?.content || null
    }
  }
}

module.exports = Message
