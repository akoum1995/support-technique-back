const mongoose = require('mongoose');

const contrat = new mongoose.Schema({
    produit: {type: mongoose.Schema.Types.ObjectId, ref: 'produit' },
    periode: {type: String},
    date_creation: {type: Number, default: Date.now() },
    status: {type: String, enum: ['active', 'expire', 'annule'], default:'active'},
});

module.exports = mongoose.model('contrat', contrat);