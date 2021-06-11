const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context) => context.prisma.link.findMany(),
    link: (_, args) => links.find((val) => val.id === args.id),
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      });
      return newLink;
    },
    updateLink: (_, args) => {
      const toUpdate = links.find((link) => {
        return link.id == args.id;
      });
      toUpdate.url = args.url;
      toUpdate.description = args.description;
    },
    deleteLink: (_, args) => {
      const removed = links.splice(
        links.find((link) => link.id === args.id),
        1
      );
      return removed[0];
    },
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma,
  },
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
