import { kv } from "@vercel/kv";
const { uuid } = require("uuidv4");
import "isomorphic-unfetch";

export default async function handler(req, res){
  const { username, token, friend } = req.body;
  let user = await kv.get(username);
  let friendRecord = await kv.get(friend);
  if(token == user.token){
    console.log(user)
    if(user.pending && user.pending.includes(friend)){
      // we need to add each other to their friends array
      // we need to remove them from the pending
      await kv.set(username, {
        ...user,
        pending: user.pending?.filter(x => x != friend),
        friends: [
          ...user.friends,
          friend
        ]
      });
      await kv.set(friend, {
        ...friendRecord,
        pending: friendRecord.pending?.filter(x => x != username),
        friends: [
          ...friendRecord.friends,
          username
        ]
      });
      return res.json({
        authorized: true,
        pending: false
      })
    }
    else {
      console.log(user)
      await kv.set(friend, {
        ...friendRecord,
        pending: [
          ...(friendRecord.pending || []),
          username
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