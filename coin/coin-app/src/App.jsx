import { useState,useEffect } from 'react'
import Header from './components/Header.jsx'
import './App.css'
import CompareSection from './components/CompareSection.jsx'
import CoinList from './components/CoinList.jsx'
function App() {
       const [search,setSearch]=useState("");
       const [favorites,setFavorites]=useState([]);
       const [page,setPage]=useState("home");
       const toggleFavorite=(coin)=>{
         setFavorites(prev=>
            prev.some(f=>f.id===coin.id) ? prev.filter (f=>f.id !==coin.id): [...prev,coin]
         );
       };
  return (     
    <div>
      <Header setSearch={setSearch} setPage={setPage} page={page}/>
       {page==="coins"&&(
       <CoinList
         search={search}
         favorites={favorites}
         onToggleFavorite={toggleFavorite}
         />
       )}
        
   
      {page==="favorites"&& (
         <CoinList
         search={search}
         favorites={favorites}
         onToggleFavorite={toggleFavorite}
         onlyFavorites={true}
         />
      )}
       {page=== "home" && <CompareSection/>}
 
     </div>
  );
 
}
export default App
