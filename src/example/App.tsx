import { scan } from 'react-scan'; // import this BEFORE react

import React from "react";
import { Podcast } from "./audioplayers/Podcast";
import { FullstackPlayer } from "./audioplayers/FullstackPlayer";

if (typeof window !== 'undefined') {
  scan({
    enabled: true,
    log: false, // logs render info to console (default: false)
  });
}

export const App = () => (
  <section>
    {/* <Podcast /> */}
    <FullstackPlayer />
  </section>
);
