import React from 'react'
import logo from '../components/logo.png'
import '../css/Header.css'
function Header({setSearch,setPage,page}){
    return (
        <header className="header">
            <img src={logo} alt="Logo" className="logo" />
            <h1> Coin Verse </h1>
         <nav className="nav" role="navigation" aria-label="Main Navigation">
           <a href="#" className={`nav-link ${page==="home" ? "active" : ""}`} onClick={() => setPage("home")}>Anasayfa</a>
        <a href="#" className={`nav-link ${page==="coins" ? "active" : ""}`} onClick={() => setPage("coins")}>Coinler</a>
        <a href="#" className={`nav-link ${page==="favorites" ? "active" : ""}`} onClick={() => setPage("favorites")}>Favoriler</a>
            
         </nav>
         <div className="search-bar">         
            {(page==="coins"|| page==="favorites")&& (
            
                
            <input type="text" placeholder="Coin ara..." onChange={(e)=>setSearch(e.target.value)}
            />
            )}
             </div>
        </header>
       
   
    );
}


export default Header;