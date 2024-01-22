import { kv } from "@vercel/kv";
const { uuid } = require("uuidv4");
import "isomorphic-unfetch";

export default async function handler(req, res){
  const { username } = req.body;
  const token = uuid();
  const user = await kv.get(username)
  if(!user){
    await kv.set(username, {
      token,
      created: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      location: null,
      friends: [],
      pending: []
    });
    return res.json({
      username,
      token
    })
  }
  else {
    return res.json({
      error: "ERROR: username taken."
    })
  }
  
}