const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('resetlie',{
  subcommandFrom : 'bot',
  category : 'Owner', help : 'Resetea las puntuaciones de la LIE', args : '', require : basic.isOwner},
  function(msg, args, command){
    this.db.child('profiles').once('value').then((snap) => {
      if(!snap.exists()){return};
      snap = snap.val();
      let profiles = Object.keys(snap).map(pID => {let profile = snap[pID]; profile.discord_id = pID; return profile});
      profiles.forEach(profile => {
        this.db.child(`profiles/${profile.discord_id}/lie`).set({games : 0, wins : 0})
      })
      this.db.child('lie/matches').remove()
      msg.addReaction(this.config.emojis.default.accept)
    })
  })
