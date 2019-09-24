const mongoose = require('mongoose');

const client = new mongoose.Schema({
    nom_societe: { type: String},
    logo: {type: String, default: ""},
    telephone: String,
    site_web: String,
    description: { type: String },
    address: { type: String },
    contrats: [{type: mongoose.Schema.Types.ObjectId, ref: 'contrat' }],
    reclamations: [{type: mongoose.Schema.Types.ObjectId, ref: 'reclamation' }]
});

module.exports = mongoose.model('client', client);