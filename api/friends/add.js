import { kv } from "@vercel/kv";
const { uuid } = require("uuidv4");

export default async function handler(req, res){
  const { username, token, friend } = req.body;
  let user = await kv.get(username);
  let friendRecord = await kv.get(friend);
  if(token == user.token){
    if(user.pending.includes(friendRecord.username)){
      // we need to add each other to their friends array
      // we need to remove them from the pending
      await kv.set(user.username, {
        ...user,
        pending: user.pending.filter(x => x != friendRecord.username),
        friends: [
          ...user.friends,
          friendRecord.username
        ]
      });
      await kv.set(friendRecord.username, {
        ...user,
        pending: friendRecord.pending.filter(x => x != user.username),
        friends: [
          ...friendRecord.friends,
          user.username
        ]
      });
      return res.json({
        authorized: true,
        pending: false
      })
    }
    else {
      await kv.set(friendRecord.username, {
        ...friendRecord,
        pending: [
          ...friendRecord.pending,
          user.username
        ]
      });
      return res.json({
        authorized: true,
        pending: true
      })
    }
  }
  return res.json({
    authorized: false
  })
  
}