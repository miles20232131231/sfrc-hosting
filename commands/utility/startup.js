const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends a startup embed')
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    async execute(interaction) {
        const reactions = interaction.options.getInteger('reactions');
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('SFRC | Session Startup')
            .setDescription(` <@${interaction.user.id}> started a session! Are you guys ready to start the session? Kindly make sure to check out <#1266277784037101630> for important information before participating.

                For registering a vehicle, /register can be used and /unregister for unregistration. Both of these commands may be run in <#1266385702371856435>.

                The session shall begin once this hits **__${reactions}+__**`)
            .setColor(0xfd9797)  
            .setImage('https://cdn.discordapp.com/attachments/1266117564933738536/1266332815981543464/image.png?ex=66a766d6&is=66a61556&hm=3fbec51de6c6d291b7e70ee70fe8f209e125f53e939b8e77feaff8e2ef7e7fb9&')
            .setFooter({
                text: 'Southwest Florida Roleplay Corporation',
                iconURL: 'https://cdn.discordapp.com/icons/1266120578327118039/e52e3b7d82b241b9599d0a31c734abdb.png?size=4096'
            });

        const message = await interaction.channel.send({
            content: '``@everyone``, <@&1267071031231643658>',
            embeds: [embed]
        });

        await message.react('✅');

        const newEmbed = new EmbedBuilder()
            .setTitle("Session Startup")
            .setDescription(`<@${interaction.user.id}> has started up a session in <#1266382931405045844>`)
            .setColor(0xfd9797)
            .setFooter({
                text: 'Southwest Florida Roleplay Corporation',
                iconURL: 'https://cdn.discordapp.com/icons/1266120578327118039/e52e3b7d82b241b9599d0a31c734abdb.png?size=4096'
            });

        const targetChannel = await interaction.client.channels.fetch('1266844730449203301');
        await targetChannel.send({ embeds: [newEmbed] });

        const filter = (reaction, user) => reaction.emoji.name === '✅';

        const collector = message.createReactionCollector({ filter, time: 86400000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.count} reactions`);
            if (reaction.count >= reactions) {
                const settingUpEmbed = new EmbedBuilder()
                    .setDescription('Setting up!')
                    .setColor(0xfd9797)
                    .setFooter({
                        text: 'Southwest Florida Roleplay Corporation',
                        iconURL: 'https://cdn.discordapp.com/icons/1266120578327118039/e52e3b7d82b241b9599d0a31c734abdb.png?size=4096'
                    });

                interaction.channel.send({ embeds: [settingUpEmbed] });
                collector.stop();
            }
        });

        collector.on('end', collected => {
            console.log(`Collector ended. Total reactions: ${collected.size}`);
        });

        await interaction.reply({ content: `You Have Initiated A Session Successfully.`, ephemeral: true });
    },
};
