import {useState,useEffect} from "react"
import "../css/CoinList.css"
function CoinList({search,favorites,onToggleFavorite,onlyFavorites}){
    const [coins,setCoins]=useState([]);
    useEffect(()=>{
        fetch("https://api.coinlore.net/api/tickers/")
        .then((res)=>res.json())
        .then((data)=>setCoins(data.data))
        .catch((err)=>console.error(err));
    },[]);

    let list=onlyFavorites ? favorites : coins;
    const filtered=list.filter(c=>
        c.name.toLowerCase().includes(search.toLowerCase())||c.symbol.toLowerCase().includes(search.toLowerCase())
    ); 
    return (
        <div className="coin-list">
            <h2>Tüm coinler</h2>
            <table className="coin-table">
                <thead>
                    <tr>
                        <th>ID</th>
            <th>Rank</th>
            <th>Coin</th>
            <th>NameID</th>
            <th>Fiyat (USD)</th>
            <th>% Değişim (1h)</th>
            <th>% Değişim (24h)</th>
            <th>% Değişim (7g)</th>
            <th>Piyasa Değeri (USD)</th>
            <th>Hacim 24s</th>
            <th>Circ. Supply</th>
            <th>Total Supply</th>
            <th>Max Supply</th>
            <th>Favori</th>
                    </tr>
                </thead>
                <tbody>
                    {filtered.map((c)=>(
                        <tr key={c.id}>
                            <td>{c.id}</td>
              <td>{c.rank}</td>
              <td>
                {c.name} ({c.symbol})
              </td>
              <td>{c.nameid}</td>
              <td>${c.price_usd}</td>
              <td>{c.percent_change_1h}%</td>
              <td>{c.percent_change_24h}%</td>
              <td>{c.percent_change_7d}%</td>
              <td>${c.market_cap_usd}</td>
              <td>${c.volume24}</td>
              <td>{c.csupply}</td>
              <td>{c.tsupply}</td>
              <td>{c.msupply}</td>
               
                               <button onClick={()=>onToggleFavorite(c)}>{favorites.some(f=>f.id===c.id) ? "⭐": "☆"} </button>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
export default CoinList