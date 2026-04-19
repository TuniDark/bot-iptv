const axios = require('axios');

const API = process.env.GOLDEN_API_URL;
const HEADERS = { 'X-API-Key': process.env.GOLDEN_API_KEY };
const PANEL = process.env.PANEL_URL;

function random(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

module.exports = async (message, args) => {
  const packageId = args[1];

  if (!packageId) {
    return message.reply(
      '📋 **Usage :** `/generer <package_id>`\n' +
      'Exemple : `/generer 30`\n' +
      'Utilisez `/packages` pour voir les IDs disponibles.'
    );
  }

  // Vérification du package autorisé
  if (parseInt(packageId) !== 30) {
    return message.reply('❌ Seul le package **24 Hours** (ID: 30) est autorisé !');
  }

  const username = random(7);
  const password = random(7);

  try {
    const res = await axios.post(
      `${API}/v1/lines`,
      {
        package_id: 30,
        template_id: 2083,
        username: username,
        password: password,
        max_connections: 1,
        is_adult: false,
        notes: `Créé via Discord par ${message.author.tag}`
      },
      { headers: HEADERS }
    );

    const { data, package: pkg } = res.data;
    const line = Array.isArray(data) ? data[0] : data;

    const m3uLink = `${PANEL}/get.php?username=${line.username}&password=${line.password}&type=m3u_plus`;
    const expDate = new Date(line.exp_date).toLocaleDateString('fr-FR');

    const embed = {
      color: 0x00b4d8,
      title: '🎬 Ligne IPTV Générée !',
      fields: [
        { name: '🌐 Serveur', value: `\`${PANEL}\``, inline: false },
        { name: '👤 Utilisateur', value: `\`${line.username}\``, inline: true },
        { name: '🔑 Mot de passe', value: `\`${line.password}\``, inline: true },
        { name: '📦 Package', value: `\`${pkg.name}\``, inline: true },
        { name: '📅 Expiration', value: `\`${expDate}\``, inline: true },
        { name: '🔗 Connexions max', value: `\`${line.max_connections}\``, inline: true },
        { name: '📺 Lien M3U', value: `\`${m3uLink}\`` },
      ],
      footer: { text: `Créé par ${message.author.tag}` },
      timestamp: new Date()
    };

    try {
      await message.author.send({ embeds: [embed] });
      await message.reply('✅ Ligne créée ! Les détails ont été envoyés en **DM** 📩');
    } catch {
      await message.reply({ content: '✅ Ligne créée :', embeds: [embed] });
    }

  } catch (err) {
    console.log('Erreur complète:', err.response?.data || err.message);
    const msg = err.response?.data?.message || err.message;
    message.reply(`❌ Erreur : ${msg}`);
  }
};