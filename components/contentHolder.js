import { useState, useEffect, useRouter, useContext } from "react";
import styles from "../components/content.module.css";
import Link from "next/link";
import moment from "moment";
var _ = require("lodash");

export default function ContentHolder(props) {

  return (
    <Link
      // href={{pathname: `/lore/babies/${_.kebabCase(props.content.avatar.name)}/${props.content._id}`}}
      href={{pathname: `/lore/babies/${props.content.avatar.tokenId}/${props.content._id}`}}
    >
      <div className={styles.loreSelect}>
        <img src={props.content.img} className={styles.loreSelectImg} />
        <div className={styles.loreSelectTextHolder}>
          <h2>{props.content.title}</h2>
          <h3>{props.content.body.length > 100 ? props.content.body.substring(0, 100) + "..." : props.content.body}</h3>
        </div>
        <div className={styles.contributorHolderMini}>
          <img className={styles.contributorImgMini} src={props.content.avatar.img} />
          <div className={styles.contributorInfoMini}>
            <div className={styles.contributorText}>Contributor:</div>
            <h4 className={styles.contributorInfoTextMini}>{props.content.avatar.name}</h4>
            <h5 className={styles.contributorInfoTextMini}>{props.content.avatar.universe}</h5>
          </div>
        </div>
        <div className={styles.infoHolder}>
          <div className={styles.engagementHolder}>
            <img src="/images/chaos_flame_engagement_bright.png" alt="chaos-flame" className={styles.engagementFlame}/><h3>{props.content.engagements.flames.length}</h3>
          </div>
          <div className={styles.engagementHolder}>
            <img src="/images/chaos_comments_thick_dark.png" alt="chaos-comments" className={styles.engagementComments}/> <h3>{props.content.engagements.comments.length}</h3>
          </div>
        </div>
        <div className={styles.dateHolder}>
          Posted: {moment(props.content.date).fromNow()}
        </div>
      </div>
    </Link>
  )
}
