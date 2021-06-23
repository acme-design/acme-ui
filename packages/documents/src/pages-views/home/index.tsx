/**
 * /home 首页
 * */

import React from 'react';
import Link from 'next/link';
import joinAssetPath from '../../lib/joinAssetPath';
import Header, { defaultMenus } from '../compositions/Header';
import Footer from '../compositions/Footer';
import HomeLess from './styles/home.module.less';
import sourcesCards from './contents';

const Home: React.FC = () => {
  return (
    <div className={HomeLess.container}>
      <div className={HomeLess.headerWrapper}>
        <div className={HomeLess.background}>
          <video autoPlay loop muted className={HomeLess.video}>
            <source src={joinAssetPath('/assets/video.mp4')} type="video/mp4" />
          </video>
        </div>
        <div className={HomeLess.headerInner}>
          <Header menus={defaultMenus} transparent className={HomeLess.headerMenu} />
          <div className={HomeLess.headerContent}>
            <img src={joinAssetPath('/logo.svg')} alt="acme-ui-logo" />
            <h1>专注于服务B端产品的设计系统</h1>
            <p>
              我们将这些思考和沉淀，抽象形成了一些稳定且高复用性的内容，逐渐打磨出一套服务于产品设计的设计模式和实践方法。
            </p>
            <div className={HomeLess.controls}>
              <Link href="/components">组件</Link>
              <Link href="/develop">开始使用</Link>
            </div>
          </div>
        </div>
      </div>
      <main className={HomeLess.content}>
        <div className={HomeLess.contentInner}>
          <div className={HomeLess.contentTitle}>
            <h2>设计指导和规范</h2>
            <p>使用我们最受欢迎的设计和开发资源来快速启动您的最新项目</p>
          </div>
          <div className={HomeLess.sourceCards}>
            {sourcesCards.map((card) => {
              return (
                <div className={HomeLess.cardWrapper} key={card.title}>
                  <div className={HomeLess.card} style={{ backgroundColor: card.color }}>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <img src={joinAssetPath(card.img)} alt={card.title} />
                    <Link href={card.link}>
                      <a className={HomeLess.cardLink}>
                        <img src={joinAssetPath('/to.svg')} alt="to" />
                      </a>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
export default Home;
