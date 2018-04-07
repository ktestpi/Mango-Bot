const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('dota',{
  subcommandFrom : "profile",
  category : 'Perfil', help : 'Establece el dotaID', args : '[dotaID]', require : basic.isMember},
  function(msg, args, command){
    // let self = this
    let parsed = basic.parseProfile(args[2],'dota');
    if(!parsed){msg.reply(lang.errorUpdateProfile);return}
    settings.db.child('profiles/'+id).update({dotaID : parsed}).then(() => msg.addReaction(this.config.emojis.default.accept))
  })
