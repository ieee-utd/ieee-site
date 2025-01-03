//Use cookies for log in

//https://ieeeutd.org/privacy-policy
import TutoringCalendar from "./tutoring-calendar/tutoring-calendar";
import WhoWeAre from "../who-we-are/who-we-are";
import Sponsors from "./sponsors/sponsors";
import Landing from "./landing/landing";
import Chatbot from "../chatbot/components/chatbot";

function HomePage() {
  return (
    <>
      <Landing />
      <Sponsors />
      <WhoWeAre />
      <TutoringCalendar />
      <Chatbot />
    </>
  );
}

export default HomePage;
