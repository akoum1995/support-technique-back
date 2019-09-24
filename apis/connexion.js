const routes = require('express').Router();
const utilisateur = require('../entites/utilisateurs');
const client = require('../entites/client');
const administrateur = require('../entites/administrateur');
const intervenantLogiciel = require('../entites/intervenantLogiciel');
const intervenantMateriel = require('../entites/intervenantMateriel');
const responsableLogiciel = require('../entites/responsableLogiciel');
const responsableMateriel = require('../entites/responsableMateriel');
const bcrypt = require('bcrypt-nodejs');
const nodemailer = require('nodemailer');


const jwt = require('jsonwebtoken')


routes.post('/connexion', async (req, res) => {
    const userResult = await utilisateur.findOne({ email: req.body.email }).exec();
    if (!userResult) { return res.send({ msg: 'email incorrecte', data: '' }); }
    if (!bcrypt.compareSync(req.body.mot_de_passe, userResult.mot_de_passe)) { return res.send({ msg: 'mot de passe incorrecte', data: '' }); }
    userResult.password = '';
    userResult.extra = {};
    if (userResult.status !== 'active') { return res.send({ msg: userResult.status, data: '' }); }
    res.send({ msg: 'OK', data: { token: jwt.sign({ data: userResult }, 'SuperSecret') } });
})

routes.post('/creationCompte', async (req, res) => {
    if(req.body.role === 'administrateur') {
        const nouvAdministrateur = await administrateur.create(req.body).catch(err => err);
        req.body['administrateur'] = nouvAdministrateur._id;
        req.body.mot_de_passe =  bcrypt.hashSync(req.body.mot_de_passe);
        const userResult = await utilisateur.create(req.body).catch(err => err);
    }
    if(req.body.role === 'responsable logiciel') {
        const nouvResLogiciel = await responsableLogiciel.create(req.body).catch(err => err);
        req.body['responsableLogiciel'] = nouvResLogiciel._id;
        req.body.mot_de_passe =  bcrypt.hashSync(req.body.mot_de_passe);
        const userResult = await utilisateur.create(req.body).catch(err => err);
    }
    if(req.body.role === 'responsable materiel') {
        const nouvResMateriel = await responsableMateriel.create(req.body).catch(err => err);
        req.body['responsableMateriel'] = nouvResMateriel._id;
        req.body.mot_de_passe =  bcrypt.hashSync(req.body.mot_de_passe);
        const userResult = await utilisateur.create(req.body).catch(err => err);
    }
    if(req.body.role === 'intervenant logiciel') {
        const nouvIntLogiciel = await intervenantLogiciel.create(req.body).catch(err => err);
        req.body['intervenantLogiciel'] = nouvIntLogiciel._id;
        req.body.mot_de_passe =  bcrypt.hashSync(req.body.mot_de_passe);
        const userResult = await utilisateur.create(req.body).catch(err => err);
    }
    if(req.body.role === 'intervenant materiel') {
        const nouvIntMateriel = await intervenantMateriel.create(req.body).catch(err => err);
        req.body['intervenantMateriel'] = nouvIntMateriel._id;
        req.body.mot_de_passe =  bcrypt.hashSync(req.body.mot_de_passe);
        const userResult = await utilisateur.create(req.body).catch(err => err);
    }
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
    return res.send({ msg: 'OK'});
})



module.exports = routes; 