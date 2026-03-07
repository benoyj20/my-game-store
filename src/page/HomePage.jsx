import landingBG from '../assets/landingBG.png';
import WebsiteHeader from '../components/WebsiteHeader.jsx';
import WelcomeText from '../components/WelcomeText.jsx';

function HomePage() {
  return (
    <div>
      <WebsiteHeader/>
      <img src={landingBG} alt="console-pic" className='homeLogo' />
      <WelcomeText />
    </div>
  );
}

export default HomePage;
