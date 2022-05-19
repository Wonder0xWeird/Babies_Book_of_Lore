import {useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import Layout from "../components/layout";
import ContentHolder from "../components/contentHolder";
import { ActorContext } from "../components/actorContext";
import Loading from "../components/loading";
import Fade from "@mui/material/Fade";
import Link from "next/link";
import styles from "../components/home.module.css";
import clientPromise from "../lib/mongoosedb";
import { Feedback } from "../utils/models";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSolid, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useWindowWidth } from "../utils/hooks";

export default function BabyBookOfLore() {
  const homePageTitle = "Babies Book of Lore";
  const homePageDescriptionShort = "Welcome to the babies book of lore"
  //  All are welcome who know their way from, through, and to...
  const homePageDescriptionLong = homePageDescriptionShort + " The leftmost rune will always pop you up a layer, while the rightmost rune will manage my page descriptions' appearances."
  const homePageImg = "/images/Robert.png";
  const homePageRunes = ["/images/runes/amn_rune.png", "/images/runes/ral_rune.png", "/images/runes/mal_rune.png", "/images/runes/ist_rune.png", "/images/runes/ohm_rune.png"]; // Call to Arms
  const homePageReturn = "/";

  const { currentAddress } = useContext(ActorContext);
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [contents, setContents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { fbwoContract, setActorNfts } = useContext(ActorContext);
  const [babyLoreInput, setBabyLoreInput] = useState("");
  const defaultAvatar = {
    name: "A Chaos Portal Opens...",
    img: "/images/Chaos_Portal.png",
    tokenId: undefined,
    universe: "The Andtheneum"
  }
  const [babySearch, setBabySearch] = useState(defaultAvatar);

  const router = useRouter();

  const width1440 = useWindowWidth(1439);

  async function getAllLore() {
    await axios.get("/api/lore/get-all-lore").then(result => {
      const chronologicalLore = result.data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setContents([...chronologicalLore]);
      setIsLoading(false);
    })
  }
  useEffect(() => {
    getAllLore();
  }, []);

  async function handleBabyLoreInput(e) {
    setBabyLoreInput(e.target.value)
    if (e.target.value !== "") {
      const newBabyURI = await fbwoContract.tokenURI(e.target.value);
      await axios.post("/api/cors", {uri: newBabyURI}).then(response => {
        const iBaby = {
            name: response.data.name,
            img: response.data.image,
            tokenId: e.target.value,
            universe: "Forgotten Babies Wizard Orphanage"
          }
        setBabySearch(iBaby);
      })
    } else {
      setBabySearch(defaultAvatar);
    }
  }

  // Feedback Actions
  function handleFeedback(e) {
    setFeedback(e.target.value)
  }

  // /compendium-content/post-comment/[contentUniverse/contentId] (newComment)
  async function postFeedback() {
    if (confirm("Thank you for your feedack!")) {
      const newFeedback = {
        address: currentAddress,
        feedback: feedback
      }
      await axios.post("/api/post-feedback", newFeedback).then(result => {
        console.log(result.data);
      })
      setFeedback("");
      setShowAddFeedback(false);
    }
  }

  return (
      <Layout pageTitle={homePageTitle} pageDescription={width1440 ? homePageDescriptionShort : homePageDescriptionLong } pageImg={homePageImg} pageRunes={homePageRunes} pageReturn={homePageReturn}>
        <div className={styles.homeContentHolder}>
          <div className={styles.homeContent}>
            <h1>Search for a Baby's Lore</h1>
            <div className={styles.babySearchHolder}>
              <img className={styles.babySearchImg} src={babySearch.img} />
              <div className={styles.babySearchInfo}>
                <h2>{babySearch.name}</h2>
                <h4>{babySearch.universe}</h4>
              </div>
            </div>
            <form className={styles.addBabyForm} onSubmit={(e) => {
              e.preventDefault();
              router.push(`/lore/babies/${babySearch.tokenId}`)
              // setBabyInput("");
            }}>
              <input type="string" min="0" max="9999" maxLength="4" placeholder="Baby tokenId" onChange={handleBabyLoreInput} value={babyLoreInput} className={styles.babyInput}/>
              <button type="submit" className="hover-btn">GO</button>
            </form>
          </div>
          <div className={styles.homeContent}>
            <h1>Write Lore</h1>
            <h3>Connect your wallet, select the baby you would like to write for, and press the button below to proceed.</h3>
            <br />
            <button className="hover-btn" onMouseUp={() => {
              router.push("/lore/WriteLore");
            }}>WRITE</button>
          </div>
        </div>

        {!width1440 && <hr className={styles.horizontal} />}

        <div className={styles.loreSelectHolder}>
          <h1>Recent Lore</h1>
          {isLoading && <Loading />}
          {contents.map((content, index) => (
            <ContentHolder content={content} key={index} />
          ))}
        </div>

        {!width1440 && <hr className={styles.horizontal} />}

        <div className={`${styles.feedbackHolder} ANDtablet`}>
          <Fade in={showAddFeedback} timeout={333}>
            <div id={styles.feedbackHandler} className="ANDtablet">
              <button type="button" className="hover-btn" onClick={() =>{
                setShowAddFeedback(!showAddFeedback);
              }}><FontAwesomeIcon icon={faXmark} style={{ width: "20px", fontSize: 20 }}/></button>
              <div className={styles.feedbackerHolder}>
                <div className={styles.feedbackerInfo}>
                  <h5>{currentAddress}</h5>
                </div>
              </div>
              <form onSubmit={(event)=>event.preventDefault()}>
                <textarea
                  className={styles.feedbackInput}
                  onChange={handleFeedback}
                  value={feedback}
                  spellCheck="true"
                  name="body"
                  placeholder="Type your feedback here.."
                />
                <button type="submit" className="hover-btn float-right" onMouseUp={postFeedback}>Submit</button>
              </form>
            </div>
          </Fade>
          <h3>ANDTHENEUM Feedback Box</h3>
          <button className="hover-btn" onMouseUp={() => setShowAddFeedback(!showAddFeedback)}>Provide Feedback</button>
          <img src="/images/DUR_cropped.png" className={styles.feedbackDUR}/>
        </div>
      </Layout>
    )
}

export async function getServerSideProps(context) {
  try {
    // const { client } = await connectToDatabase();

    const connection = await clientPromise;

    return {
      props: { isConnected: true },
    }
  } catch (err) {
    console.log(err);
    return {
      props: { isConnected: false },
    }
  }
}
