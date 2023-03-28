import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import React from 'react';
import { Board } from "./Board";
import {DragDropContext} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { axiosInstanceAuth } from "@/pages/api/axiosApi";
import toastcomp from "@/components/toast";

function Canban(props: any) {
    const router = useRouter()
    let _columnId = 0;
    let _cardId = 0;
    var initialColumns = ['Sourced','Applied','Phone Screen','Assement','Interview','Offered Letter','Hired'].map((title, i) => ({
      id: _columnId++,
      title,
      cardIds: [],
    }));

    const [columns,setcolumns] = useState([])
    const [cards,setcards] = useState([])
    const [r,setr] = useState(0)
    const {applicantlist} = props

    useEffect(()=>{
      let arr = cards
      for(let i=0;i<applicantlist.length;i++){
        const abc = arr.some(item => item.arefid === applicantlist[i]["arefid"]);
        if(abc === false){
          let dic = {
            id: ++_cardId,
            title: `Card ${_cardId}`,
            arefid: `${applicantlist[i]["arefid"]}`,
          }
          arr.push(dic)
          for(let j=0;j<initialColumns.length;j++){
            if(initialColumns[j]['title'] === applicantlist[i]['status']){
              initialColumns[j]['cardIds'].push(_cardId)
            }
          }
        }
      }
      setcards(arr)
      setcolumns(initialColumns)
      setr(1)
    },[applicantlist])

    useEffect(()=>{
      
      console.log("------------")
      console.log("applicantlist",applicantlist)
      console.log("cards",cards)
      console.log("columns",columns)
      
    },[cards,columns])

    const axiosInstanceAuth2 = axiosInstanceAuth(props.token);
    async function chnageStatus(status: string | Blob, arefid: any) {
      const fdata = new FormData();
      fdata.append("status", status);
      await axiosInstanceAuth2
        .put(`/job/applicant/${arefid}/update/`, fdata)
        .then((res) => {
          toastcomp("Status Changed", "success")
          // setrefersh1(1);
        })
        .catch((err) => {
          console.log(err);
          toastcomp("Status Not Change", "error")
          // setrefersh1(1);
        });
    }

    const moveCard = (cardId, destColumnId, index) => {
      
      setcolumns(prevColumns => {
        const newColumns = prevColumns.map(column => ({
          ...column,
          cardIds: _.flowRight(
            // 2) If this is the destination column, insert the cardId.
            ids =>
              column.id === destColumnId
                ? [...ids.slice(0, index), cardId, ...ids.slice(index)]
                : ids,
            // 1) Remove the cardId for all columns
            ids => ids.filter(id => id !== cardId)
          )(column.cardIds),
        }));
        return newColumns;
      });

      for(let i=0;i<columns.length;i++){
        if(columns[i]["cardIds"].includes(cardId)){
          if(columns[i]["id"] !== destColumnId){
            for(let k=0;k<columns.length;k++){
              if(columns[k]["id"] === destColumnId){
              
                for(let j=0;j<cards.length;j++){
                  if(cards[j]["id"] === cardId){
                    console.log("*","arefid",cards[j]["arefid"])
                    chnageStatus(columns[k]["title"],cards[j]["arefid"])
                  }
                }
              }
            }
            console.log("*","column change")
          }
          else{
            console.log("*","column not change")
          }
        }
      }
    };

    return (
        <>
        {r > 0 && <Board 
						columns={columns}
            cards={cards}
						applicantlist={applicantlist}
						moveCard={moveCard}
					/>}
        </>
    )
}

export default DragDropContext(HTML5Backend)(Canban)