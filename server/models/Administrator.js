const mongoose = require("mongoose");

const AdministratorSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: {
        type: String,
        default: 'administrator'
    },
    contactNumber: String,
    position: String,
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

const AdministratorModel = mongoose.model("administrators", AdministratorSchema);

module.exports = AdministratorModel;
