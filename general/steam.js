const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('steam',{
  subcommandFrom : "profile",
  category : 'Perfil', help : 'Establece el steamID', args : '[steamID]', require : basic.isMember},
  function(msg, args, command){
    // let self = this
    let parsed = basic.parseProfile(args[2],'steam');
    if(!parsed){msg.reply(lang.errorUpdateProfile);return}
    settings.db.child('profiles/'+id).update({steamID : parsed}).then(() => msg.addReaction(settings.emojis.default.accept))
  })
