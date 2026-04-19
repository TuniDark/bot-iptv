const axios = require('axios');

const API = process.env.GOLDEN_API_URL;
const HEADERS = { 'X-API-Key': process.env.GOLDEN_API_KEY };

module.exports = async (message) => {
  try {
    const res = await axios.get(`${API}/v1/account/templates`, { headers: HEADERS });
    const { global, parent_templates, own } = res.data.data;

    const tous = [...global, ...parent_templates, ...own];
    const list = tous.map(t => `\`ID: ${t.id}\` — **${t.name}**`).join('\n');

    const embed = {
      color: 0xe67e22,
      title: '🎨 Templates disponibles',
      description: list || 'Aucun template trouvé.',
      timestamp: new Date()
    };

    message.reply({ embeds: [embed] });

  } catch (err) {
    message.reply(`❌ Erreur : ${err.response?.data?.message || err.message}`);
  }
};