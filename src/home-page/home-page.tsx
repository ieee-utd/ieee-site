//Use cookies for log in

//https://ieeeutd.org/privacy-policy
import TutoringCalendar from './tutoring-calendar/tutoring-calendar';
import WhoWeAre from '../who-we-are/who-we-are';
import Sponsors from "./sponsors/sponsors";
import Landing from "./landing/landing";

function HomePage() {
  return (
    <>
      <WhoWeAre />
      <Landing />
      <Sponsors />
      <TutoringCalendar />
    </>
  );
}

export default HomePage;
