const ObjectId = require("mongodb").ObjectId;
import { Avatar, Actor, Universe } from "../../utils/models";
import clientPromise from "../../lib/mongoosedb";

// "/api/add-avatar"
export default async function handler(req, res) {

  const connection = await clientPromise;

  try {

    const { address, img, name, tokenId, universe } = req.body;
    const newAvatar = new Avatar({
      address: address,
      img: img,
      name: name,
      tokenId: tokenId,
      nickname: "",
      universe: universe
    });
    res.send(newAvatar);
    const actorQuery = Actor.where({ address: address });
    const universeQuery = Universe.where({universe: universe});
    actorQuery.findOne().then((foundActor) => {
      universeQuery.findOne().then((foundUniverse) => {
        if (foundUniverse) {
          console.log("The ANDTHENEUM knows this Universe.");
          foundUniverse.avatars.push(newAvatar);
          foundUniverse.save();
        } else {
          const newUniverse = new Universe({
            universe: universe,
            avatars: [],
            contents: []
          })
          newUniverse.avatars.push(newAvatar);
          newUniverse.save();
          console.log("New Universe added");
        }
        foundActor.avatars.push(newAvatar);
        foundActor.save();
      }).catch((err) => {
        handleError(err);
      })
    }).catch((err) => {
      handleError(err);
    })
  } catch (err) {
    res.send("Error adding avatar:", err);
    console.log(err);
  }
}
