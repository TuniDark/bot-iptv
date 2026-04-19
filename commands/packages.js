const axios = require('axios');

const API = process.env.GOLDEN_API_URL;
const HEADERS = { 'X-API-Key': process.env.GOLDEN_API_KEY };

module.exports = async (message) => {
  try {
    const res = await axios.get(`${API}/v1/packages?per_page=20`, { headers: HEADERS });
    const pkgs = res.data.packages.data;

    const list = pkgs.map(p =>
      `\`ID: ${p.id}\` — **${p.package_name}**${p.is_official ? ' ✅' : ''}${p.has_adult ? ' 🔞' : ''}`
    ).join('\n');

    const embed = {
      color: 0x2ecc71,
      title: '📦 Packages disponibles',
      description: list || 'Aucun package trouvé.',
      footer: { text: `Total : ${res.data.packages.total} packages` },
      timestamp: new Date()
    };

    message.reply({ embeds: [embed] });

  } catch (err) {
    console.log('Erreur complète:', err.response?.data || err.message);
    message.reply(`❌ Erreur : ${err.response?.data?.message || err.message}`);
  }
};