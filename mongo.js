const mongoose = require("mongoose");

if (process.argv.length < 5) {
    console.log("Please provide the password as an argument: node mongo.js <password>");
    process.exit(1);
}

const password = process.argv[2];
const nameSend = process.argv[3];
const numberSend = process.argv[4];

const url = `mongodb+srv://fullstack:pass123@cluster0.hjkr2.mongodb.net/phone-app?retryWrites=true&w=majority`;

mongoose.connect(url);

const contactSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

const contact = new Contact({
    name: nameSend,
    number: numberSend,
});

contact.save().then((result) => {
    console.log("Contact Saved!");
    mongoose.connection.close();
});

Contact.find({}).then(result => {
    result.forEach(contact => {
        console.log(contact)
    })
    mongoose.connection.close()
})
