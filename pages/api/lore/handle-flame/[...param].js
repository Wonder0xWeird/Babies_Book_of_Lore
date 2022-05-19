import { Avatar, Content, Universe } from "../../../../utils/models";
import clientPromise from "../../../../lib/mongoosedb";
import { kebabToTitle } from "../../../../lib/string-mod";

// /api/andtheneum-content/handle-flame/[contentId/flameOn] (actorAvatar)
export default async function handler(req, res) {

  const connection = await clientPromise;

  const [ contentId, flameOn ] = req.query.param;
  const avatar = req.body;

  try {

    Universe.findOne({ universe: "Forgotten Babies Wizard Orphanage" }).then(foundUniverse => {
      const flamer = new Avatar(avatar);
      if (flameOn === "false") {
        foundUniverse.contents.id(contentId).engagements.flames.push(flamer);
        foundUniverse.save();
        res.send("Flame fanned by " + avatar.name);
      } else {
        foundUniverse.contents.id(contentId).engagements.flames.id(avatar._id).remove();
        foundUniverse.save();
        res.send(avatar.name + " dampened the flame...");
      }
    })

  } catch (err) {
    console.log("Error managing the flame:", err);
    res.send({
      message: "Error managaing the flame",
      err: err
    })
  }
}
