const { Permissions, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-ticket')
        .setDescription('Create a ticket'),
    async execute(interaction) {

        await interaction.reply({ content: 'Setting up ticket system...', ephemeral: true });

        const image = "https://cdn.discordapp.com/attachments/1266117564933738536/1267154671655719055/pixelcut-export_11.png?ex=66a7c140&is=66a66fc0&hm=0a1bb0c33ce1bb049f5bee73e6f3fd4f67561d05161b0b40798ff159848ace7d&";

        const embed = new EmbedBuilder()
            .setTitle('SFRC | Server Support')
            .setDescription(`Select the appropriate option from the dropdown menu to open your ticket, and be patient as our support team might be occupied. Submitting troll tickets will lead to a violation. After opening a ticket, you will receive further instructions.`)
            .setColor(0xfd9797)
            .setFooter({
                text: 'Southwest Florida Roleplay Corporation',
                iconURL: 'https://cdn.discordapp.com/icons/1266120578327118039/e52e3b7d82b241b9599d0a31c734abdb.png?size=4096'
            });

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('ticket_select')
            .setPlaceholder('Select an option')
            .addOptions([
                {
                    label: 'Staff Report',
                    description: 'Report a staff member.',
                    value: 'staff_report',
                },
                {
                    label: 'Civilian Report',
                    description: 'Report a civilian.',
                    value: 'civ_report',
                },
                {
                    label: 'General Support',
                    description: 'Get general support.',
                    value: 'general_support',
                },
            ]);

        const row = new ActionRowBuilder()
            .addComponents(selectMenu);

        await interaction.channel.send({ embeds: [embed], components: [row], files: [image] });

        await interaction.editReply({ content: 'Ticket system setup complete!', ephemeral: true });
    },
};
