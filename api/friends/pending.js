import { kv } from "@vercel/kv";
const { uuid } = require("uuidv4");
import "isomorphic-unfetch";

export default async function handler(req, res){
  const { username, token } = req.body;
  let user = await kv.get(username);
  if(token == user.token){
    return res.json({
      authorized: true,
      pending: user.pending
    })
  }
  return res.json({
    authorized: false
  })
}