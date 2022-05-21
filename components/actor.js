import { useState, useEffect, useContext } from "react";
import { ActorContext } from "./actorContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faSolid, faRotate } from "@fortawesome/free-solid-svg-icons";
import Fade from '@mui/material/Fade';
const axios = require("axios");
import styles from "./layout.module.css";
// import { useWindowWidth } from "../utils/hooks";

export default function Actor() {
  const { currentAddress, actorNfts } = useContext(ActorContext);
  const { actorAvatar, setActorAvatar } = useContext(ActorContext);
  const { loadingAvatars } = useContext(ActorContext);

  const { fbwoContract, setActorNfts } = useContext(ActorContext);
  const [babyInput, setBabyInput] = useState("");

  const [showAvatarSelect, setShowAvatarSelect] = useState(false);

  const runes = ["/images/runes/cham_rune.png", "/images/runes/sur_rune.png", "/images/runes/io_rune.png", "/images/runes/lo_rune.png"]; // Pride

  // const width1400 = useWindowWidth(1400);

  // Actions
  async function selectAvatar(avatarIndex) {
    setActorAvatar(actorNfts[avatarIndex]); //, {...actorNfts[avatarIndex], id: result.data.avatarId}
  }

  function handleBabyInput(e) {
    setBabyInput(e.target.value);
  }


  async function addBaby(babyTokenId) {
    // Check if Actor owns requested Baby, if true add-avatar, else alert
    const owner = await fbwoContract.ownerOf(babyTokenId);
    if (owner.toLowerCase() === currentAddress.toLowerCase()) {
      const newBabyURI = await fbwoContract.tokenURI(babyTokenId);
      await axios.post("/api/cors", {uri: newBabyURI}).then(response => {
        // console.log(response.data.image.substring(0,5));
        let iBaby;
        if (response.data.image.substring(0,5) === "https") {
          iBaby = {
            address: currentAddress,
            name: response.data.name,
            img: response.data.image,
            tokenId: babyTokenId,
            universe: "Forgotten Babies Wizard Orphanage"
          }
        } else {
          iBaby = {
            address: currentAddress,
            name: response.data.name,
            img: "https" + response.data.image.substring(4, response.data.image.length),
            tokenId: babyTokenId,
            universe: "Forgotten Babies Wizard Orphanage"
          }
        }
          console.log("iBaby", iBaby.img);
        if (actorNfts.some(avatar => avatar.name === response.data.name && avatar.tokenId.toString() === babyTokenId)) {
          console.log(currentAddress + " already owns " + response.data.name);
          alert("The ANDTHENEUM has already acknolwedged your adoption of " + response.data.name)
        } else {
          axios.post("/api/add-avatar", iBaby).then(response => {
            setActorNfts(prevState => [...prevState, response.data]);
          })
          console.log(response.data.name + " added to " + currentAddress);
          alert("The ANDTHENEUM acknowledges your adoption of " + response.data.name);
        }
      })
    } else {
      alert("The ANDTHENEUM does not acknowledge your adoption of this baby.")
    }

  }

  // Memory leek triggered at 109, may need to clean up Avatar Select in useEffect
  return (
    <>
      <div id={styles.actor}>
        {/* <h3 className={styles.selectAvatarPrompt}>Select your avatar...</h3> */}
        <img className={`${styles.headerImg} ANDtablet`} src={actorAvatar.img} onClick={() => {
          setShowAvatarSelect(!showAvatarSelect);
        }}/>
      </div>

      <Fade in={showAvatarSelect} timeout={333}>
        <div id={styles.avatarSelector} className="ANDtablet">
          <button type="button" className="hover-btn" onClick={() =>{
            setShowAvatarSelect(!showAvatarSelect);
          }}><FontAwesomeIcon icon={faXmark} style={{fontSize: 20 }}/></button>
          <div className={styles.actorAddress}>{currentAddress}</div>
          <div className={styles.avatarProfileHolder}>
            <img className={styles.avatarProfileImg} src={actorAvatar.img} />
            <div className={styles.avatarProfileInfo}>
              <h2>{actorAvatar.name}</h2>
              <h4>{actorAvatar.universe}</h4>
            </div>
          </div>
          <div className={styles.runeWordAvatarSelect}>
            {runes.map((rune, index) =>
              <img src={rune} className={styles.runeImg} key={index}/>
            )}
          </div>
          <div className={styles.avatarSelectHolderWrapper}>
            <div className={styles.avatarSelectHolder}>
              {actorNfts.map((nft, index) =>
                <div className={styles.avatarSelect} key={index} onClick={() => selectAvatar(index)}>
                  <img className={`${styles.avatarSelectImg} ANDtablet`} src={nft.img} />
                  <h3>{nft.name}</h3>
                  <h4 className={styles.avatarSelectUniverse}>{nft.universe}</h4>
                </div>
              )}
              {loadingAvatars && <div className={styles.avatarSelect}>
                <img className={`${styles.avatarSelectImg} ANDtablet`} src="/images/Chaos_Portal.png" />
                <h3>Loading...</h3>
              </div>}
              <div className={styles.avatarSelect}>
                <img className={`${styles.avatarSelectImg} ANDtablet`} src="/images/brown_cow.png" />
                <h3>Invite Forgotten Baby</h3>
                <form className={styles.addBabyForm} onSubmit={(e) => {
                  e.preventDefault();
                  addBaby(babyInput);
                  setBabyInput("");
                }}>
                  <input type="number" min="0" max="9999" placeholder="Baby tokenId" onChange={handleBabyInput} value={babyInput} className={styles.babyInput}/>
                  <button type="submit" className="hover-btn">+</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Fade>
    </>

  )
}
