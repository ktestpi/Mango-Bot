const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('player',{
  category : 'General', help : 'Muestra la información de los equipos registrados', args : '<equipo>'},
  function(msg, args, command){
    return;
    let self = this
    if(!args[1]){return msg.reply(':x: Debes espicificar un nombre de búsqueda')}
    const query = args.from(1).toLowerCase()
    const players = this.cache.players.filter(player => player.name.toLowerCase() === query)
    if(!players.length){
      let players_maybe = this.cache.players.filter(player => player.name.toLowerCase().includes(query))
      players_maybe = players_maybe.slice(0,20)
      if(players_maybe.length){
        return msg.reply({embed : {title : 'Quisiste decir:', description : players_maybe.map(player => basic.playerNameLinkDBS(player)).join(', '), color : this.config.color}})
      }else{
        return msg.reply(`:x: No se han encontrado jugadores con \`${query}\``)
      }
    }
    msg.reply({embed : {title : 'Resultados:', description : players.map(player => basic.playerNameLinkDBS(player)).join(', ') + `\n\n${basic.teamManagerLink(this,'Más info')}`, footer: {text : 'Manejador de equipos - Jugadores'}, color : this.config.color}})
  })

function getPlayer(id,players){
  return players.find(player => player._id === id) || {_id:'0', name : 'Desconocido', ts : 0, steam: '0'}
}

function moreInfo(team_id){
  return `url` + team_id
}
