import React, { useState, useEffect } from 'react';
import Loader from './components/loader';
import Header from './components/header';
import MainContent from './components/main';
import themeData from './data/theme.json';

function App() {
  // 로딩 여부 판단
  const [isLoading, setIsLoading] = useState(true);  
  const [isSimple, setIsSimple] = useState(false); // isSimple 상태 추가

  // 로딩이 끝나면 아래 코드를 처리
  useEffect(() => {
    const handleLoad = () => {
      // .loader의 opacity를 0으로 만들어 로딩 화면을 사라지게 함
      document.querySelector('.loader').style.opacity = 0;
      setTimeout(() => {
        setIsLoading(false);
        setIsSimple(true);
      }, 500);
    };
    window.addEventListener('load', handleLoad);
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  // 헤더 활성화, 비활성화 처리
  const handleHeader = (isActive) => {
    const header = document.querySelector('.collect-header');
    if (isActive) {
      header.classList.add('is-show');
    } else {
      header.classList.remove('is-show');
    }
  };  

  return (
    <div className="App">
      {isLoading && <Loader isSimple={isSimple}/>}
      <main id="wrapper" className="collect-wrap">
        <Header themeData={themeData} />
        <MainContent handleHeader={handleHeader} themeData={themeData} setIsLoading={setIsLoading} />
      </main>
    </div>
  );
}

export default App;
