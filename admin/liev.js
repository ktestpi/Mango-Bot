const { Command } = require('aghanim')
const basic = require('../helpers/basic')
const util = require('erisjs-utils')
const lang = require('../lang.json')

module.exports = new Command('liev',{
  category : 'Admin', help : 'Invitación de Twitter', args : '<open/close>', require : basic.guildFEDAdmin},
  function(msg, args, command){
    // let self = this
    const roles = util.guild.getRole(this.fed,this.config.roles.federado);
    if(args[1] === 'open'){
      if(!roles){return};
      this.editChannelPermission(this.config.guild.voice.lieWaitRoom, roles[0].id, 1048576, 0, "role", '').then(() => msg.addReaction(this.config.emojis.default.accept))
    }else if(args[1] === 'close'){
      this.editChannelPermission(this.config.guild.voice.lieWaitRoom, roles[0].id, 0, 1048576, "role", '')
      const membersVoiceChannel = this.fed.members.filter(m => this.config.guild.voice.lieWaitRoom === m.voiceState.channelID)
      if(!this.config.switches.kickVoiceChannelLIE){
          for (var i = 0; i < membersVoiceChannel.length; i++) {
          //console.log( membersVoiceChannel[i].voiceState);
          this.editGuildMember(this.config.guild.id, membersVoiceChannel[i].id, {channelID : this.config.guild.voice.taberna},"")
        }
        msg.addReaction(this.config.emojis.default.accept)
      }else{
        if(membersVoiceChannel.length > 0){
          this.createChannel(this.config.guild.id, 'Borra este canal', '2', '').then((channel) => {
            for (var i = 0; i < membersVoiceChannel.length; i++) {
              this.editGuildMember(this.config.guild.id, membersVoiceChannel[i].id, {channelID : channel.id},"")//.then(g => g)
            }
            //bot.deleteChannel(channel.id, '')
            setTimeout(()=>{this.deleteChannel(channel.id, '')},10000)
          })
        }
      }
      msg.addReaction(this.config.emojis.default.accept)
    }

  })
