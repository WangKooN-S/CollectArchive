import React, { useState, useEffect } from 'react';

const PreviewLayer = ({data, isPreviewShow, setIsPreviewShow, setIsLoading }) => {    
    // 이미지 로드 상태
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // 미리보기 레이어 닫기
    const handleClick = () => {
        setIsPreviewShow(false);
    };

    // 컴포넌트가 마운트될 때와 언마운트될 때 이벤트 리스너를 추가 및 제거
    useEffect(() => {
        const previewLayer = document.getElementById('preview_layer');
        if (previewLayer) {
            previewLayer.addEventListener('click', handleClick);
        }

        return () => {
            if (previewLayer) {
                previewLayer.removeEventListener('click', handleClick);
            }
        };
    }, []);

    // 데이터나 미리보기 상태가 변경될 때 이미지 로드 상태 초기화
    useEffect(() => {
        setIsImageLoaded(false); // 이미지 로드 상태 초기화        
    }, [data, isPreviewShow]);

    // 이미지 로드 완료시 호출
    const handleImageLoad = () => {
        setIsImageLoaded(true); // 이미지가 로드되면 상태 업데이트
        handleLoaderClose(); // 로딩 상태 해제
    };

    // 이미지 로드 실패시 호출
    const handleImageError = () => {
        handleLoaderClose();
    };

    // 로더 닫기 이벤트
    const handleLoaderClose = () => {
        if ( document.querySelector('.loader') !== null){
            document.querySelector('.loader').style.opacity = 0;
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    }

    // 이미지 렌더링
    const renderImage = () => {
        const images = [];
        const imageSources = [data.image, data.imageb];
        imageSources.forEach((src, index) => {
            if (src) {
                images.push(
                    <span key={`img-no${index + 1}`} className={`img-wrap img-no${index + 1}`}>
                        <img src={src} onLoad={handleImageLoad} onError={handleImageError} style={{ opacity: isImageLoaded ? 1 : 0, transform: 'translateY(0px)' }} alt={`Image ${index + 1}`} />
                    </span>
                );
            }
        });
        return images;
    };

    return (
        <div id="preview_layer" className={`lay-preview ${isPreviewShow ? 'is-show ' : ' '} ${data.type}`}>
            <header className="lay-preview__head">
                <h2 className="lay-preview__title">{data.name}</h2>
            </header>
			<div className="lay-preview__cont">
				<div className="lay-preview__inner">
                    {renderImage()}
                </div>								
			</div>
        </div>
    );
};

export default PreviewLayer;