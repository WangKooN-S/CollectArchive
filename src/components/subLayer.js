import React, { useState, useEffect } from 'react';
import './sublayer.css';
import PreviewLayer from './previewLayer';

const SubLayer = ({theme, isShow, setIsLoading, onClose}) => {
    const [isVisible, setIsVisible] = useState(isShow);
    const [content, setContent] = useState('');
    const [contentClass, setContentClass] = useState('');    
    const [previewData, setPreviewData] = useState(null);
    const [isPreviewShow, setIsPreviewShow] = useState(false);

    // 강제로 첫번째 메뉴를 클릭하도록 설정
    useEffect(() => {
        setIsVisible(isShow);
    }, [isShow]);

    useEffect(() => {
        // sub_menu의 첫 번째 li 항목의 클릭 이벤트 실행
        if (theme.menu && theme.menu.length > 0) {
            const firstMenu = theme.menu[0];
            handleLiClick(new Event('click'), firstMenu);
            const firstLi = document.querySelector('.sub_menu li');
            if (firstLi) {
                firstLi.classList.add('is-active');
            }
        }
    }, [theme]);

    // 레이어 닫기 버튼 클릭 이벤트
    const handleCloseClick = () => {
        setIsVisible(false);        
        onClose();
        // url 해시값 제거
        window.location.hash = '';
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

    // 메뉴 클릭 이벤트
    const handleLiClick = async (event, menu) => {
        event.preventDefault();

        // 해시값을 변경합니다.
        window.location.hash = menu.hash;

        // Inner 스크롤을 초기화 합니다.
        const subCont = document.getElementById('subCont');
        if (subCont) {
            subCont.scrollTop = 0;
        }

        if ( menu.type === 'list' ) { // 소장품 목록일 경우 > 시트데이터를 가져옴
            setIsLoading(true);
            try {
                // src 경로의 json 파일을 파싱합니다.
                const response = await fetch(`${process.env.PUBLIC_URL}/${menu.src}`);
                const data = await response.json();

                // data.googleSheet URL을 파싱하여 JSON 데이터를 가져옵니다.
                if (data.googleSheet) {
                    const sheetApi = `${data.googleSheet}${process.env.REACT_APP_GOOGLE_SHEETS_API_KEY}`;
                    const sheetResponse = await fetch(sheetApi);
                    const sheetData = await sheetResponse.json();
                    
                    // sheetData 로딩이 완료되면
                    if (sheetData) {
                        // 시트 데이터는 values 속성에 있음
                        const entry = sheetData.values;

                        // 첫 번째 행을 헤더로 설정
                        const headers = entry[0];

                        // 데이터 가공
                        const processedData = entry.slice(1).map(row => {
                            const obj = {};
                            row.forEach((value, i) => {
                                // 헤더와 데이터 값으로 객체 생성
                                obj[headers[i]] = value === '' ? null : value;
                            });

                            // null 값 속성 제거
                            Object.keys(obj).forEach(key => {
                                if (obj[key] == null) delete obj[key];
                            });

                            return obj;
                        });
                        data.tableData = processedData;
                        // console.log(data);

                        // 헤더를 반환하는 함수 생성
                        const renderTableHeader = () => {
                            if (!data.tableHeader) return null;
                        
                            const headerRows = data.tableHeader.list.map((row, rowIndex) => {
                                const headerCells = row.map((header, headerIndex) => {
                                    const width = header.width !== "auto" ? `width="${header.width}"` : '';
                                    const rowSpan = header.row !== 1 ? `rowspan="${header.row}"` : '';
                                    const colSpan = header.col !== 1 ? `colspan="${header.col}"` : '';
                                    return `<th key="${headerIndex}" ${width} ${rowSpan} ${colSpan}>${header.name}</th>`;
                                }).join('');
                        
                                return `<tr key="${rowIndex}">${headerCells}</tr>`;
                            }).join('');
                        
                            return `<thead>${headerRows}</thead>`;
                        };

                        const renderTableBody = () => {
                            if (!data.tableData) return null;
                        
                            const bodyRows = data.tableData.map((row, rowIndex) => {                            
                                let rowClass = '';                            
                                if (data.type === "typeListEuro") rowClass = `bg-eu-${row.nmeng}`;
                                if (data.type === "typeListStates" || data.type === "typeListAtb") rowClass = row.nmeng;
                                if (["typeListForeignCoin", "typeListForeignBanknotes", "typeListCommemorativeBanknotes", "typeListCommemorativeCoin", "typeListMintages"].includes(data.type)) {
                                    if (row.country !== "-") rowClass = `v-flag-title v-country-${row.country}`;
                                }
                                if (data.type === "typeListStamp" && row.type !== "-") rowClass = "v-type-title";
                                if (row.name === "0") rowClass = "table-mg";                            

                                // 미보유 관련
                                let rowHave = false;
                                // 이미지 포함 여부
                                let rowImage = false;
                        
                                const cells = Object.entries(row).map(([key, value], cellIndex) => {
                                    let cellClass = '';
                                    let colSpan = '';
                                    if ( data.type === "typeListStamp" && row.type !== "-" ){ // 우표일경우 타이틀 처리
                                        if ( key.includes('name') ){
                                            colSpan = ` colspan="11"`;
                                        }else{
                                            colSpan = ` style="display:none;"`;
                                        }
                                    }
                                    if (key.includes('grade') && value > 0) cellClass = 'active';
                                    if (key.includes('coin')) cellClass = parseInt(value, 10) ? 'eu-active' : 'eu-disabled';
                                    if (key.includes('have') ){
                                        if ( value > 0 ) {
                                            rowHave = true;
                                        }
                                        // value가 1 이상이면 "보유"로 변경
                                        value = value > 0 ? '보유' : '미보유';
                                    }
                                    if (key.includes('image')){
                                        if ( value !== '-' ) {
                                            rowImage = true;
                                        }
                                    }
                                    if (key.includes('url')){
                                        if ( value !== '0' && value !== '-' ) {
                                            value = `<a href="https://colnect.com/ko/banknotes/banknote/${value}" onclick="event.stopPropagation();" target="_blank">[링크]</a>`;
                                        }
                                    }
                                    return `<td key="${cellIndex}" data-field-type="v-${key}" class="${cellClass}" ${colSpan}>${value}</td>`;
                                }).join('');
                        
                                // 미보유일 경우 클래스 추가 
                                if (!rowHave) rowClass += ' disabled'; 
                                // 이미지 포함된 경우 클래스 추가
                                if (rowImage) rowClass += ' img-record';

                                return `<tr key="${rowIndex}" class="${rowClass}">${cells}</tr>`;
                            }).join('');
                        
                            return `<tbody>${bodyRows}</tbody>`;
                        };

                        const renderSources = () => {
                            if (!data.source) return null;
                        
                            const sourcesHtml = data.source.map((source, index) => {
                                const keyword = source.keyword ? `, "${source.keyword}"` : '';
                                return `
                                    <div key="${index}" class="txt-source">
                                        ${source.title}${keyword}, 
                                        <a href="${source.url}" target="_blank" rel="noopener noreferrer">${source.url}</a>, (${source.date})
                                    </div>
                                `;
                            }).join('');
                        
                            return `
                                <div class="wrap-source">
                                    <div class="tit-source">참고자료</div>
                                    ${sourcesHtml}
                                </div>
                            `;
                        };

                        setContent(`
                            <div class="inner-group ${data.type}">
                                <h2>${data.title}</h2>
                                <span class="txt-target">${data.txtTarget}</span>
                                <div class="table-group table-align-center">
                                    <table>
                                        ${renderTableHeader()}
                                        ${renderTableBody()}
                                    </table>
                                </div>
                                ${renderSources()}
                            </div>
                        `);
                        setContentClass(data.type);
                    }
                    handleLoaderClose();
                }
                
            } catch (error){
                console.error('Error fetching the file:', error);
                handleLoaderClose();
            }
        }else{ // 목록이 아닌경우 > html을 가져옴
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/${menu.src}`);
                let data = await response.text();
    
                // 파싱하여 img 태그의 src 경로를 require로 변경
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, 'text/html');
                const images = doc.querySelectorAll('img');
                images.forEach(img => {
                    const imgSrc = img.getAttribute('src');
                    if (imgSrc.indexOf('img-source') > -1) {
                        img.setAttribute('src', require(`../${imgSrc}`));
                    }
                });
                data = doc.documentElement.outerHTML;
    
                setContent(data);
                setContentClass(menu.type);
    
            } catch (error) {
                console.error('Error fetching the file:', error);
            }            
        }

        // 부모 li태그에 .is-active 클래스 추가
        if ( event && event.target ) {
            const parentLi = event.target.closest('li');
            const allLi = document.querySelectorAll('.sub_menu li');
            allLi.forEach(li => li.classList.remove('is-active'));
            if (parentLi) {
                parentLi.classList.add('is-active');
            }
        }
    };

    useEffect(() => { 
        const handleClick = (event) => {
            const target = event.target.closest('tr.img-record');
            if (target) {
                handleTableRecordClick(target);
            }
        };

        const tableGroup = document.querySelector('.table-group');
        if (tableGroup) {
            tableGroup.addEventListener('click', handleClick);
        }

        return () => {
            if (tableGroup) {
                tableGroup.removeEventListener('click', handleClick);
            }
        };
    }, [content]);

    // 테이블 레코드 클릭 이벤트
    const handleTableRecordClick = (target) => {
        // target의 table 데이터를 json으로 변환
        const row = target.closest('tr');
        const cells = row.querySelectorAll('td');
        const data = {};
        cells.forEach(cell => {
            const key = cell.getAttribute('data-field-type').replace('v-', '');
            data[key] = cell.textContent;
        });

        // target의 부모 .inner-group의 클래스명을 가져와서 .inner-group을 삭제한 후 data.type에 추가
        const parent = target.closest('.inner-group');
        const type = parent.className.replace('inner-group', '').trim();
        data.type = type;
        
        setPreviewData(data);
        setIsPreviewShow(true);
        setIsLoading(true);
    }

    // 프리뷰 레이어 렌더링
    const renderPreviewLayer = (data) => {        
        if (!data) return null;
        return <PreviewLayer data={data} isPreviewShow={isPreviewShow} setIsPreviewShow={setIsPreviewShow} setIsLoading={setIsLoading}/>;        
    };

    // theme.id에서 "0"을 제거한 클래스 이름 생성
    const themeClass = theme.id.replace(/0/g, '');
    
    return (
        <>
            <div id="subLayer" className={`lay-detail ${isVisible ? 'is-show' : ''} ${themeClass}`} style={{ '--var-main-color': theme.color }}>
                <header id="subHeader" className="lay-detail__head">
                    <div className="lay-detail__head-title">
                        <div className="lay-detail__text-theme">KOONIE {theme.id}</div>
                        <h4 className="lay-detail__title">
                            <span className="lay-detail__title--en">{theme.nmEn}</span>
                            <span className="lay-detail__title--ko">{theme.nmKo}</span>
                        </h4>
                    </div>

                    {/* 하위 메뉴 */}
                    {theme.menu && (
                        <ul className="sub_menu">
                            {theme.menu.map((menu, index) => {
                                // console.log(menu,index)
                                const type = (menu.type === 'list') ? 'btn--list' : '';
                                return(
                                    <li key={index} className={type}>
                                        <a href={`/#${menu.hash}`} onClick={(event) => handleLiClick(event, menu)}>{menu.title}</a>
                                    </li>
                                )
                            }
                        )}
                        </ul>
                    )}
                    <button className="lay-detail__btn-close" onClick={handleCloseClick}>레이어 닫기</button>
                </header>
                <div id="subCont" className="lay-detail__cont">
                    <div className={`lay-detail__inner type${contentClass}`} dangerouslySetInnerHTML={{ __html: content }}></div>
                </div>
            </div>
            {renderPreviewLayer(previewData)}
        </>
    );
};

export default SubLayer;