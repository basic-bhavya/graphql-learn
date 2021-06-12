const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { APP_SECRET, getUserId } = require("../utils");

async function signup(parent, args, context, info) {
  var password;
  password = bcrypt.hashSync(args.password, 10);
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });
  const token = jwt.sign(
    {
      userId: user.id,
    },
    APP_SECRET
  );
  return {
    token,
    user,
  };
}

async function login(parent, args, context, info) {
  const user = await context.prisma.user.findUnique({
    where: {
      email: args.email,
    },
  });

  if (!user) throw new Error("No such User found");

  const valid = bcrypt.compareSync(args.password, user.password);
  if (!valid) throw new Error("Invalid Password");

  const token = jwt.sign(
    {
      userId: user.id,
    },
    APP_SECRET
  );

  return {
    user,
    token,
  };
}

async function post(parent, args, context, info) {
  const { userId } = context;
  console.log(context);
  return await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

module.exports = {
  post,
  login,
  signup,
};
