import "../global.css";
import { ActorContextProvider } from "../components/actorContext";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;
import Head from "next/head";

// This default export is required in a new 'pages/_app.js' file.
export default function BabyBookOfLore({Component, pageProps}) {
  return (
    <ActorContextProvider>
      <Head>
        <title>Babies Book of Lore</title>
        <meta name="viewport"
        content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" key="_app"/>
      </Head>
      <Component {...pageProps} />
    </ActorContextProvider>
  )
}
