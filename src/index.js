const { ApolloServer } = require("apollo-server");
const fs = require("fs");
const path = require("path");

let links = [
  {
    id: "link-0",
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
];

let idCount = links.length;
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (_, args) => links.find((val) => val.id === args.id),
  },
  Mutation: {
    post: (_, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url,
      };
      links.push(link);
      return link;
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

// 3
const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf-8"),
  resolvers,
});

server.listen().then(({ url }) => console.log(`Server is running on ${url}`));
