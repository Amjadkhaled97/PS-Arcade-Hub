import { useState,useEffect,createContext,useContext } from "react";

const InvoiceContext =createContext();

export function InvoiceProvider({children}){
        //DATA IN CONTEXT....
    const [weekInvoices,setWeekInvoices] = useState([]);

    
    useEffect(()=>{
        const saved =JSON.parse(localStorage.getItem("weekInvoices")||"[]");
        setWeekInvoices(saved);
    },[]);

    useEffect(()=>{
        localStorage.setItem("weekInvoices",JSON.stringify(weekInvoices));
    },[weekInvoices])

    const addInvoices =(newInvoices)=>{
        if(!Array.isArray(newInvoices)||newInvoices.length===0) return;
        setWeekInvoices(prev=>[...prev,newInvoices]);
    };   


    const deleteDayInvoices = (dayIndex)=>{
       setWeekInvoices(prev=>prev.filter((_,i)=>i!==dayIndex ));
    };


    return(
        <InvoiceContext.Provider value={{weekInvoices,addInvoices,deleteDayInvoices}}>
            {children}
        </InvoiceContext.Provider>
    );

}
//for reading context
    export function useInvoice(){
        return useContext(InvoiceContext);
    }