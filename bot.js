var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
const opggScrape = require('opgg-scrape');
// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    
    if (message.substring(0, 1) == '+') {
        var args = message.substring(1).split(' ');
        //console.log(args);
        var cmd = args[0];      
        args = args.splice(1);
        //console.log(args);
        var region = args[0];
        args = args.splice(1,args.length-1);
        //console.log(args);
        var username = args.join(' ');

        switch(cmd) {
            // !ping
            case 'profile':
            opggScrape.getStats(username, {region: region, refresh: false}).then(stats => {
                console.log(stats);
                bot.sendMessage({
                    to: channelID,
                    message: '> This is your account OPGG info:\n' + '```fix\n'+'User : '+
                     stats.name + '\n' + 'Level : '+ stats.level + '\n' + 'Rank : '+ 
                     stats.rank +' '+ stats.rankedLP+ '\n' +'KDA : '+ stats.KDARatio +'\n```'
                });
            });
            break;
            // Just add any case commands if you want to..
         }
     }
});