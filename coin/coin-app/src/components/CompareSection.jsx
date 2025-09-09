import {useState,useEffect} from "react";
 import "../css/CompareSection.css"

function CompareSection(){
   const [coins,setCoins]=useState([]);
   const [coin1,setCoin1]=useState(null);
   const [coin2,setCoin2]=useState(null);

   const[loading,setLoading]=useState(true);
   const [err, setErr] = useState(null);

   const[answered,setAnswered]=useState(false);
   const[isCorrect,setIsCorrect]=useState(null);

   const[score,setScore]=useState(0);
   const[round,setRound]=useState(1);

   const fmtPrice=(n)=> 
    Number(n).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:6}); /*min 2 ondalıklı max 6 ondalıklı */
   const fmtInt=(n)=>
    Number(n).toLocaleString("en-US",{maximumFractionDigits:0}); /*virgülden sonra rakam yazmaz */

   useEffect(()=>{
    const fetchCoins=async()=>{
      try{
        setLoading(true);
        const res=await fetch("https://api.coinlore.net/api/tickers/");
        const data=await res.json();
        setCoins(data?.data||[]);
        pickRandomCoins(data?.data||[]); /*hemen 2 coin çeker oyun başlasın diye */
      }catch(e){
        setErr("Veri alınamadı:"+e.message);// hata olursa kullanıcıya gösterir
      } finally{
         setLoading(false); // hata olsun olmasın loading bölümü kapatılır
      }
    };
    fetchCoins();
   }, []);
   const pickRandomCoins=(list)=>{
    if(!list||list.length<2) return; //en az 2 coin yoksa çalıştırma
    let a=list[Math.floor(Math.random()*list.length)]; //math.random rastgele sayı üretir
     let b=list[Math.floor(Math.random()*list.length)];//math.floor tam sayıya çevirir
     while(a.id===b.id){  // seçilen random coinler aynı olma ihtimaline karşı 
      b=list[Math.floor(Math.random()*list.length)];
     }
     setCoin1(a);
     setCoin2(b);
     setAnswered(false);//henüz cevap verilmedi.
     setIsCorrect(null);//henüz doğru/yanlış belli değil.
   };
    const pickRandomCoin2 = (list) => { // bu kısım sadeece coin2 yi değiştirir
    if (!list || list.length < 2) return;
    let b = list[Math.floor(Math.random() * list.length)];
    while (b.id === coin1?.id) { // coin2 ve coin1 aynı olamaz 
      b = list[Math.floor(Math.random() * list.length)]; //aynıysa tekrar seç
    }
    setCoin2(b);
    setAnswered(false); // kullanıcı henüz cevapp vermedi
    setIsCorrect(null);// d ya da y bilgisi yok
  };
const checkAnswer=(choice)=>{
  if(!coin1||!coin2)   return; //coinler yoksa fonktan çık
  const p1=parseFloat(coin1.price_usd); //fiyat al
  const p2=parseFloat(coin2.price_usd);
  const coin1Higher=p1>p2; //fiyat karşılaşltır
  let correct=false; // doğru mu başlangıçta false
  if(choice==="higher")// coin1>coin2 denirse 
    correct=coin1Higher;//kontrol et
  if(choice==="lower") // coin1<coin2 denirse
     correct=!coin1Higher; //kontrol

  setIsCorrect(correct); //d/y bilgisiini state yaz
  setAnswered(true);
  setScore((s)=>(correct ? s+1:s)); //d ise skor +1 değilse skor aynı
};
const nextQuestion=()=>{ // new soru 
  setRound((r)=> r+1); // tur sayımızı artırır
  if(isCorrect){
    pickRandomCoin2(coins); //cevap true ise coin1 kalır coin2 çağırılır
  } else{
    pickRandomCoins(coins);// ama false ise coin1 ve coin2 baştan seçilir
  }
  
};
if(loading) 
  return <div className="compare-section">
    <h2>Coin Tahmin Et</h2>
    <div className="status">Yükleniyor...</div>  {/*apiden veriler gelmediyse sadece başlık ve yükleniyor mesajı*/}
    </div>;
