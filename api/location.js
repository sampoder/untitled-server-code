import { kv } from "@vercel/kv";
const { uuid } = require("uuidv4");
import "isomorphic-unfetch";

export default async function handler(req, res){
  const { username, token, location } = req.body;
  let user = await kv.get(username);
  if(token == user.token){
    await kv.set(username, {
      ...user,
      updatedAt: new Date().toISOString(),
      location,
    });
    return res.json({
      authorized: true,
      user: {
        ...user,
        updatedAt: new Date().toISOString(),
        location,
      }
    })
  }
  return res.json({
    authorized: false
  })
  
}