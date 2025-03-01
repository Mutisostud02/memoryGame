import { useEffect, useState } from "react"

function App() {
  const [score, setScore] = useState(0);
  const [clicked, setClicked] = useState([])
  const [bestScore, setBestScore] = useState([]);
  const [staticImg, setStaticImg] = useState([]);

  async function getImageFromApi() {
  try {
  const response = await fetch('https://api.giphy.com/v1/stickers/search?api_key=MVyTaUBIpcZn7pon7F7ZDUgZDNS6XHxW&q=cat&limit=15');
  if(!response.ok) {
    throw new Error(`HTTP Error: Status ${response.status}`);    
  }
  const data = await response.json();
  return data.data
} catch (error) {
  console.error("Fetch error:", error);
}
}
useEffect(() => {
  let isMounted = true;
  async function fetchedData() {
    const fetchData = await getImageFromApi();
    if(isMounted && fetchData) {
  setStaticImg(fetchData.map(item => {
    return {
      id: item.id,
      name: item.username,
      imageUrl: item.images.original_still.url
    
  }}))
  }
}
  fetchedData()

  return () => {
    isMounted = false
  }
},[])

function shuffleArray(array) {
  let shuffled = [...array]; // Copy the original array to avoid modifying it
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Get a random index
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
  }
  return shuffled;
}


  function handleClick(id) {
    const findId = clicked.includes(id);
    if(!findId) {
    setClicked([...clicked, id])    
    setScore(prev => prev + 1)
    setStaticImg(shuffleArray(staticImg))


    } else {
      setBestScore([...bestScore, clicked.length])
      setClicked([])
      setScore(0)
    }
  }
  let max = Math.max(...bestScore, 0)
  



  return (
    <>
    <div className="heading">
    <div>
    <h1>Hello, Welcome to the Game</h1>
    <p>Earn scores by clicking on pics once, if you click twice, <b>GAME IS OVER!</b></p>
    </div>
    <div className="scores">
      <p>Best Score: {max}</p>
      <p>Score: {score}</p>
    </div>    
    </div>
    <section className="gameboard">
    {staticImg ? 
      <div className="image-container">
        {staticImg.map(item => <img key={item.id} src={item.imageUrl} alt={item.username} onClick={() => handleClick(item.id)}/>)}
      
      </div>
    : 
    <p>Loading...</p>
    }

    </section>
    </>
  )
}

export default App
