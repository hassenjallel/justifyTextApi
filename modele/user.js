const mongoose = require("mongoose");

const USerSchema = mongoose.Schema({

    email: { type: String, required: true },
    mot_de_passe: { type: String, required: true },

});

const User = mongoose.model("user", USerSchema);
module.exports = User;
