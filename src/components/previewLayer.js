import React, { useState, useEffect } from 'react';

const PreviewLayer = ({data, isPreviewShow, setIsPreviewShow, setIsLoading }) => {    
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const handleClick = () => {
        setIsPreviewShow(false);
    };

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

    useEffect(() => {
        setIsImageLoaded(false); // 이미지 로드 상태 초기화        
    }, [data, isPreviewShow]);

    const handleImageLoad = () => {
        setIsImageLoaded(true); // 이미지가 로드되면 상태 업데이트
        handleLoaderClose(); // 로딩 상태 해제
    };

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
        if (data.image) {
            images.push(
                <span key="img-no1" className="img-wrap img-no1">
                    <img src={data.image} onLoad={handleImageLoad} onError={handleImageError} style={{ opacity: isImageLoaded ? 1 : 0, transform: 'translateY(0px)' }} alt="Image 1" />
                </span>
            );
        }
        if (data.imageb) {
            images.push(
                <span key="img-no2" className="img-wrap img-no2">
                    <img src={data.imageb} onLoad={handleImageLoad} onError={handleImageError} style={{ opacity: isImageLoaded ? 1 : 0, transform: 'translateY(0px)' }} alt="Image 2" />
                </span>
            );
        }
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