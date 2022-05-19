import { Avatar, Actor, Universe } from "../../../utils/models";
import clientPromise from "../../../lib/mongoosedb";

// "/api/add-avatar"
export default async function handler(req, res) {

  const connection = await clientPromise;

  try {
    const { currentAddress } = req.query;
    // console.log("req.query", currentAddress);
    const actorQuery = Actor.where({address: currentAddress});
    actorQuery.findOne().then((foundActor) => {
      // console.log(foundActor);
      if (foundActor) {
        // console.log("Found an actor", foundActor);
        res.send({
          foundActor: true,
          avatars: foundActor.avatars
        })
      } else {
        console.log("No actor found");
        const newActor = new Actor({
          address: currentAddress,
          avatars: []
        })
        newActor.save();
        res.send({
          foundActor: false,
          avatars: []
        })
      }
    }).catch((err) => {
      handleError(err);
    })
  } catch (err) {
    res.send("Error adding avatar:", err);
    console.log(err);
  }
}