if(err) 
  return <div className="compare-section"> {/* eğer hata olduysa başlık+hata mesajı */}
    <h2>Coin Tahmin Et</h2>
    <div className="status">{err}</div>
    </div>;
  return (
    <div className="compare-section"> 
      <h2>COIN TAHMİN ET!</h2>
    <div className="status">
      <span className="tag round">Tur: <strong>{round}</strong></span> {/*kaçıncı turda olduğunu yazar */}
      <span className="tag score">Skor:{score}</span> {/*toplam doğru sayısı */}
    </div>
      {coin1&&coin2&&(
        <>
        <p>  {/*Coin1 fiyatı,coin2 nin fiyatından daha yüksek mi? */}
          <strong>{coin1.name} ({coin1.symbol})</strong> fiyatı,
          <strong> {coin2.name} ({coin2.symbol})</strong> fiyatından <em> daha yüksek mi</em>? {/* <em>  italik yapar */}
          </p>
          <div className="buttons">
            <button onClick={()=> checkAnswer ("higher")} disabled={answered}>Yüksek</button> {/*yüksek ve düşük butonu cvp verdikten sonra pasifleşir */}
             <button onClick={()=> checkAnswer ("lower")} disabled={answered}>Düşük</button>
              <button onClick={()=> nextQuestion ()} disabled={!answered}>Sonraki soru</button>

          </div>
          {answered &&(
            <>
            <div className={`result ${isCorrect ? "good" : "bad"}`}>
              {isCorrect ?"✅ Doğru! " :"❌ Yanlış!"}
            </div>
            <table className="reveal-table">
              <thead>
                <tr>
                  <th>Özellik</th>
                  <th>{coin1.name}</th>
                  <th>{coin2.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                 <td>ID</td>
          <td>{coin1.id}</td>
          <td>{coin2.id}</td>
        </tr>
        <tr>
          <td>Symbol</td>
          <td>{coin1.symbol}</td>
          <td>{coin2.symbol}</td>
        </tr>
        <tr>
          <td>Name</td>
          <td>{coin1.name}</td>
          <td>{coin2.name}</td>
        </tr>
        <tr>
          <td>NameID</td>
          <td>{coin1.nameid}</td>
          <td>{coin2.nameid}</td>
        </tr>
        <tr>
          <td>Rank</td>
          <td>{coin1.rank}</td>
          <td>{coin2.rank}</td>
        </tr>
        <tr>
          <td>Fiyat (USD)</td>
          <td>${fmtPrice(coin1.price_usd)}</td>
          <td>${fmtPrice(coin2.price_usd)}</td>
        </tr>
        <tr>
          <td>% Değişim (1h)</td>
          <td>{coin1.percent_change_1h}%</td>
          <td>{coin2.percent_change_1h}%</td>
        </tr>
        <tr>
          <td>% Değişim (24h)</td>
          <td>{coin1.percent_change_24h}%</td>
          <td>{coin2.percent_change_24h}%</td>
        </tr>
        <tr>
          <td>% Değişim (7g)</td>
          <td>{coin1.percent_change_7d}%</td>
          <td>{coin2.percent_change_7d}%</td>
        </tr>
        <tr>
          <td>Piyasa Değeri</td>
          <td>${fmtInt(coin1.market_cap_usd)}</td>
          <td>${fmtInt(coin2.market_cap_usd)}</td>
        </tr>
        <tr>
          <td>Hacim 24s</td>
          <td>${fmtInt(coin1.volume24)}</td>
          <td>${fmtInt(coin2.volume24)}</td>
        </tr>
        <tr>
          <td>Circulating Supply</td>
          <td>{fmtInt(coin1.csupply)}</td>
          <td>{fmtInt(coin2.csupply)}</td>
        </tr>
        <tr>
          <td>Total Supply</td>
          <td>{fmtInt(coin1.tsupply)}</td>
          <td>{fmtInt(coin2.tsupply)}</td>
        </tr>
        <tr>
          <td>Max Supply</td>
          <td>{fmtInt(coin1.msupply)}</td>
          <td>{fmtInt(coin2.msupply)}</td>
        </tr>
              </tbody>
            </table>
            </>
           
          )}
          </>
      )}
      
       
      
    </div>
  );
}

export default CompareSection;