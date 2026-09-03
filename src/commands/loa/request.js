const { SlashCommandBuilder } = require('discord.js');
const LOA = require('../../models/LOA');

module.exports = {
 data: new SlashCommandBuilder()
 .setName('loa-request')
 .setDescription('Request LOA')
 .addStringOption(o=>o.setName('reason').setRequired(true)),

 async execute(interaction){
  await LOA.create({
   deputyId: interaction.user.id,
   reason: interaction.options.getString('reason')
  });

  await interaction.reply('LOA submitted.');
 }
};
