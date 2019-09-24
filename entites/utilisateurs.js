const mongoose = require('mongoose');

const utilisateur = new mongoose.Schema({
    email: { type: String, unique: true, required: true },
    mot_de_passe: { type: String, required: true },
    role: { type: String, required: true, default: 'client', enum: ['client', 'administrateur', 'responsable logiciel', 'intervenant logiciel', 'responsable materiel', 'intervenant materiel'] },
    status: { type: String, default: 'active', enum: ['active', 'supprime'] },
    date_de_creation: { type: Number, default: Date.now() },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'client' },
    administrateur: { type: mongoose.Schema.Types.ObjectId, ref: 'administrateur' },
    responsableLogiciel: { type: mongoose.Schema.Types.ObjectId, ref: 'responsableLogiciel' },
    responsableMateriel: { type: mongoose.Schema.Types.ObjectId, ref: 'responsableMateriel' },
    intervenantLogiciel: { type: mongoose.Schema.Types.ObjectId, ref: 'intervenantLogiciel' },
    intervenantMateriel: { type: mongoose.Schema.Types.ObjectId, ref: 'intervenantMateriel' },
});

module.exports = mongoose.model('utilisateur', utilisateur);