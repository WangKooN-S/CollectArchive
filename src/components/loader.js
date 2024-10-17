import React, { useState, useEffect } from 'react';
import './loader.css';

const Loader = ({isSimple}) => {
    return (
        <div id="loader" className={`loader ${isSimple ? 'is-simple' : ''}`} role="status" aria-live="polite">
            <div className="loader__icon">
                <div className="loader__bar"></div>
            </div>
            <span className="loader__text">로딩중...</span>
        </div>
    );
}

export default Loader;