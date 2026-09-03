const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Deputy = require('../../models/Deputy');

module.exports = {
 data: new SlashCommandBuilder()
  .setName('deputy-view')
  .setDescription('View deputy')
  .addUserOption(o => o.setName('user').setRequired(true)),

 async execute(interaction) {
  const user = interaction.options.getUser('user');
  const deputy = await Deputy.findOne({ userId: user.id });

  if (!deputy) return interaction.reply({ content: 'Not found' });

  const embed = new EmbedBuilder()
  .setTitle('Deputy Record')
  .addFields(
   { name: 'Rank', value: deputy.rank },
   { name: 'Hours', value: String(deputy.activityHours) }
  );

  interaction.reply({ embeds:[embed] });
 }
};
