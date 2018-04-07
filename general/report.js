const { Command } = require('aghanim')
// const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('report',{
  category : 'General', help : 'Invitación de Twitter', args : ''},
  function(msg, args, command){
    let self = this
    const content = args.from(1);
    const author = this.guilds.find(g => g.id === this.config.guild.id).members.get(msg.author.id) || msg.author;
    const messageToSend = {embed : {author: {name : author.nick ? author.nick : author.username, icon_url : author.avatarURL}, title : lang.MangoCourier, description : content, footer : {text : lang.MangoCourierAutomaticMessage, icon_url : this.user.icon},color : this.config.color}}
    this.createMessage(this.config.guild.text.mensajeria,messageToSend).then((m) => msg.addReaction(this.config.emojis.default.envelopeIncoming));
  })
