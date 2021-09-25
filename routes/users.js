var express = require('express');
var router = express.Router();
const UserModel = require("../modele/user");
const jwt = require("jsonwebtoken");
const { token } = require('morgan');
var Tokendate;
var motparjour;



/*  ajouter un utilisateur */

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];
  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    // verify-token ne marche pas
    res.sendStatus(403);
  }
}

/**justifier */
router.post('/justify', verifyToken, async (req, res) => {
  res.type("text/plain");


  jwt.verify(req.token, "<ALongStringToBeUsedAsAKeyToEncryptYourJSONWEBTOKEN>", (err) => {

    // Check Authorization
    if (err) {
      res.sendStatus(403);
    }
    else {
    
      
      res.type("text/plain");
      var text = req.body;
      let dateDeJour = new Date().getDay();
      if (!Tokendate) {
        res.sendStatus(403);

      }
      if (dateDeJour !== Tokendate) {
        Tokendate = new Date().getDay();
        motparjour = 0;
      }
      if (motparjour + text.length > 80000) {
        res.status(402).json({ message: '402 Payment Required.' });
      }
      motparjour = motparjour + text.length

      console.log("mot par jours " + motparjour)


      var comp_fix = 79;
      var nvText = "";
      var j;
      text = text.replace(/\s\s+/g, ' ');
      for (var i = 0; i < text.length; i++) {


        nvText += text[i];
        if (i == comp_fix) {

          if (text[i] == ' ' || text[i] == ',') {
            nvText += '\n';
            comp_fix = i + 80;
          }
          else {
            j = 0;
            while (text[i] !== ' ' && text[i] !== '.' && text[i] !== ',') {
              i = i - 1;
              j++;
            }
            nvText = nvText.substr(0, nvText.length - j);
            nvText += '\n';
            comp_fix = i + 80;
          }
        }
      }
      var nouvligne = nvText.split(/\n/);
      for (k = 0; k < nouvligne.length; k++) {

        var ligne = nouvligne[k].trim();
        var cp = 1;
        for (c = 0; c < ligne.length; c++) {

          if ((ligne[c] == " " || ligne[c] == "," || ligne[c] == ".") && ligne.length < 80) {
            ligne = ligne.substr(0, c) + "  " + ligne.substr(c + 1, ligne.length)
            c = c + cp;
          }
          if (c == ligne.length - 1 && ligne.length < 80) {
            c = 0;
            cp++;

          }

        }
        nouvligne[k] = ligne


      }
      res.send(nouvligne.join("\n"));
    }

  })


});


router.post('/token', async (req, res) => {
  const email = req.body.email;
  if (email === "foo@bar.com") {
    jwt.sign({ email },"<ALongStringToBeUsedAsAKeyToEncryptYourJSONWEBTOKEN>", { expiresIn: '24h' }, (err, token) => {
      motparjour = 0;
      Tokendate = new Date().getDay();
      res.json({
        token
      });
    });
  } else {
    res.sendStatus(403);
  }
})

module.exports = router;
