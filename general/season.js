const { Command } = require('aghanim')
// const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('season',{
  category : 'General', help : 'Circuito FED', args : ''},
  function(msg, args, command){
    let self = this
    util.msg.sendImage(this.config.img.season).then(buffer => {
      msg.reply(this.replace.do('seasonLink'),{file : buffer, name : 'calendar.jpg'})
    })
  })
