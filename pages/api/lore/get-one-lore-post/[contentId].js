import { Avatar, Universe } from "../../../../utils/models";
import clientPromise from "../../../../lib/mongoosedb";
import { kebabToTitle } from "../../../../lib/string-mod";

// "/api/andtheneum-content/get-lore-contents/[avatarId]"
export default async function handler(req, res) {

  const connection = await clientPromise;

  try {
    const { contentId } = req.query;
    console.log(contentId);
    Universe.findOne({ universe: "Forgotten Babies Wizard Orphanage" }).then(foundUniverse => {
      const foundContent = foundUniverse.contents.id(contentId);
      res.send(foundContent);
    })

  } catch (err) {
    console.log("Error getting lore contribution:", err);
    res.send({
      message: "Error getting lore contribution:",
      err: err
    })
  }
}
