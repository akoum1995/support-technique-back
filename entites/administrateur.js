const mongoose = require('mongoose');

const administrateur = new mongoose.Schema({
    prenom: String,
    nom: String,
    telephone: { type: String },
    address: { type: String },
    photo: {type: String, default: ""}
});

module.exports = mongoose.model('administrateur', administrateur);