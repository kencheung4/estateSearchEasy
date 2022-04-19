import React, { useCallback, useEffect, useState } from 'react';
import { Popover } from '@headlessui/react'
import 'tw-elements';

const areas = require('../../mockData/areas.json')

const districts = require('../../mockData/districts.json');

const subAreas = require('../../mockData/subAreas.json');

const activeColor = 'bg-gray-300';
const inactiveColor ='bg-gray-100';


function AreaDropDown() {
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedSubAreas, setSelectedSubAreas] = useState([]);

  console.log("selectedSubAreas", selectedSubAreas);
  
  const handleClickArea = useCallback((area) => {
      return (event) => {
        setSelectedArea(area);
      }
  }, []);

  const handleClickDistrict = useCallback((d) => {
    return (event) => {
        setSelectedDistrict(d);
    }
}, []);

  const handleCheckSubArea = useCallback((subArea) => {
    return (event) => {
        let isSelected = event.target.checked;
        setSelectedSubAreas(prevState => {
            if (isSelected) {
                if (prevState.filter(s => s.key ==subArea.key).length <= 0) {
                    return [...prevState, subArea];
                }
            } else {
                if (prevState.filter(s => s.key ==subArea.key).length > 0) {
                    let newState = [...prevState];
                    newState.splice(prevState.findIndex(s => s.key == subArea.key), 1);
                    return newState;
                }
            }
            return prevState;
        })
    }
  }, []);
  
  const handleRemoveArea = (subArea)=>{
    setSelectedSubAreas(prevState => {
        if (prevState.filter(s => s.key == subArea.key).length > 0) {
            let newState = [...prevState];
            newState.splice(prevState.findIndex(s => s.key == subArea.key), 1);
            return newState;
        }
        return prevState;
    })
  }   

  return (
    <div className="AreaDropDown flex-1 max-w-xs">
        <Popover>
            <Popover.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
                選擇地區 ({selectedSubAreas.length})
                <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </Popover.Button>

            <Popover.Panel className="absolute w-full right-0 z-10 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none divide-y divide-solid">
                <p className="px-4 py-2"><span className="bold">已選擇: </span> 
                    {selectedSubAreas.map(subArea => 
                        <SelectedChip subArea={subArea} onRemove={handleRemoveArea}/>
                    )}

                </p>
                <div className="areas p-2">
                    {areas.map(area => {
                        let num_subArea_selected = selectedSubAreas.filter(sa => sa.area == area.key).length;
                        return (
                            <button 
                                className={`
                                    mx-2 px-2 rounded-full 
                                    ${num_subArea_selected > 0 ? 'font-black': ''} 
                                    ${!!selectedArea && selectedArea.key == area.key ? activeColor: inactiveColor}
                                `} 
                                onClick={handleClickArea(area)}
                            >
                                {area.value} {num_subArea_selected > 0 ? `(${num_subArea_selected})`: ''}
                            </button>
                        )
                    })}
                </div>

                
                 {/***
                 * 
                 * Desktop UI
                 * 
                 */}


                {!!selectedArea && <div className="districts p-2 hidden sm:flex flex-wrap">
                    {districts.filter(d => d.area == selectedArea.key).map(d => {
                        let num_subArea_selected = selectedSubAreas.filter(sa => sa.district == d.key).length;
                        return (
                            <button className={`
                                mx-2 px-2 rounded-full 
                                ${num_subArea_selected > 0 ? 'font-black': ''} 
                                ${!!selectedDistrict && selectedDistrict.key == d.key ? activeColor: inactiveColor}
                            `} 
                            onClick={handleClickDistrict(d)}>{d.value} {num_subArea_selected > 0 ? `(${num_subArea_selected})`: ''}</button>
                        )
                    })}
                </div>}
                {!!selectedDistrict && <div className="subareas p-2 hidden sm:flex flex-wrap items-center">
                    {subAreas.filter(a => a.district == selectedDistrict.key).map(sa => 
                        <div className="px-2">
                            <label>{sa.value}</label>
                            <input className="mx-1" onClick={handleCheckSubArea(sa)} type='checkbox' checked={selectedSubAreas.findIndex(sa1 => sa1.key == sa.key) > -1}/>
                        </div>
                    )}
                </div>}

                {/***
                 * 
                 * Mobile UI
                 * 
                 */}

                {!!selectedArea && <div className="accordion sm:hidden">
                    {districts.filter(d => d.area == selectedArea.key).map(d => {
                        let num_subArea_selected = selectedSubAreas.filter(sa => sa.district == d.key).length;
                        let collapseKey = `collapse-${d.key}`.replace(" ", "").toLowerCase();
                        let headerKey = `header-${d.key}`.replace(" ", "").toLowerCase();
                        return (
                            <div className="accordion-item bg-white border border-gray-200" key={d.key}>
                                <h2 className="accordion-header mb-0" id={headerKey}>
                                    <button className="
                                        accordion-button
                                        collapsed
                                        relative
                                        flex
                                        items-center
                                        w-full
                                        py-4
                                        px-5
                                        text-base text-gray-800 text-left
                                        bg-white
                                        border-0
                                        rounded-none
                                        transition
                                        focus:outline-none
                                    " type="button" data-bs-toggle="collapse" data-bs-target={`#${collapseKey}`} aria-expanded="true"
                                        aria-controls={`${collapseKey}`}>
                                        <span className={`${num_subArea_selected > 0 ? 'font-black': ''} `}>{d.value} {num_subArea_selected > 0 ? `(${num_subArea_selected})`: ''}</span>
                                    </button>
                                </h2>
                                <div id={`${collapseKey}`} className="accordion-collapse collapse" aria-labelledby={headerKey}
                                    data-bs-parent="#accordionExample">
                                    <div className="accordion-body py-4 px-5 flex-column">
                                        <div className="subareas p-2 flex-wrap items-center">
                                            {subAreas.filter(a => a.district == d.key).map(sa => 
                                                <div>
                                                    <input className="mx-1" onClick={handleCheckSubArea(sa)} type='checkbox' checked={selectedSubAreas.findIndex(sa1 => sa1.key == sa.key) > -1}/>
                                                    <label>{sa.value}</label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                    )}   
                </div>
                }
            </Popover.Panel>
        </Popover>
    </div>
  );
}

function SelectedChip({ subArea, onRemove }){
    return (
        <span onClick={()=>onRemove(subArea)} class="pointer-events-auto bg-gray-100 text-gray-800 font-medium inline-flex items-center px-2.5 py-0.5 rounded mr-2 dark:bg-gray-700 dark:text-gray-300">
            {subArea.value}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </span>
    );
}

export default AreaDropDown;
