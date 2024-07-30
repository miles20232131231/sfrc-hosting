const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('early')
        .setDescription('Sends the early access embed.')
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that EA people can join.')
                .setRequired(true)),
    async execute(interaction) {
        const sessionLink = interaction.options.getString('session-link');

        const embed = new EmbedBuilder()
            .setTitle('SFRC | Early Access')
            .setDescription('Early Access is now Live! Nitro Boosters, members of the Emergency Services, and Content Creators can join the session by clicking the button below.\n\nPlease keep in mind that sharing the session link with anyone is strictly forbidden and may lead to penalties. We appreciate your cooperation in keeping our community secure and fair for everyone.')
            .setColor(0xfd9797)
            .setImage('https://cdn.discordapp.com/attachments/1251498624597364739/1267166613942308995/image.png?ex=66a7cc5f&is=66a67adf&hm=6620e1ddc39b7d2ef5e9b79502f43918c111560ec963f29d414a13765b198d29&')
            .setFooter({
                text: 'Southwest Florida Roleplay Corporation',
                iconURL: 'https://cdn.discordapp.com/icons/1266120578327118039/e52e3b7d82b241b9599d0a31c734abdb.png?size=4096'
            });

        const button = new ButtonBuilder()
            .setLabel('Early Access')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('ea');

        const row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.channel.send({ 
            content: '<@&1267014550411022397>, <@&1267166004958466163>, <@&1266381371215974451>', 
            embeds: [embed], 
            components: [row] 
        });

        await interaction.reply({ content: 'Early Access Sent.', ephemeral: true });

        const filter = i => i.customId === 'ea';
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time: 9999999 });

        collector.on('collect', async i => {
            const logChannel = interaction.guild.channels.cache.get('1266844730449203301');
            if (logChannel) {
                await logChannel.send(`Interaction collected from ${i.user.tag} at ${new Date().toISOString()}`);
            }

            if (i.member.roles.cache.has('1267014550411022397') || i.member.roles.cache.has('1266381371215974451') || i.member.roles.cache.has('1266381028096737351')) {
                await i.reply({ content: `**Link:** ${sessionLink}`, ephemeral: true });
            } else {
                await i.reply({ 
                    content: 'You do not have this special role, given early access to some perks and content previews. If you wish to get this role, go to <#1266206193244704846> and follow the instructions. Start to enjoy all the benefits of being a holder of one of the special roles once you get the role!', 
                    ephemeral: true 
                });
            }
        });

        collector.on('end', async collected => {
            const logChannel = interaction.guild.channels.cache.get('1266844730449203301');
            if (logChannel) {
                await logChannel.send(`Collected ${collected.size} interactions.`);
            }
        });

        collector.on('error', async error => {
            const logChannel = interaction.guild.channels.cache.get('1266844730449203301');
            if (logChannel) {
                await logChannel.send(`Collector encountered an error: ${error}`);
            }
            console.error('Collector encountered an error:', error);
        });
    },
};
