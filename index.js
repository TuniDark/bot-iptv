if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const generer = require('./commands/generer');
const profil = require('./commands/profil');
const packages = require('./commands/packages');
const templates = require('./commands/templates');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('clientReady', () => {
  console.log(`✅ Bot connecté : ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const args = message.content.trim().split(/\s+/);
  const cmd = args[0].toLowerCase();

  // DEBUG
  if (cmd === '!debug') {
    const roles = message.member?.roles.cache.map(r => `${r.name} — ID: ${r.id}`).join('\n');
    return message.reply(`**Tes rôles :**\n${roles}`);
  }

  // Vérification des rôles autorisés
  const ALLOWED_ROLES = [
    process.env.ALLOWED_ROLE_ID,
    process.env.ALLOWED_ROLE_ID_2
  ].filter(Boolean);

  const hasRole = message.member?.roles.cache.some(r => ALLOWED_ROLES.includes(r.id));

  if (['/generer', '/profil', '/packages', '/templates'].includes(cmd) && !hasRole) {
    return message.reply('❌ Tu n\'as pas la permission d\'utiliser cette commande.');
  }

  if (cmd === '/generer') await generer(message, args);
  if (cmd === '/profil') await profil(message);
  if (cmd === '/packages') await packages(message);
  if (cmd === '/templates') await templates(message);
});

client.login(process.env.DISCORD_TOKEN);