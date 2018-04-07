const { Watcher } = require('aghanim')
const util = require('erisjs-utils')

module.exports = new Watcher('','messageReactionAdd',{}, function(msg,emoji,userID){

  if(userID === this.user.id){return}
  emoji.name = emoji.id ? emoji.name + ':' + emoji.id : emoji.name
  msg.channel.getMessage(msg.id).then(m => {
    let msgReactions = Object.keys(m.reactions) || [];
    if(msgReactions.indexOf(this.config.vote.emojis.start) === -1){return};
    m.getReaction(this.config.vote.emojis.start).then((u) => {
      let votemsg = u.find((user) => user.id === this.user.id)
      if(!votemsg){return};
      let admin = util.member.hasRole(m.channel.guild.members.get(userID),this.config.vote.roles);
      // if(msgReactions.indexOf(this.config.vote.emojis.finish) !== -1){m.removeReaction(emoji.name,userID);return}
      if(admin && this.config.vote.emojis.close === emoji.name){return};
      if((msgReactions.indexOf(this.config.vote.emojis.finish) !== -1) || (msgReactions.indexOf(this.config.vote.emojis.close) !== -1 && this.config.vote.emojis.winner.indexOf(emoji.name) === -1)){m.removeReaction(emoji.name,userID);return}
      if(!admin && msgReactions.indexOf(emoji.name) === -1){m.removeReaction(emoji.name,userID);return};
      // if(this.config.vote.emojis.options.indexOf(emoji.name) !== -1){voteOptionsPromise(m,emoji.name).then(option => {if(!option.check){m.removeReaction(emoji.name,userID);return}})}
      if(admin && this.config.vote.emojis.winner.indexOf(emoji.name) !== -1 && (msgReactions.indexOf(this.config.vote.emojis.close) !== -1)){
        m.getReaction(this.config.vote.emojis.options[this.config.vote.emojis.winner.indexOf(emoji.name)]).then((users) => {
          let winners = users.map(u => u.id);
          console.log('WINNERS',winners);
          let self = this
          winners.forEach(function(user){
            if(user === self.user.id){return};
            self.db.child('profiles/'+user).once('value').then((snap) => {
              if(!snap.val()){return};
              snap = snap.val();
              self.db.child('profiles/'+user).update({oracle : snap.oracle + 1})
            })
          })
          m.addReaction(this.config.vote.emojis.finish)
          return;
        })
        return;
      }
      let emojis = [];
      emojis = emojis.concat(this.config.vote.emojis.options);
      emojis.push(this.config.vote.emojis.close);
      emojis.push(this.config.vote.emojis.finish);
      if(emojis.indexOf(emoji.name) === -1){m.removeReaction(emoji.name,userID);return}
      let optionEmojis = this.config.vote.emojis.options.map((e) => e);
      voteCheckChainningVotedUsers(optionEmojis,[],m,emoji,userID,0,function(outputs,emoji,userID,votes){
        if(votes > 1){m.removeReaction(emoji.name,userID)}
      });
    });
  })

})

function voteCheckChainningVotedUsers(inputs,outputs,msg,emoji,userID,votes,fn){
  let input = inputs.shift();
  msg.getReaction(input).then((users) => {
    //console.log(input,users);
    let newUsers = users.filter((user) => outputs.indexOf(user.id) === -1);
    if(users.find((user) => user.id === userID)){ votes ++ };
    if(newUsers.length > 0){outputs = outputs.concat(newUsers.map((user) => user.id))};
    if(inputs.length > 0){voteCheckChainningVotedUsers(inputs,outputs,msg,emoji,userID,votes,fn)}else{fn(outputs,emoji,userID,votes)}
  })
}
