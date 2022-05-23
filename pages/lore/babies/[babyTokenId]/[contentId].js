import { useState, useEffect, useContext } from "react";
import { ActorContext } from "../../../../components/actorContext";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSolid, faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../../components/content.module.css";
import Fade from '@mui/material/Fade';
import Link from "next/link";
import axios from "axios";
import moment from "moment";

export async function getServerSideProps(context) {
  return {
    props: {
      babyTokenId: context.query.babyTokenId,
      contentId: context.query.contentId
    }
  }
}

export default function CompendiumContribution(props) {
  const CCLoreTitle = "Babies Book of Lore";
  const CCLoreDescription = "Presented herein for your delight and enjoyment is the Lore of "
  const CCLoreImg = "/images/book_of_lore.png";
  const CCLoreRunes = ["/images/runes/ort_rune.png", "/images/runes/sol_rune.png"]; // Lore
  const CCLoreReturn = `/lore/babies/${props.babyTokenId}`;

  let { actorAvatar, currentAddress } = useContext(ActorContext);

  const [content, setContent] = useState({});
  const [contributor, setContributor] = useState({});
  const [flames, setFlames] = useState({
    numFlames: 0,
    flamers: []
  });
  const [flameOn, setFlameOn] = useState(false);
  const [comments, setComments] = useState([]);
  const [showAddComment, setShowAddComment] = useState(false);
  const [comment, setComment] = useState("");

  async function getLore() {
    const contentId = props.contentId;
    await axios.get("/api/lore/get-one-lore-post/" + props.contentId).then(foundContent => {
      console.log("foundContent", foundContent.data);
      setContent(foundContent.data);
      setContributor(foundContent.data.avatar);
      if (foundContent.data.engagements.flames.some(flamer => flamer._id === actorAvatar._id)) {
        setFlameOn(true);
      }
      setFlames({
        numFlames: foundContent.data.engagements.flames.length,
        flamers: [...foundContent.data.engagements.flames]
      });
      setComments([...foundContent.data.engagements.comments]);
    })
  }

  useEffect(() => {
    getLore();
  }, [])

  useEffect(() => {
    if (flames.flamers.some(flamer => flamer._id === actorAvatar._id)) {
      setFlameOn(true);
    } else {
      setFlameOn(false);
    }
  }, [actorAvatar])

  // /compendium-content/handle-flame/[contentUniverse/contentId/flameOn] (actorAvatar)
  async function handleFlame() {
    if (!currentAddress) {
      alert("The ANDTHENEUM requires Actors to connect their wallet in order to engage with its materials.")
      return
    }
    if (!flameOn) {
      setFlames((prevState) => ({
        numFlames: prevState.numFlames + 1,
        flamers: [...prevState.flamers, actorAvatar]
      }))
    } else {
      setFlames((prevState) => ({
        numFlames: prevState.numFlames - 1,
        flamers: [...prevState.flamers].filter(flamer => flamer._id !== actorAvatar._id)
      }))
    }
    const result = await axios.post("/api/lore/handle-flame/" + props.contentId + "/" + flameOn, actorAvatar).then(setFlameOn(!flameOn));
    console.log(result.data);
  }

  // Comment Actions
  function handleComment(e) {
    setComment(e.target.value)
  }

  // /compendium-content/post-comment/[contentUniverse/contentId] (newComment)
  async function postComment() {
    if (actorAvatar.name === "A Chaos Portal Opens...") {
      alert("The ANDTHENEUM does not allow Chaos Portals to comment on its materials. Please step through the portal with an Avatar to make a contribution...");
      return
    }
    if (confirm("The ANDTHENEUM will accept your comment...")) {
      const newComment = {
        avatar: actorAvatar,
        body: comment
      }
      const result = await axios.post("/api/lore/post-comment/" + props.contentId, newComment);
      console.log(result.data);
      setComments(prevComments => [...prevComments, newComment]);
      setComment("");
      setShowAddComment(false);
    }
  }

  return (
    <Layout pageTitle={CCLoreTitle} pageDescription={CCLoreDescription + props.contentId} pageImg={CCLoreImg} pageRunes={CCLoreRunes} pageReturn={CCLoreReturn}>
      <Fade in={showAddComment} timeout={333}>
        <div id={styles.commentHandler} className="ANDtablet">
          <button type="button" className="hover-btn" onClick={() =>{
            setShowAddComment(!showAddComment);
          }}><FontAwesomeIcon icon={faXmark} style={{ width: "20px", fontSize: 20 }}/></button>
          <div className={styles.commentorHolder}>
            <img className={styles.commentorImg} src={actorAvatar.img} />
            <div className={styles.commentorInfo}>
              <h2>{actorAvatar.name}</h2>
              <h4>{actorAvatar.universe}</h4>
            </div>
          </div>
          <form onSubmit={(event)=>event.preventDefault()}>
            <textarea
              className={styles.commentInput}
              onChange={handleComment}
              value={comment}
              spellCheck="true"
              name="body"
              placeholder="Type your comment here.."
            />
            <button type="submit" className="hover-btn float-right" onMouseUp={postComment}>Comment</button>
          </form>
        </div>
      </Fade>
      <div className={`${styles.lorePost} ANDtablet`}>
        <img className={styles.lorePostImg} src={content.img} />
        <div className={styles.lorePostTextHolder}>
          <h1>{content.title}</h1>
          <p>{content.body}</p>
        </div>
        <div className={styles.contributorHolder}>
          <img className={styles.contributorImg} src={contributor.img} />
          <div className={styles.contributorInfo}>
            <div className={styles.contributorText}>Contributor:</div>
            <h2>{contributor.name}</h2>
            <h4>{contributor.universe}</h4>
          </div>
        </div>
        <div className={styles.infoHolder}>
          <div className={`${styles.engagementHolder} hover-btn`} onClick={handleFlame}>
            <img src={flameOn ? "/images/chaos_flame_engagement_bright.png" : "/images/chaos_flame_inactive.png"} alt="chaos-flame" className={styles.engagementFlame}/> <h3>{flames.numFlames}</h3>
          </div>
          <div className={`${styles.engagementHolder} hover-btn`} onMouseUp={() => {
            setShowAddComment(!showAddComment);
          }}>
            <img src="/images/chaos_comments_thick_dark.png" alt="chaos-comments" className={styles.engagementComments}/> <h3>{comments.length}</h3>
          </div>
        </div>
        <div className={styles.dateHolder}>
          Posted: {moment(content.date).fromNow()}
        </div>
        <div>
          <h2>Comments:</h2>
          {comments.map((comment, index) => (
            <div className={styles.commentHolder} key={index}>
              <div className={styles.commentHeader}>
                <img src={comment.avatar.img} className={styles.commentImg} alt={comment.avatar.name} />
                <div>
                  <h2>{comment.avatar.name}</h2>
                  <h4>{comment.avatar.universe}</h4>
                </div>
              </div>
              <p>{comment.body}</p>
              <div className={styles.dateHolder}>
                Posted: {moment(comment.date).fromNow()}
              </div>
            </div>
          ))}
        </div>

        {comments.length > 2 &&
          <div className={styles.infoHolder}>
            <div className={`${styles.engagementHolder} hover-btn`} onClick={handleFlame}>
              <img src={flameOn ? "/images/chaos_flame_engagement_bright.png" : "/images/chaos_flame_inactive.png"} alt="chaos-flame" className={styles.engagementFlame}/> <h3>{flames.numFlames}</h3>
            </div>
            <div className={`${styles.engagementHolder} hover-btn`} onMouseUp={() => {
              setShowAddComment(!showAddComment);
            }}>
              <img src="/images/chaos_comments_thick_dark.png" alt="chaos-comments" className={styles.engagementComments}/> <h3>{comments.length}</h3>
            </div>
          </div>
        }
      </div>
    </Layout>
  )
}

// {flames.flamers.map((flamer, index) => {
//   <div key={index}>
//     <h1>{flamer.name}</h1>
//   </div>
// })}
