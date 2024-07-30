const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('release')
        .setDescription('Releases the session for everyone to join.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('peacetime-status')
                .setDescription('Current peacetime status.')
                .addChoices(
                    { name: 'Peacetime On', value: 'On' },
                    { name: 'Peacetime Normal', value: 'Normal' },
                    { name: 'Peacetime Off', value: 'Off' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frp-speed')
                .setDescription('FRP speeds.')
                .addChoices(
                    { name: '75', value: '75' },
                    { name: '80', value: '80' },
                    { name: '85 (should not be used frequently)', value: '85' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('drifting-status')
                .setDescription('Current drifting status.')
                .addChoices(
                    { name: 'On', value: 'On' },
                    { name: 'Corners Only', value: 'Corners Only' },
                    { name: 'Off', value: 'Off' }
                )
                .setRequired(true)),
    async execute(interaction) {
        try {
            const sessionLink = interaction.options.getString('session-link');
            const peacetimeStatus = interaction.options.getString('peacetime-status');
            const frpSpeed = interaction.options.getString('frp-speed');
            const driftingStatus = interaction.options.getString('drifting-status');

            const embed = new EmbedBuilder()
                .setTitle('SFRC | Session Release')
                .setDescription(`The session host has distributed the link to all participants. Click the button below to view and join the session. Should you encounter any issues or have questions, our support team is available to assist you promptly.

**__Session Information:__**

Session Host: <@${interaction.user.id}>
Peacetime Status: ${peacetimeStatus}
FRP Speeds: ${frpSpeed} MPH
Drifting Status: ${driftingStatus}

Your participation is valued, and we wish you a smooth and enjoyable experience during the session.`)
                .setColor(0xfd9797)
                .setImage("https://cdn.discordapp.com/attachments/1251498624597364739/1267150436864102522/image.png?ex=66a7bd4e&is=66a66bce&hm=00fc59bbe89327a667665314e6392420cf5f23e609fa23e7e5f7321813370031&")
                .setFooter({
                    text: 'Southwest Florida Roleplay Corporation',
                    iconURL: 'https://cdn.discordapp.com/icons/1266120578327118039/e52e3b7d82b241b9599d0a31c734abdb.png?size=4096'
                });

            const button = new ButtonBuilder()
                .setLabel('Session Link')
                .setStyle(ButtonStyle.Danger)
                .setCustomId('ls');

            const row = new ActionRowBuilder()
                .addComponents(button);

            const newEmbed = new EmbedBuilder()
                .setTitle("Session Release")
                .setDescription(`<@${interaction.user.id}> has released their session in <#1266382931405045844>`)
                .setColor(0xfd9797)
                .setFooter({
                    text: 'Southwest Florida Roleplay Corporation',
                    iconURL: 'https://cdn.discordapp.com/icons/1266120578327118039/e52e3b7d82b241b9599d0a31c734abdb.png?size=4096'
                });

            const logChannel = await interaction.client.channels.fetch('1266844730449203301');
            await logChannel.send({ embeds: [newEmbed] });

            await interaction.channel.send({ content: '`@everyone`, <@&1267071031231643658>', embeds: [embed], components: [row] });

            await interaction.reply({ content: 'You have successfully released the session.', ephemeral: true });

            const filter = i => i.customId === 'ls';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.BUTTON, time: 9999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate();

                    await i.followUp({ content: `**Link:** ${sessionLink}`, ephemeral: true });

                    const logEmbed = new EmbedBuilder()
                        .setTitle(`Session Link Button`)
                        .setDescription(`Button clicked by <@${i.user.id}>. Session link in <#1266382931405045844>`)
                        .setColor(0xfd9797)
                        .setFooter({
                            text: 'Southwest Florida Roleplay Corporation',
                            iconURL: 'https://cdn.discordapp.com/icons/1266120578327118039/e52e3b7d82b241b9599d0a31c734abdb.png?size=4096'
                        });
        
                        
                    await logChannel.send({ embeds: [logEmbed] });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
