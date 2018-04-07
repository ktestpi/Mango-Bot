const { Command } = require('aghanim')
// const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('doc',{
  category : 'General', help : 'Enlace al **Documento blanco** by **Breo**', args : ''},
  function(msg, args, command){
    let self = this
    msg.reply(this.replace.do('docLink'))
  })
