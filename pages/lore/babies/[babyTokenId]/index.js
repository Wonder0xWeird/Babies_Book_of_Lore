import { useState, useEffect, useContext } from "react";
import { ActorContext } from "../../../../components/actorContext";
import { useRouter } from "next/router";
import Layout from "../../../../components/layout";
import Loading from "../../../../components/loading";
import ContentHolder from "../../../../components/contentHolder";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSolid, faXmark } from "@fortawesome/free-solid-svg-icons";
import styles from "../../../../components/content.module.css";
import { kebabToTitle } from "../../../../lib/string-mod";
import Fade from '@mui/material/Fade';
import Link from "next/link";
import axios from "axios";
import moment from "moment";

export async function getServerSideProps(context) {
  return {
    props: {
      babyTokenId: context.query.babyTokenId
    }
  }
}

export default function ABabysLore(props) {
  const CCLoreTitle = "Babies Book of Lore";
  const CCLoreDescription = "Presented herein for your delight and enjoyment is the Lore of "
  const CCLoreImg = "/images/book_of_lore.png";
  const CCLoreRunes = ["/images/runes/ort_rune.png", "/images/runes/sol_rune.png"]; // Lore
  const CCLoreReturn = "/";

  let { actorAvatar, fbwoContract } = useContext(ActorContext);

  const [lore, setLore] = useState([]);
  const [loreWriter, setLoreWriter] = useState({
    name: "A Chaos Portal Opens...",
    img: "/images/Chaos_Portal.png",
    tokenId: undefined,
    universe: "The Andtheneum"
  });
  const [isLoading, setIsLoading] = useState(true);

  async function getLore() {
    try {
      if (props.babyTokenId !== undefined) {
        const loreWriterURI = await fbwoContract.tokenURI(props.babyTokenId);
        await axios.post("/api/cors", {uri: loreWriterURI}).then(response => {
          let iBaby;
          if (response.data.image.substring(0,5) === "https") {
            iBaby = {
              name: response.data.name,
              img: response.data.image,
              tokenId: props.babyTokenId,
              universe: "Forgotten Babies Wizard Orphanage"
            }
          } else {
            iBaby = {
              name: response.data.name,
              img: "https" + response.data.image.substring(4, response.data.image.length),
              tokenId: props.babyTokenId,
              universe: "Forgotten Babies Wizard Orphanage"
            }
          }
          setLoreWriter(iBaby);
          // setLoreWriter({
          //     name: response.data.name,
          //     img: response.data.image,
          //     tokenId: props.babyTokenId,
          //     universe: "Forgotten Babies Wizard Orphanage"
          //   })
        })
        await axios.get("/api/lore/get-one-babys-lore/" + props.babyTokenId).then(foundLore => {
          console.log("foundLore", foundLore.data);
          setLore(foundLore.data);
          // setIsLoading(false);
        })
      }
    } catch (err) {
      console.log("Error in getLore()", err);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    if (fbwoContract) {
      getLore();
    }
  }, [fbwoContract])

  return (
    <Layout pageTitle={CCLoreTitle} pageDescription={CCLoreDescription + `TEST`} pageImg={CCLoreImg} pageRunes={CCLoreRunes} pageReturn={CCLoreReturn}>
      <div className={styles.loreWriterHeader}>
        <h1>Presenting the Lore of:</h1>
        <br />
        {isLoading ? <Loading /> :
        <div className={styles.loreWriterHolder}>
          <img className={styles.loreWriterImg} src={loreWriter.img} />
          <div className={styles.loreWriterInfo}>
            <h2>{loreWriter.name}</h2>
            <h4>{loreWriter.universe}</h4>
          </div>
        </div>
        }

        {!isLoading && lore.length === 0 && loreWriter.name !== "A Chaos Portal Opens..." ? <h1><br/>No Lore for {loreWriter.name} has been recorded yet!</h1> : null}
        {!isLoading && loreWriter.name === "A Chaos Portal Opens..." ? <h1><br/><em>*Crackling noises*</em></h1> : null}
      </div>

      <div className={styles.loreSelectHolder}>
        {isLoading && <Loading />}
        {lore.map((content, index) => (
          <ContentHolder content={content} key={index} />
        ))}

      </div>
    </Layout>
  )
}
