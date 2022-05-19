import { Avatar, Content, Universe } from "../../../utils/models";
import clientPromise from "../../../lib/mongoosedb";

// "/api/post-content"
export default async function handler(req, res) {

  const connection = await clientPromise;

  try {

    const universeQuery = Universe.where({ universe: "Forgotten Babies Wizard Orphanage" });
    universeQuery.findOne().then(foundUniverse => {
      const foundAvatar = new Avatar(foundUniverse.avatars.id(req.body.avatar._id));
      const newContent = new Content({
        avatar: foundAvatar,
        img: req.body.content.img,
        title: req.body.content.title,
        body: req.body.content.body,
        engagements: {
          flames: [],
          comments: []
        }
      });
      foundUniverse.contents.push(newContent);
      foundUniverse.save();
    })
    res.send(req.body.content.title + " added by " + req.body.avatar.name);
  } catch (err) {
    handleError(err);
  }
}
