import { Avatar, Universe } from "../../../utils/models";
import clientPromise from "../../../lib/mongoosedb";

// "/api/lore/get-all-lore"
export default async function handler(req, res) {

  const connection = await clientPromise;

  try {

    Universe.findOne({ universe: "Forgotten Babies Wizard Orphanage"}).then(universe => {
      res.send(universe.contents)
    })

  } catch (err) {
    console.log("Error getting lore content:", err);
    res.send({
      message: "Error getting lore content:",
      err: err
    });
  }
}
