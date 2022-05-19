import { useState, useContext, useEffect } from "react";
import { useWindowWidth } from "../utils/hooks";
import Head from "next/head";
import Header from "./header";
import Footer from "./footer";
import Actor from "./actor";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ActorContext } from "./actorContext";

export default function Layout({isVisible, children, isConnected, ...pageProps}) {
  const { currentAddress } = useContext(ActorContext)

  return(
    <div id="layout-holder">
      <Header
        className="container-fluid"
        pageTitle={pageProps.pageTitle}
        pageDescription={pageProps.pageDescription}
        pageImg={pageProps.pageImg}
        pageRunes={pageProps.pageRunes}
        pageReturn={pageProps.pageReturn}
      />
      {children}
      <Footer />
    </div>
  )
}

export async function getServerSideProps(context) {
  try {
    const { client } = await connectToDatabase();

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
