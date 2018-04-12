const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('team',{
  category : 'General', help : 'Muestra la información de los equipos registrados', args : '<equipo>'},
  function(msg, args, command){
    return;
    let self = this
    if(!args[1]){return msg.reply({embed : {title : 'Equipos disponibles', description : this.cache.teams.map(team => `\`${team._id}\``).join(', '), footer : {text : `${this.cache.teams.size} equipos registrados`}, color : this.config.color}})}
    const query = args.from(1).toLowerCase()
    const team = this.cache.teams.find(team => team._id.toLowerCase() === query)
    if(!team){return msg.reply({embed : {title : 'Equipos disponibles', description : this.cache.teams.map(team => `\`${team._id}\``).join(', '), footer : {text : `${this.cache.teams.size} equipos registrados`}, color : this.config.color}})}
    team.roster = team.roster.split(',').filter(player => player).map(player => getPlayer(player,this.cache.players))
    team.standins = team.standins.split(',').filter(player => player).map(player => getPlayer(player,this.cache.players))
    let embed = {title : team._id,
      thumbnail : {url : team.logo, height : 40, width : 40},
      fields : [
        {name : 'Roster', value : team.roster.map(player => basic.playerNameLinkDBS(player)).join('\n')}
      ],
      footer : {text : team.division || 'Sin división'},
      color : this.config.color
    }
    if(team.standins.length){
      embed.fields.push({name : 'Standinds', value : team.standins.map(player => basic.playerNameLinkDBS(player)).join('\n')})
    }
    if(team.twitter || team.email){
      embed.fields.push({name : 'Contacto', value : this.replace.do(`${team.twitter ? `<emoji_bot_twitter> ${team.twitter}` : ''}\n${team.email ? `:envelope: ${team.email}` : ''}`)})
    }
    msg.reply({embed})
  })

function getPlayer(id,players){
  return players.find(player => player._id === id) || {_id:'0', name : 'Desconocido', ts : 0, steam: '0'}
}

function moreInfo(team_id){
  return `url` + team_id
}
