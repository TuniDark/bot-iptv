const axios = require('axios');

const API = process.env.GOLDEN_API_URL;
const HEADERS = { 'X-API-Key': process.env.GOLDEN_API_KEY };

module.exports = async (message) => {
  try {
    const res = await axios.get(`${API}/v1/account/profile`, { headers: HEADERS });
    const p = res.data.data;

    const embed = {
      color: 0x9b59b6,
      title: '👤 Profil du compte',
      fields: [
        { name: 'Utilisateur', value: `\`${p.username}\``, inline: true },
        { name: 'Rôle', value: `\`${p.role}\``, inline: true },
        { name: '💰 Crédits', value: `\`${p.credit}\``, inline: true },
        { name: 'Créé par', value: `\`${p.created_by || 'N/A'}\``, inline: true },
        { name: 'Dernière connexion', value: `\`${p.last_login || 'N/A'}\``, inline: true },
      ],
      timestamp: new Date()
    };

    message.reply({ embeds: [embed] });
  } catch (err) {
    message.reply(`❌ Erreur : ${err.response?.data?.message || err.message}`);
  }
};