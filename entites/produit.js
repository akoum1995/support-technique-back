const mongoose = require('mongoose');

const produit = new mongoose.Schema({
    nom_produit: {type: String},
    photo: {type: String, default: ""},
    description: {type: String},
    status: {type: String, enum: ['active', 'supprime'], default:'active'},
    version: {type: String}
});

module.exports = mongoose.model('produit', produit);