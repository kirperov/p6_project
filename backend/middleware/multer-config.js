// import de multer
const multer = require('multer');

// dictionnaire d'extensions à traduire
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

const storage = multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        // génère nom du fichier, élimine les espaces avec split et join
        const name = file.originalname.split(' ').join('_');
        // accès mimetype (ex: image/png) appelé par notre dictionnaire
        const extension = MIME_TYPES[file.mimetype];
        //  génère un nom, ajout d'un time-stamp et extension
        callback(null, name + Date.now() + '.' + extension);
    }
        
});

/* export du middleware multer configuré en passant l'objet storage, 
avec single pour un fichier image unique */
module.exports = multer({storage: storage}).single('image');