const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')
const halloffame = require('../containers/halloffame.json');

module.exports = new Command('halloffame',{
  category : 'General', help : 'Invitación de Twitter', args : ''},
  function(msg, args, command){
    let self = this
    if(!halloffame[args[1]]){
      basic.wrongCmd(msg,halloffame,args.until(1));
      return
    }else if(!halloffame[args[1]][args[2]]){
      basic.wrongCmd(msg,halloffame[args[1]],args.until(2));
      return
    }
    const show = halloffame[args[1]][args[2]];
    msg.reply({
      embed : {
        title : show.title, description : show.description,
        thumbnail : {url : show.thumbnail  || '', height : 40, width : 40},
        fields : show.fields,
        footer : { text : show.footer.text, icon_url : show.footer.icon},
        color : this.config.colors[show.color] || this.config.colors.default
      }
    })
  })
