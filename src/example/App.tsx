import React from "react";
import { Podcast } from "./audioplayers/Podcast";
import { FullstackPlayer } from "./audioplayers/FullstackPlayer";

export const App = () => (
  <section>
    <Podcast />
    <FullstackPlayer />
  </section>
);
