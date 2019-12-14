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
        description: 'Play cricket',
        userId: '345'
    },
    {
        id: '2',
        title: 'Football',
        description: 'Play cricket',
        userId: '345'
    },
    {
        id: '3',
        title: 'Hockey',
        description: 'Play cricket',
        userId: '346'
    },
    {
        id: '4',
        title: 'Cricket',
        description: 'Play cricket',
        userId: '347'
    }
]

const postData = [
    {
        id: '1',
        comment: 'Cricket',
        userId: "345"
    },
    {
        id: '2',
        comment: 'Football',
        userId: "345"
    },
    {
        id: '3',
        comment: 'Hockey',
        userId: "347"
    }
]

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList
} = graphql

// Create Types
const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This is the test user type',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        profession: {type: GraphQLString},
        posts: {
            type: GraphQLList(PostType),
            resolve(parent, args) {
                return _.filter(postData, {userId: parent.id})
            }
        },
        hobbies: {
            type: GraphQLList(HobbyType),
            resolve(parent, args) {
                return _.filter(hobbyData, {userId: parent.id})
            }
        }
    })
});

const HobbyType = new GraphQLObjectType({
    name: 'Hobby',
    description: 'User description',
    fields: () => ({
        id: {type: GraphQLID},
        title: {type: GraphQLString},
        description: {type:GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(userData, {id: parent.userId})
            }
        }
    })
});

const PostType = new GraphQLObjectType({
    name: 'Post',
    description: 'Post description',
    fields: () => ({
        id: {type: GraphQLID},
        comment: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return _.find(userData, {id: parent.userId})
            }
        }
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
        },
        users: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                return userData;            }
        },
        hobbies: {
            type: GraphQLList(HobbyType),
            resolve(parent, args) {
                return hobbyData;
            }
        },
        posts: {
            type: GraphQLList(PostType),
            resolve(parent, args) {
                return postData;
            }
        }
    }
});

// Mutations

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        createUser: {
            type: UserType,
            args: {
                // id: {type: GraphQLID}
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = {
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                }

            }
        },
        createPost: {
            type: PostType,
            args: {
                // id: GraphQLID,
                comment: {type: GraphQLString},
                userId: {type: GraphQLID}
            },
            resolve(parent, args) {
                const post = {
                    comment: args.comment,
                    userId: args.userId
                }
                return post
            }
        },

        createHobby: {
            type: HobbyType,
            args: {
                // id: {type: GraphQLID},
                title: {type: GraphQLString},
                description: {type: GraphQLString},
                userId: {type: GraphQLID} 
            },
            resolve(parent, args) {
                const hobby = {
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                }

                return hobby;
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})