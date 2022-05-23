import { Avatar, Actor, Universe } from "../../../utils/models";
import clientPromise from "../../../lib/mongoosedb";

// "/api/get-actor"
export default async function handler(req, res) {

  const connection = await clientPromise;

  try {
    const { currentAddress } = req.query;
    const actorQuery = Actor.where({address: currentAddress});
    actorQuery.findOne().then((foundActor) => {
      if (foundActor) {
        if(foundActor.avatars.some(avatar => avatar.name === "A Chaos Portal Opens...")) {
          res.send({
            foundActor: true,
            avatars: foundActor.avatars
          })
        } else {
          foundActor.avatars.push({
            address: currentAddress,
            name: "A Chaos Portal Opens...",
            nickname: "",
            img: "/images/Chaos_Portal.png",
            universe: "ANDTHENEUM"
          })
          foundActor.save();
          res.send({
            foundActor: true,
            avatars: foundActor.avatars
          })
        }
      } else {
        console.log("No actor found");
        const newActor = new Actor({
          address: currentAddress,
          avatars: []
        });
        newActor.avatars.push({
          address: currentAddress,
          name: "A Chaos Portal Opens...",
          nickname: "",
          img: "/images/Chaos_Portal.png",
          universe: "ANDTHENEUM"
        });
        newActor.save();
        res.send({
          foundActor: false,
          avatars: newActor.avatars
        })
      }
    }).catch((err) => {
      console.log(err);
    })
  } catch (err) {
    res.send("Error adding avatar:", err);
    console.log(err);
  }
}
