const graphql = require('graphql');
const _ = require('lodash');
const User = require('../model/user');
const Post = require('../model/post');
const Hobby = require('../model/hobby');

// let userData = [
//     {
//         id: '345',
//         name: 'Vicky',
//         age: '24',
//         profession: 'Student'
//     }, 
//     {
//         id: '346',
//         name: 'Vignesh',
//         age: '24',
//         profession: 'Student'
//     },
//     {
//         id: '347',
//         name: 'Sona',
//         age: '24',
//         profession: 'Student'
//     }
// ]

// const hobbyData = [
//     {
//         id: '1',
//         title: 'Cricket',
//         description: 'Play cricket',
//         userId: '345'
//     },
//     {
//         id: '2',
//         title: 'Football',
//         description: 'Play cricket',
//         userId: '345'
//     },
//     {
//         id: '3',
//         title: 'Hockey',
//         description: 'Play cricket',
//         userId: '346'
//     },
//     {
//         id: '4',
//         title: 'Cricket',
//         description: 'Play cricket',
//         userId: '347'
//     }
// ]

// const postData = [
//     {
//         id: '1',
//         comment: 'Cricket',
//         userId: "345"
//     },
//     {
//         id: '2',
//         comment: 'Football',
//         userId: "345"
//     },
//     {
//         id: '3',
//         comment: 'Hockey',
//         userId: "347"
//     }
// ]

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLID,
    GraphQLSchema,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull
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
                return Post.find({userId: parent.id});
            }
        },
        hobbies: {
            type: GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find({userId: parent.id});
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
        userId: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
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
        userId: {type: GraphQLString},
        user: {
            type: UserType,
            resolve(parent, args) {
                return User.findById(parent.userId);
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
                return User.findById(args.id);
            }
        },
        hobby: {
            type: HobbyType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return Hobby.findById(args.id);
            }
        },
        post: {
            type: PostType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return Post.findById(args.id);
            }
        },
        users: {
            type: GraphQLList(UserType),
            resolve(parent, args) {
                return User.find();     
            }
        },
        hobbies: {
            type: GraphQLList(HobbyType),
            resolve(parent, args) {
                return Hobby.find();
            }
        },
        posts: {
            type: GraphQLList(PostType),
            resolve(parent, args) {
                return Post.find();
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
                // id: {type: GraphQLID}(
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                let user = new User({
                    name: args.name,
                    age: args.age,
                    profession: args.profession
                });
                user.save();
                return user;


            }
        },
        createPost: {
            type: PostType,
            args: {
                // id: GraphQLID,
                comment: {type: new GraphQLNonNull(GraphQLString)},
                userId: {type: GraphQLID}
            },
            resolve(parent, args) {
                const post = new Post({
                    comment: args.comment,
                    userId: args.userId
                });
                post.save();
                return post
            }
        },

        createHobby: {
            type: HobbyType,
            args: {
                // id: {type: GraphQLID},
                title: {type: new GraphQLNonNull(GraphQLString)},
                description: {type: GraphQLString},
                userId: {type: GraphQLID} 
            },
            resolve(parent, args) {
                const hobby = new Hobby({
                    title: args.title,
                    description: args.description,
                    userId: args.userId
                });
                hobby.save();

                return hobby;
            }
        },

        updateUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                profession: {type: GraphQLString}
            },
            resolve(parent, args) {
                return updatedUser = User.findByIdAndUpdate(
                    args.id, {
                    $set: {
                        name: args.name,
                        age: args.age,
                        profession: args.profession
                    }
                    },
                    {
                        new: true
                    }
                );
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)},
                comment: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve(parent, args) {
                return updatedPost = Post.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            comment: args.comment
                        }
                    },
                    {
                        new: true
                    }
                )
            }
        },
        updateHobby: {
            type: HobbyType,
            args: {
                 id: {type: new GraphQLNonNull(GraphQLID)},
                 title: {type: new GraphQLNonNull(GraphQLString)},
                 description: {type: GraphQLString},
            },
            resolve(parent, args) {
                return updateHobby = Hobby.findByIdAndUpdate(
                    args.id,
                    {
                        $set: {
                            title: args.title,
                            description: args.description
                        }
                    },
                    {new: true}
                );
            }
        },
        removeUser: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let removeuser = User.findByIdAndRemove(
                    args.id
                ).exec();
                if(!removeuser){
                    throw new("error")
                }
                return removeuser;
            }
        },
        removePost: {
            type: PostType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let removepost = Post.findByIdAndRemove(
                    args.id
                ).exec();
                if(!removepost){
                    throw new("error")
                }
                return removepost;
            }
        },
        removeHobby: {
            type: HobbyType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parent, args) {
                let removehobby = Hobby.findByIdAndRemove(
                    args.id
                ).exec();
                if(!removehobby){
                    throw new("error")
                }
                return removehobby;
            }
        }
    }
});
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})
