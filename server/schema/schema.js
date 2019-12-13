const graphql = require('graphql');
const _ = require('lodash');
let userData = [
    {
        id: '345',
        name: 'Vicky',
        age: '24',
        profession: 'Student'
    }, 
    {
        id: '346',
        name: 'Vignesh',
        age: '24',
        profession: 'Student'
    },
    {
        id: '347',
        name: 'Sona',
        age: '24',
        profession: 'Student'
    }
]

const hobbyData = [
    {
        id: '1',
        title: 'Cricket',
        description: 'Play cricket'
    },
    {
        id: '2',
        title: 'Football',
        description: 'Play cricket'
    },
    {
        id: '3',
        title: 'Hockey',
        description: 'Play cricket'
    },
    {
        id: '4',
        title: 'Cricket',
        description: 'Play cricket'
    }
]

const postData = [
    {
        id: '1',
        comment: 'Cricket'
    },
    {
        id: '2',
        comment: 'Football'
    },
    {
        id: '3',
        comment: 'Hockey'
    }
]

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLInt
} = graphql

// Create Types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This is the test user type',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString}
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'User description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type:GraphQLString}
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString}
    })
})

// Root query : Is tha path that takes our query to the specific type

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    description: 'Description',
    fields: {
        user: {
            type: UserType,
            args: {
                id: {type: GraphQLString}
            },
            resolve(parent, args) {
                // we get and reeturn data from a data source
                return _.find(userData, {
                    id: args.id
                })
            }
        },
        hobby: {
            type: HobbyType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return _.find(hobbyData, {
                    id: args.id
                })
            }
        },
        post: {
            type: PostType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return _.find(postData, {
                    id: args.id
                })
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery
})
