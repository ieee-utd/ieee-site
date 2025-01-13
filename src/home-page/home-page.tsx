//Use cookies for log in

//https://ieeeutd.org/privacy-policy
import WhoWeAre from "../who-we-are/who-we-are";
import WhatWeDo from "what-we-do/what-we-do";
import Sponsors from "./sponsors/sponsors";
import Landing from "./landing/landing";
import Chatbot from "../chatbot/components/chatbot";

function HomePage() {
  return (
    <>
      <Landing />
      <WhoWeAre />
      <WhatWeDo />
      <Sponsors />
      <Chatbot />
    </>
  );
}

export default HomePage;
