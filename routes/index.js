var express = require('express');
var router = express.Router();
var discord = require('discord-bot-webhook');
var yaml = require('js-yaml');
var fs   = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET webhook page. */
router.post('/:hookId/:hookToken/:trueUser', function(req, res, next) {
    discord.hookId = req.params.hookId;
    discord.hookToken = req.params.hookToken;
    var trueUser = req.params.trueUser;

    var issue = res.issue;
    if (res.issue.assignee === null) {
        res.issue.assignee = {name: "nobody"};
    }
    var user = res.user;
    var action = res.issue_event_type_name.split('_')[1];
    var matches = issue.self.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i);
    var domain = matches && matches[1];

    discord.userName = trueUser === 1 ? user.displayName :'JiraWebhook';
    discord.avatarUrl = trueUser === 1 ? user.avatarUrls[Object.keys(user.avatarUrls)[0]] : 'https://seeklogo.com/images/A/atlassian-logo-73142F0575-seeklogo.com.gif';

    try {
        var actionsMessages = yaml.safeLoad(fs.readFileSync('messages_templates.yml', 'utf8'));
    } catch (e) {
        console.log(e);
    }

    if (actionsMessages.action) {
        var actionMessage = actionsMessages.action;
        var regex = /({{)([\\.a-zA-Z0-9]+)(}})/g;
        var message = message.replace(regex, function(match, text, urlId) {
            return eval(urlId);
        });

        discord.sendMessage(message);
    }

    res.render('index', { title: 'Express' });
});

module.exports = router;
