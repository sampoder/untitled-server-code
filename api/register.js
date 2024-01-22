import { kv } from "@vercel/kv";
const { uuid } = require("uuidv4");

export default async function handler(req, res){
  const { username } = req.body;
  const token = uuid();
  await kv.set(username, {
    token,
    created: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    location: null,
    friends: [],
    pendingFriends: []
  });
  return res.json({
    username,
    token
  })
}