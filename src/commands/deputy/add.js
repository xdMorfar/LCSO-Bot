const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Deputy = require('../../models/Deputy');

module.exports = {
 data: new SlashCommandBuilder()
  .setName('deputy-add')
  .setDescription('Add deputy')
  .addUserOption(o => o.setName('user').setRequired(true))
  .addStringOption(o => o.setName('rank').setRequired(true)),

 async execute(interaction) {
  const user = interaction.options.getUser('user');
  const rank = interaction.options.getString('rank');

  await Deputy.create({
   userId: user.id,
   username: user.tag,
   rank,
   joinDate: new Date()
  });

  const embed = new EmbedBuilder()
   .setColor('Green')
   .setTitle('Deputy Added')
   .setDescription(`${user.tag} added as ${rank}`)
   .setTimestamp();

  await interaction.reply({ embeds: [embed] });
 }
};
