const express = require('express');
const graphqlHttp = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require('mongoose');
const cors = require('cors');

mongoose.connect('mongodb+srv://vicky519:vicky1234@graphql-project-lc6ke.mongodb.net/graphql-learning?retryWrites=true&w=majority');
mongoose.connection.once('open', () => {
    console.log('Connected to mongo');
});

const app = express();
app.use(cors());
app.use('/graphql', graphqlHttp({
    graphiql: true,
    schema
}))
app.listen(9999, () => {
    console.log('Listening on 99999');
})