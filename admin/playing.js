const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('playing',{
  subcommandFrom : "admin",
  category : 'Admin', help : 'Invitación de Twitter', args : '', require : basic.guildFEDAdmin},
  function(msg, args, command){
    let self = this
    var name = args.from(1);
    if(name == undefined){return};
    this.db.child('bot').update({playing : name});
    this.editStatus("online", {name : name, type : 0}).then(() => msg.addReaction(this.config.emojis.default.accept));
  })
