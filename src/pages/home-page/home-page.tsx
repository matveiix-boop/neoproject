import { Exchange } from '@/widgets/exchange/exchange';
import { Features } from '@/widgets/features/features';
import { Footer } from '@/widgets/footer/footer';
import { Header } from '@/widgets/header/header';
import { Hero } from '@/widgets/hero/hero';
import { News } from '@/widgets/news/news';
import { Subscribe } from '@/widgets/subscribe/subscribe';
import { World } from '@/widgets/world/world';

export const HomePage = () => {
  return (
    <>
      <Header />
      <main className="main">
        <Hero />
        <Features />
        <Exchange />
        <World />
        <News/>
        <Subscribe />
      </main>
      <Footer />
    </>
  );
};
