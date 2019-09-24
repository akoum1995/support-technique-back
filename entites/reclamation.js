const mongoose = require('mongoose');

const reclamation = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'client' },
    intervention: { type: mongoose.Schema.Types.ObjectId, ref: 'intervention' },
    produit: {type: mongoose.Schema.Types.ObjectId, ref: 'produit' },
    type_reclamation: {type: String, enum: ['logiciel', 'materiel']},
    sujet:{type: String},
    statut:  {type: String, enum: ['non traitée', 'tratée', 'en cours'], default: 'non traitée'},
    degres:  {type: String, enum: ['faible', 'moyenne', 'forte']},
    description: {type: String}
});

module.exports = mongoose.model('reclamation', reclamation);