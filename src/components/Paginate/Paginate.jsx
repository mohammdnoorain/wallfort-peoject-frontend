import React from 'react';
import "./Paginate.scss";
import _ from "lodash";
// import { returnPaginationPage } from '../../Utils/appUtils';

const returnPaginationPage=(totalPage,page,limit,siblings)=>{
    let totalPageNoInArray = 7 + siblings ;
    if(totalPageNoInArray >= totalPage){
    
        return _.range(1,totalPage + 1);
    }
    
    let leftSiblingsIndex =Math.max(page-siblings, 1);  //6
    let rightSiblingsIndex =Math.min(page + siblings, totalPage); //8
    
    let showLeftDots = leftSiblingsIndex > 2 ; //true
    let showRightDots = rightSiblingsIndex < totalPage - 2 ; // false
    console.log(showLeftDots,showRightDots,"Hello World");
    
    if(!showLeftDots && showRightDots){
        let leftItemsCount = 3 + (2* siblings);
        let leftRange = _.range(1,leftItemsCount +1);
        // console.log(leftRange,"Hi");
        return [...leftRange, " ...", totalPage];
    }
    else if(showLeftDots && !showRightDots){
        let rightItemsCount = 3 + (2* siblings);
        let rightRange = _.range(totalPage - rightItemsCount + 1,totalPage +1);
        return [1, "... ", ...rightRange];
    }
    else {
        let middleRange= _.range(leftSiblingsIndex,rightSiblingsIndex + 1);
        return [1, "... ", ...middleRange," ...", totalPage]
    }
    
    }

const Paginate = ({totalPage,page,limit,siblings, onPageChange}) => {
    let arr=returnPaginationPage(totalPage,page,limit,siblings);
    // console.log(arr,"Hello World");
  return (
    <ul className='paginate-ul'>
        <li><span onClick={()=>{onPageChange("&laquo;")}}>&laquo;</span></li>
        <li><span onClick={()=>{onPageChange("&lsaquo;")}}>&lsaquo;</span></li>
        {arr.map((val)=>{
                if(val === page){
            return(
        <li key={val}><span style={{color:"#0039ff",fontWeight:"bold"}} onClick={()=>{onPageChange(val)}}>{val}</span></li>)}
        else{
            return(
                <li key={val}><span onClick={()=>{onPageChange(val)}}>{val}</span></li>
            )
        }
        })}
        <li><span onClick={()=>{onPageChange("&rsaquo;")}}>&rsaquo;</span></li>
        <li><span onClick={()=>{onPageChange("&raquo;")}}>&raquo;</span></li>
    </ul>
  )
}

export default Paginate;