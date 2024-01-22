import { kv } from "@vercel/kv";
const { uuid } = require("uuidv4");

async function isNearby(friend, location){
  let record = await kv.get(friend);
  return record.location == location
}

export default async function handler(req, res){
  const { username, token } = req.body;
  let user = await kv.get(username);
  if(token == user.token){
    let friends = await values.reduce(async (nearby, friend) => {
      const result = await isNearby(friend);
      if (!result) return nearby;
      return (await nearby).concat(friend);
    }, []);
    return res.json({
      authorized: true,
      friends
    })
  }
  return res.json({
    authorized: false
  })
}