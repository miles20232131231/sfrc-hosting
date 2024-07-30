const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('By using this command you can register you command here.')
        .addIntegerOption(option =>
            option.setName('year')
                .setDescription('Vehicle Year')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('make')
                .setDescription('Vehicle Make')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('model')
                .setDescription('Vehicle Model')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('color')
                .setDescription('Vehicle Color')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('number-plate')
                .setDescription('Vehicle Number Plate')
                .setRequired(true)),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const year = interaction.options.getInteger('year');
            const make = interaction.options.getString('make');
            const model = interaction.options.getString('model');
            const color = interaction.options.getString('color');
            const numberPlate = interaction.options.getString('number-plate');

            const user = interaction.user.username;

            const embed = new EmbedBuilder()
                .setTitle('Vehicle Registered')
                .setDescription(`<@${interaction.user.id}> has registered their vehicle to the database. The information below is the vehicle information.
                
                **Vehicle Information:**
                
                Owner: <@${interaction.user.id}>
                Year: **${year}**
                Make: **${make}**
                Model: **${model}**
                Color: **${color}**
                Number Plate: **${numberPlate}**`)
                .setColor(0xfd9797);

            const targetChannel = await interaction.client.channels.fetch('1267018997518307440');
            if (targetChannel.isTextBased()) {
                await targetChannel.send({ embeds: [embed] });
            }

            const confirmationEmbed = new EmbedBuilder()
                .setDescription(` A new vehicle has been registered by <@${interaction.user.id}>. Please navigate to <#1267018997518307440> to view the registration details.`)
                .setColor(0xfd9797)
                .setFooter({
                    text: 'Southwest Florida Roleplay Corporation',
                    iconURL: 'https://cdn.discordapp.com/icons/1266120578327118039/e52e3b7d82b241b9599d0a31c734abdb.png?size=4096'
                });

            const confirmationChannel = await interaction.client.channels.fetch('1266844730449203301');
            if (confirmationChannel.isTextBased()) {
                await confirmationChannel.send({ embeds: [confirmationEmbed] });
            }

            await interaction.editReply({ content: 'Vehicle has now been registered successfully. If you would like to view it head over to <#1267018997518307440>', ephemeral: true });
        } catch (error) {
            console.error('Error processing vehicle registration:', error);
            await interaction.editReply({ content: 'There was an error while processing your request.', ephemeral: true });
        }
    },
};
