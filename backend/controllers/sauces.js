const Sauce = require('../models/Sauce');
const fs = require('fs');

function deleteImage(objet) {
  const fileName = objet.imageUrl.split('/images/')[1];
  fs.unlinkSync(`images/${fileName}`);
}

exports.createSauce= (req, res, next) => {
  // récupérer les champs dans le corps de la requête
  const sauceObject = JSON.parse(req.body.sauce);
  //delete sauceObject._id;
  // nouvelle instance de Sauce
  const sauce = new Sauce({
    ...sauceObject,
    // résolution de l'URL de l'image
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  // enregistrer l'objet dans la BDD avec une promesse
  sauce.save()
  .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
  .catch(error => res.status(400).json({ error }));
};


exports.modifySauce = (req, res, next) => {
  const sauceObjet = req.file ?
      {
          ...JSON.parse(req.body.sauce),
          imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      } : { ...req.body };
  
  if (req.file) {
      Sauce.findOne({ _id: req.params.id})
        .then((sauce) => deleteImage(sauce))
        .catch((error) => res.status(500).json({ error }));
  }

  Sauce.updateOne(
      { _id: req.params.id },
      { ...sauceObjet, _id: req.params.id }, 
  )
      .then(() => res.status(200).json({ message: 'Objet modify' }))
      .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
  // trouver la sauce
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        res.status(404).json({ error: new Error("Cette sauce n'existe pas !")});
      }
      // identifiant mis dans objet requête utilsé pour le comparer le userId de la sauce
      if (sauce.userId !== req.auth.userId) {
        res.status(400).json({ error: new Error('Requête non autorisée !')});
      }
      return sauce;
    })
    .then(sauce => {
      // récupère le nom de fichier
      const filename = sauce.imageUrl.split('/images/')[1];
      // supprime le fichier puis effectue le callback qui supprime de la BDD
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};


  exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };