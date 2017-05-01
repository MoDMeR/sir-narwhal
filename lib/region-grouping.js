const Discord = require('discord.js');
let cooldown = new Map();

module.exports = exports = function(msg) {
  msg.delete().catch(console.error); // delete any message sent to channel #region-grouping

  const member = msg.member; // guild member author of message
  const author = msg.author; // user author of message
  const user = msg.author.id; // ID of author of message`
  const guild = msg.guild; // guild of message
  const role = msg.content.toUpperCase(); // capitalizes message content
  const regions = ['NA', 'EUW', 'JP', 'LAN', 'EUNE', 'KR', 'LAS', 'RU', 'OCE', 'BR', 'TR']; // create array of all regions
  const lol = guild.channels.get('264282097164746752'); // bot response channel, set to channel #league-of-legends
  const roles = guild.roles; // roles in guild
  const region = guild.roles.find('name', role); // region role
  const cooldownTime = 60000; // cooldown time in milliseconds (1 minute)

  if (!regions.includes(role) || !region || member.roles.exists('name', role)) { // if role isn't a valid region, no region specified, or member already has region role
    return;
  }

  const memberCount = region.members.size + 1; // set memberCount to amount of users with the new region role
  let roleAction = ' joined region '; // default role action is join region

  const old = regions.find(current => member.roles.exists('name', current)); // find the previous region role

  if (old) { // if member had a previous region role (not null)
    roleAction = ' switched to region '; // set role action to switch
    if (cooldown.has(user)) {
      author.send('Sorry ' + author + ', you\'re switching regions too fast! Please wait **' + cooldown.get(user).toString().slice(0, -3) + ' seconds**.');
      return;
    }
    member.removeRole(roles.find('name', old)).catch(console.error); // remove old region role
  }

  const embed = new Discord.RichEmbed() // embed message formatting
    .setAuthor('Region Grouping', guild.iconURL) // set author field to Region Grouping with guild's icon
    .setColor(region.color) // set embed color to new region role color
    .setDescription(author + roleAction + role + '!') // add field with '[user] joined region [region]'
    .addField('Region ' + role + ' now has ' + memberCount + ' members', 'Join a region at <#272250356602503168>!') // add fields for region member count and 'join [region]' message
    .setFooter('Sir Narwhal is a bot written by @synicalsyntax', guild.members.get('274958738354601984').user.avatarURL) // add footer field for bot credits (me)
    .setThumbnail(author.avatarURL) // set thumbnail to author's avatar
    .setTimestamp(); // adds timestamp

  member.addRole(region).catch(console.error).then(() => { // add region role to user
    lol.send({ embed }); // send embed
    cooldown.set(user, cooldownTime); // set user on cooldown
    const countdown = setInterval(() => { // every second, subtract 1 second from cooldown time and update map entry
      let time = cooldown.get(user) - 1000;
      cooldown.delete(user);
      cooldown.set(user, time);
    }, 1000);
    setTimeout(() => { // after 60 seconds, remove user from cooldown list altogether
      cooldown.delete(user);
      clearInterval(countdown);
    }, cooldownTime);
  });
};
