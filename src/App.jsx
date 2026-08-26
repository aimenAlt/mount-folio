import data from './Data.json';
import Ambient from './components/Ambient/Ambient';
import ScrollRail from './components/ScrollRail/ScrollRail';
import Header from './components/Header/Header';
import Home from './pages/Home';
import Footer from './components/Footer/Footer';

export default function App() {
  return (
    <>
      <Ambient />
      <ScrollRail />
      <Header brand={data.brand} nav={data.nav} />
      <main>
        <Home {...data} />
      </main>
      <Footer data={data.footer} />
    </>
  );
}
