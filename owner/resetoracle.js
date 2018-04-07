const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('resetoracle',{
  subcommandFrom : 'bot',
  category : 'Owner', help : 'Resetea en las puntuaciones del Oráculo', args : '', require : basic.isOwner},
  function(msg, args, command){
    this.db.child('profiles').once('value').then((snap) => {
      if(!snap.exists()){return};
      snap = snap.val();
      const profiles = Object.keys(snap).map(pID => {let profile = snap[pID]; profile.discord_id = pID; return profile});
      profiles.forEach(profile => {
        this.db.child('profiles/'+profile.discord_id).update({oracle : 0})
      })
      msg.addReaction(this.config.emojis.default.accept);
    })
  })
