import { Avatar, Content, Comment, Universe } from "../../../../utils/models";
import clientPromise from "../../../../lib/mongoosedb";
import { kebabToTitle } from "../../../../lib/string-mod";

// /api/andtheneum-content/post-comment/[contentId] (actorAvatar)
export default async function handler(req, res) {

  const connection = await clientPromise;

  const { contentId } = req.query;
  const avatar = req.body.avatar;
  const comment = req.body.body;

  try {

    Universe.findOne({ universe: "Forgotten Babies Wizard Orphanage" }).then(foundUniverse => {
      const commentor = new Avatar(avatar);
      const newComment = new Comment({
        avatar: commentor,
        body: comment
      });
      foundUniverse.contents.id(contentId).engagements.comments.push(newComment);
      foundUniverse.save();
      res.send("Comment Added");
    })

  } catch (err) {
    console.log("Error adding comment:", err);
    res.send({
      message: "Error adding comment",
      err: err
    })
  }
}
