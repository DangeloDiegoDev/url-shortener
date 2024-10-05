import Footer from './components/layout/Footer';
import Header from './components/layout/Header';
import MainPage from './components/MainPage';

export default async function Home() {
  return (
    <main className='h-screen'>
      <div className='h-[10%]'>
        <Header />
      </div>
      <div className='h-[80%]'>
        <MainPage />
      </div>
      <div className='h-[10%]'>
        <Footer />
      </div>
    </main>
  );
}