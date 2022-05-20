import { Feedback } from "../../utils/models";
import clientPromise from "../../lib/mongoosedb";

// "/api/post-feedback"
export default async function handler(req, res) {

  const connection = await clientPromise;

  const { address, feedback } = req.body;

  try {

    const newFeedback = new Feedback({
      address: address,
      feedback: feedback
    });
    newFeedback.save();
    res.send("Feedback saved.")
    
  } catch (err) {
    handleError(err);
  }
}
