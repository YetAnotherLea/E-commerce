//TODO: set up States and Events with the API to load the right data

import "../styles/Homepage.css";
import {
  Navbar,
  Footer,
  HeroSection,
  Popular,
  Genders,
  Categories,
  CTA,
} from "../components";

function Homepage() {

  return (
    <>
      <HeroSection />
      <Popular />
      <Genders />
      <Categories />
      <CTA />
      <Footer />
    </>
  );
}

export default Homepage;
