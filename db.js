const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://admin:admin@cluster0.ka8dm.mongodb.net/fprtecommerce?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));