const express = require('express');
const graphqlHttp = require('express-graphql');
const schema = require('./schema/schema')

const app = express();
app.use('/graphql', graphqlHttp({
    graphiql: true,
    schema
}))
app.listen(9999, () => {
    console.log('Listening on 99999');
})