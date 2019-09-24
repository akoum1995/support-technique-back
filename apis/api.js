const routes = require('express').Router();
const utilisateur = require('../entites/utilisateurs');
const client = require('../entites/client');
const contrat = require('../entites/contrat');
const intervention = require('../entites/intervention');
const reclamation = require('../entites/reclamation');
const administrateur = require('../entites/administrateur');
const intervenantLogiciel = require('../entites/intervenantLogiciel');
const intervenantMateriel = require('../entites/intervenantMateriel');
const responsableLogiciel = require('../entites/responsableLogiciel');
const responsableMateriel = require('../entites/responsableMateriel');
const produit = require('../entites/produit');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

routes.get('/allClients', async (req, res) => {
    const clients = await utilisateur.find({role: 'client'}).populate({ path: 'client' }).exec();
    res.send({data: clients});
});
routes.get('/getIdIntervention/:idIntervention', async (req, res) => {
    const interventionClient = await intervention.findById(req.params.idIntervention).exec();
    res.send({data: interventionClient});
});

routes.post('/supprimeClient/:idUtilisateur', async (req, res) => {
    const utilisateurModifie = await utilisateur.findByIdAndUpdate(req.params.idUtilisateur, {$set: {status: 'supprime'}}).catch(err => err);
    res.send({data: utilisateurModifie});
});
routes.post('/reactiveClient/:idUtilisateur', async (req, res) => {
    const utilisateurModifie = await utilisateur.findByIdAndUpdate(req.params.idUtilisateur, {$set: {status: 'active'}}).catch(err => err);
    res.send({data: utilisateurModifie});
});
routes.post('/ajouterClient', async (req, res) => {
    const nouvContrat = await contrat.create(req.body).catch(err => err);
    req.body['contrats'] = [];
    req.body.contrats.push(nouvContrat._id);
    const nouvClient = await client.create(req.body).catch(err => err);
    req.body['client'] = nouvClient._id;
    const motDePasse = req.body.mot_de_passe;
    req.body.mot_de_passe =  bcrypt.hashSync(req.body.mot_de_passe);
    const userResult = await utilisateur.create(req.body).catch(err => err);
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
     let transporter = nodemailer.createTransport({
         service: 'Gmail',
         host: 'smtp.gmail.com',
         port:587,
         secure: false,
         auth: {
             user: "technoProPlateforme@gmail.com", // generated ethereal user
             pass: "technoPro123456789" // generated ethereal password
         }
     });
     const mailOptions = {
        from: '"TechnoPro "<technoProPlateforme@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Ton compte est créé ✔', // Subject line
        html: 'Voici le lien pour vous conntecter à la plateforme\n Email: ' + req.body.email + '\n Mot de passe: ' + motDePasse +' <br> <h1>Lien: </h1> <a href="http://localhost:4200/login" target="_blank">cliquer ici</a>'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
    // send mail with defined transport object
    //  let info = await transporter.sendMail(mailOptions);
    //  console.log(info)
    return res.send({ msg: 'OK'});
});
routes.get('/allProduits', async (req, res) => {
    const produits = await produit.find().exec();
    res.send({data: produits});
});
routes.post('/supprimeProduit/:idProduit', async (req, res) => {
    const produitModifie = await produit.findByIdAndUpdate(req.params.idProduit, {$set: {status: 'supprime'}}).catch(err => err);
    res.send({data: produitModifie});
});
routes.post('/reactiveProduit/:idProduit', async (req, res) => {
    const produitModifie = await produit.findByIdAndUpdate(req.params.idProduit, {$set: {status: 'active'}}).catch(err => err);
    res.send({data: produitModifie});
});
routes.post('/ajoutProduit', async (req, res) => {
    const produitModifie = await produit.create(req.body).catch(err => err);
    res.send({data: produitModifie});
});
routes.post('/modifProduit/:idProduit', async (req, res) => {
    const produitModifie = await produit.findByIdAndUpdate(req.params.idProduit, {$set: req.body}).catch(err => err);
    res.send({data: produitModifie});
});
routes.get('/allPersonnels', async (req, res) => {
    const personnels = await utilisateur.find({$and: [{role: { $ne:'administrateur'}},{role: { $ne:'client'}}]}).populate('responsableLogiciel responsableMateriel intervenantLogiciel intervenantMateriel').exec();
    res.send({data: personnels});
});
routes.post('/supprimePersonnel/:idUtilisateur', async (req, res) => {
    const utilisateurModifie = await utilisateur.findByIdAndUpdate(req.params.idUtilisateur, {$set: {status: 'supprime'}}).catch(err => err);
    res.send({data: utilisateurModifie});
});
routes.post('/reactivePersonnel/:idUtilisateur', async (req, res) => {
    const utilisateurModifie = await utilisateur.findByIdAndUpdate(req.params.idUtilisateur, {$set: {status: 'active'}}).catch(err => err);
    res.send({data: utilisateurModifie});
});
routes.get('/reclamAndcontratsClient/:idClient', async (req, res) => {
    const clientResult = await client.findById(req.params.idClient).populate({path :'contrats', populate: {path: 'produit',model: 'produit' } }).exec();
    res.send({data: clientResult});
});
routes.post('/annuleContrat/:idContrat', async (req, res) => {
    const contratModifie = await contrat.findByIdAndUpdate(req.params.idContrat,{$set: {status: 'annule', periode: '0'}}).catch(err => err);
    res.send({data: contratModifie});
});
routes.post('/ajouterContrat/:idClient', async (req, res) => {
    const contratCreer = await contrat.create(req.body).catch(err => err);
    const clientMofid = await client.findByIdAndUpdate(req.params.idClient, {$push: {contrats: contratCreer._id}}).catch(err => err)
    res.send({data: clientMofid});
});
routes.post('/reactiverContrat/:idContrat', async (req, res) => {
    const contratMofid = await contrat.findByIdAndUpdate(req.params.idContrat, {$set: {status: 'active', periode: req.body.periode}}).catch(err => err)
    res.send({data: contratMofid});
});
routes.post('/ajouterReclamation/:idClient', async (req, res) => {
    const reclamationCreer = await reclamation.create(req.body).catch(err => err);
    const clientMofid = await client.findByIdAndUpdate(req.params.idClient, {$push: {reclamations: reclamationCreer._id}}).catch(err => err)
    res.send({data: clientMofid});
});
routes.get('/reclamClient/:idClient', async (req, res) => {
    const clientResult = await client.findById(req.params.idClient).populate({path :'reclamations', populate: [{path: 'produit',model: 'produit' }, {path:'intervention', model:'intervention'}] }).exec();
    res.send({data: clientResult});
});
routes.get('/allReclamations', async (req, res) => {
    const clientResult = await reclamation.find().populate('client produit intervention').exec();
    res.send({data: clientResult});
});
routes.get('/allRespLogiciel', async (req, res) => {
    const respLogiciels = await responsableLogiciel.find().exec();
    res.send({data: respLogiciels});
});
routes.get('/allRespMateriel', async (req, res) => {
    const respMateriels = await responsableMateriel.find().exec();
    res.send({data: respMateriels});
});
routes.post('/affecterRespLogiciel/:idResponsable/:idReclamation', async (req, res) => {
    const respLogiciels = await responsableLogiciel.findByIdAndUpdate(req.params.idResponsable, {$push: {reclamations: req.params.idReclamation}}).exec();
    res.send({data: respLogiciels});
});
routes.post('/affecterRespMateriel/:idResponsable/:idReclamation', async (req, res) => {
    const respMateriels = await responsableMateriel.findByIdAndUpdate(req.params.idResponsable, {$push: {reclamations: req.params.idReclamation}}).exec();
    res.send({data: respMateriels});
});
routes.get('/allInterLogiciel', async (req, res) => {
    const interLogiciels = await intervenantLogiciel.find().exec();
    res.send({data: interLogiciels});
});
routes.get('/allInterMateriel', async (req, res) => {
    const interMateriels = await intervenantMateriel.find().exec();
    res.send({data: interMateriels});
});
routes.post('/affecterInterLogiciel/:idIntervenant/:idReclamation', async (req, res) => {
    const interLogiciels = await intervenantLogiciel.findByIdAndUpdate(req.params.idIntervenant, {$push: {reclamations: req.params.idReclamation}}).exec();
    const rec = await reclamation.findByIdAndUpdate(req.params.idReclamation, {$set: {statut: 'en cours'}}). exec()
    res.send({data: interLogiciels});
});
routes.post('/affecterInterMateriel/:idIntervenant/:idReclamation', async (req, res) => {
    const interMateriels = await intervenantMateriel.findByIdAndUpdate(req.params.idIntervenant, {$push: {reclamations: req.params.idReclamation}}).exec();
    const rec = await reclamation.findByIdAndUpdate(req.params.idReclamation, {$set: {statut: 'en cours'}}). exec();
    res.send({data: interMateriels});
});
routes.get('/reclamRespLogiciel/:idResponsable', async (req, res) => {
    const respResult = await responsableLogiciel.findById(req.params.idResponsable).populate({path :'reclamations', populate: [{path: 'produit',model: 'produit' }, {path: 'client',model: 'client' }, {path:'intervention', model:'intervention'}] }).exec();
    res.send({data: respResult});
});
routes.get('/reclamRespMateriel/:idResponsable', async (req, res) => {
    const respResult = await responsableMateriel.findById(req.params.idResponsable).populate({path :'reclamations', populate: [{path: 'produit',model: 'produit' }, {path: 'client',model: 'client' }, , {path:'intervention', model:'intervention'}] }).exec();
    res.send({data: respResult});
});
routes.get('/reclamInterLogiciel/:idIntervenant', async (req, res) => {
    const interResult = await intervenantLogiciel.findById(req.params.idIntervenant).populate({path :'reclamations', populate: [{path: 'produit',model: 'produit' }, , {path: 'client',model: 'client' }] }).exec();
    res.send({data: interResult});
});
routes.get('/reclamInterMateriel/:idIntervenant', async (req, res) => {
    const interResult = await intervenantMateriel.findById(req.params.idIntervenant).populate({path :'reclamations', populate: [{path: 'produit',model: 'produit' }, , {path: 'client',model: 'client' }] }).exec();
    res.send({data: interResult});
});
routes.post('/creerPV/:idReclamation', async (req, res) => {
    const interResult = await intervention.create(req.body).catch(err => err);
    const reclam = await reclamation.findByIdAndUpdate(req.params.idReclamation, {$set: {intervention: interResult._id, statut: 'traitée'}}).exec();
    const clientEmail = await utilisateur.findOne({client: reclam.client}).exec();
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
     let transporter = nodemailer.createTransport({
         service: 'Gmail',
         host: 'smtp.gmail.com',
         port:587,
         secure: false,
         auth: {
             user: "technoProPlateforme@gmail.com", // generated ethereal user
             pass: "technoPro123456789" // generated ethereal password
         }
     });
     const mailOptions = {
        from: '"TechnoPro "<technoProPlateforme@gmail.com>', // sender address
        to: clientEmail.email, // list of receivers
        subject: 'Ta réclamation est traitée ✔', // Subject line
        html: '<h1> Ta réclamation a été bien traitée</h1> <br> <p> Veuillez vérifier si tout est bon ou non</p>'
        };
        transporter.sendMail(mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
    res.send({data: reclam});
});
routes.get('/getClientById/:idClient', async (req, res) => {
    const clientResult = await client.findById(req.params.idClient).exec();
    res.send({data: clientResult});
});
routes.get('/getAdministrateurById/:idAdmin', async (req, res) => {
    const adminResult = await administrateur.findById(req.params.idAdmin).exec();
    res.send({data: adminResult});
});
routes.get('/getRespLogicielById/:idResp', async (req, res) => {
    const respResult = await responsableLogiciel.findById(req.params.idResp).exec();
    res.send({data: respResult});
});
routes.get('/getRespMaterielById/:idResp', async (req, res) => {
    const respResult = await responsableMateriel.findById(req.params.idResp).exec();
    res.send({data: respResult});
});
routes.get('/getIntLogicielById/:idInt', async (req, res) => {
    const intResult = await intervenantLogiciel.findById(req.params.idInt).exec();
    res.send({data: intResult});
});
routes.get('/getIntMaterielById/:idInt', async (req, res) => {
    const intResult = await intervenantMateriel.findById(req.params.idInt).exec();
    res.send({data: intResult});
});
routes.post('/changerAdmin/:idAmin', async (req, res) => {
    const adminResult = await administrateur.findByIdAndUpdate(req.params.idAmin, {$set: req.body}).exec();
    res.send({data: adminResult});
});
routes.post('/changerRespLogiciel/:idResp', async (req, res) => {
    const respResult = await responsableLogiciel.findByIdAndUpdate(req.params.idResp, {$set: req.body}).exec();
    res.send({data: respResult});
});
routes.post('/changerRespMateriel/:idResp', async (req, res) => {
    const respResult = await responsableMateriel.findByIdAndUpdate(req.params.idResp, {$set: req.body}).exec();
    res.send({data: respResult});
});
routes.post('/changerIntLogiciel/:idInt', async (req, res) => {
    const intResult = await intervenantLogiciel.findByIdAndUpdate(req.params.idInt, {$set: req.body}).exec();
    res.send({data: intResult});
});
routes.post('/changerIntMateriel/:idInt', async (req, res) => {
    const intResult = await intervenantMateriel.findByIdAndUpdate(req.params.idInt, {$set: req.body}).exec();
    res.send({data: intResult});
});
routes.post('/changerClient/:idClient', async (req, res) => {
    const clientResult = await client.findByIdAndUpdate(req.params.idClient, {$set: req.body}).exec();
    res.send({data: clientResult});
});
routes.post('/ChangerCompte/:idUser', async (req, res) => {
    if( req.body.mot_de_passe) {
        req.body.mot_de_passe = bcrypt.hashSync(req.body.mot_de_passe);
        const userResult = await utilisateur.findByIdAndUpdate(req.params.idUser, {$set: req.body}).exec();
        const newUser = await utilisateur.findById(req.params.idUser).exec();
        res.send({ msg: 'OK', data: { token: jwt.sign({ data: newUser }, 'SuperSecret') } });
    } else {
        const userResult = await utilisateur.findByIdAndUpdate(req.params.idUser, {$set: req.body}).exec();
        const newUser = await utilisateur.findById(req.params.idUser).exec();
        res.send({ msg: 'OK', data: { token: jwt.sign({ data: newUser }, 'SuperSecret') } });
    }
});
routes.get('/getDetailsClient/:idClient', async (req, res) => {
    const clientResult = await client.findById(req.params.idClient).populate({path: 'contrats reclamations',populate: {path: 'produit', model:'produit'}}).exec();
    res.send({data: clientResult});
});
routes.post('/modifierContrat/:idContrat', async (req, res) => {
    const contratResult = await contrat.findByIdAndUpdate(req.params.idContrat, {$set: req.body}).exec();
    res.send({data: contratResult});
});

module.exports = routes;