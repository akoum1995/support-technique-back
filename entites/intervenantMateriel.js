const mongoose = require('mongoose');

const intervenantMateriel = new mongoose.Schema({
    prenom: String,
    nom: String,
    telephone: { type: String },
    address: { type: String },
    photo: {type: String, default: ""},
    reclamations: [{type: mongoose.Schema.Types.ObjectId, ref: 'reclamation' }]
});

module.exports = mongoose.model('intervenantMateriel', intervenantMateriel);