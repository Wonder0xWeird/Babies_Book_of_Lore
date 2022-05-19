import { Actor, Avatar, Content, Universe } from "../../../utils/models";
import clientPromise from "../../../lib/mongoosedb";

// /api/remove-avatar/[currentAddress/avatarId]
export default async function handler(req, res) {

  const connection = await clientPromise;

  const [ currentAddress, avatarId ] = req.query.param;

  try {
    Actor.findOne({ address: currentAddress }).then(actor => {
      actor.avatars.id(avatarId).remove();
      actor.save();
    })
    res.send("Avatar removed");

  } catch (err) {
    console.log("Error removing avatar:", err);
    res.send({
      message: "Error removing avatar",
      err: err
    })
  }
}
