require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const client = new Client({
 intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers
 ]
});

client.commands = new Collection();

const commandFolders = fs.readdirSync('./src/commands');

for (const folder of commandFolders) {
 const files = fs.readdirSync(`./src/commands/${folder}`).filter(f => f.endsWith('.js'));
 for (const file of files) {
  const command = require(`./commands/${folder}/${file}`);
  client.commands.set(command.data.name, command);
 }
}

client.once('ready', () => {
 console.log(`${client.user.tag} online`);
});

client.on('interactionCreate', async interaction => {
 if (!interaction.isChatInputCommand()) return;
 const command = client.commands.get(interaction.commandName);
 if (!command) return;

 try {
  await command.execute(interaction);
 } catch (err) {
  console.error(err);
  await interaction.reply({
   content: 'An error occurred.',
   ephemeral: true
  });
 }
});

mongoose.connect(process.env.MONGO_URI)
 .then(() => console.log('MongoDB connected'));

client.login(process.env.TOKEN);
