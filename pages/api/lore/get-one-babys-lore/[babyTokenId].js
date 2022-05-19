import { Avatar, Universe } from "../../../../utils/models";
import clientPromise from "../../../../lib/mongoosedb";

// "/api/lore/get-one-babys-lore/[babyTokenId]"
export default async function handler(req, res) {

  const connection = await clientPromise;

  try {
    const { babyTokenId } = req.query;
    Universe.findOne({ universe: "Forgotten Babies Wizard Orphanage" }).then(foundUniverse => {
      const foundContent = foundUniverse.contents.filter(
        content => content.avatar.tokenId == babyTokenId
      );
      res.send(foundContent);
    })
  } catch (err) {
    console.log("Error getting a baby's Lore:", err);
    res.send({
      message: "Error getting a baby's Lore:",
      err: err
    })
  }
}
