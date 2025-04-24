const { SlashCommandBuilder } = require('discord.js');

let waifuCount = 0;
let waifuLocked = false;

module.exports = {
  category: 'mainCommands',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('waifu')
    .setDescription('Replies with a random image of a waifu!'),

  async execute(interaction) {
    if (waifuLocked) {
      return interaction.reply({ content: 'Wait a moment... fetching too fast!', ephemeral: true });
    }

    waifuLocked = true;
    try {
      const response = await fetch('https://api.waifu.im/search?is_nsfw=false');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();

      const imageUrl = data?.images?.[0]?.url;
      if (imageUrl) {
        await interaction.reply('Here\'s your waifu 💖');
        await interaction.followUp({ files: [imageUrl] });

        waifuCount++;
        if (waifuCount >= 10) {
          waifuCount = 0;
          await interaction.followUp({
            content: '10 Waifus... Yall gotta chill 😤',
            files: ['https://m.media-amazon.com/images/I/51dUKB1914L._UXNaN_FMjpg_QL85_.jpg']
          });
        }
      } else {
        await interaction.reply('No waifu found at the moment 😢');
      }
    } catch (error) {
      console.error('Error fetching waifu:', error);
      await interaction.reply('Something went wrong trying to fetch your waifu 😔');
    } finally {
      waifuLocked = false;
    }
  },
};
