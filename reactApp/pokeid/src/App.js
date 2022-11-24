import React, {useState, useEffect} from 'react';
import './App.css';
import EvoCard  from './EvoCard';

const Title = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  // Holds input, search input, & pokeData from fetch req
  const [input, setInput] = useState('pikachu'); // set default to pikachu 
  const [search, setSearch] = useState('');
  const [pokeData, setPokeData] = useState([]);

  const [typeOne, setTypeOne] = useState('');
  const [typeTwo, setTypeTwo] = useState('');

  

  // Holds Pokemon information
  let pokeID = pokeData.id; // 'id': pokedex num
  let pokeName = pokeData.name; // 'name': pokemon
  let pokeType = pokeData.types; // [{0: type: name}, {1: type2: name}, ...]
  let pokeSprites = pokeData.sprites; // ['dir1': url, 'dir2': url2, ...]
  let pokeHeight = pokeData.height;
  let pokeWeight = pokeData.weight;
  let pokeStats = pokeData.stats; 
  let typeLength = 0;

  let poke_type = 'default.png';

  if(pokeType){
    typeLength = Object.keys(pokeType).length
  }
  
  // Fetches Pokemon data upon search request
  useEffect(() => {
    // Error Handling: Invalid input --> Display error message/popup

    const poke_url = `https://pokeapi.co/api/v2/pokemon/${input}`
    fetch(poke_url)
    .then(response => response.json())
    .then(json => setPokeData(json)).then(console.log());
    
  },[search]);

  let renderType = <div></div>

  if(typeLength == 2){
    renderType = 
      <div>
          <p>{`${pokeType ? Title(pokeType[0].type.name) : 'Unknown'}`} </p>
          <p>{`${pokeType && 1 in pokeType ? Title(pokeType[1].type.name) : 'Unknown'}`} </p>
      </div>
  } else {
    renderType = 
      <div>
          <p>{`${pokeType ? Title(pokeType[0].type.name) : 'Unknown'}`} </p>
      </div>
  }
  
  if (pokeType && pokeType[0].type.name === 'fire') {
      poke_type = document.getElementById('dsp').style.backgroundImage="url(" + "moltres.png" + ")";
  } else if (pokeType && pokeType[0].type.name === 'grass') {
      poke_type = document.getElementById('dsp').style.backgroundImage="url(" + "grasstype.png" + ")";
  } else if (pokeType && pokeType[0].type.name === 'water') {
      poke_type = document.getElementById('dsp').style.backgroundImage="url(" + "watertype.png" + ")";
  } else if (poke_type === null) {
      poke_type = document.getElementById('dsp').style.backgroundImage="url(" + "default.png" + ")";
  } else {
      poke_type = 'default.png' 
  }

  
  // Add classes that hide or show certain aspects like the ID, Type, Name, etc
  // Need to add ALL types of a Pokemon
  return (
    <div className='InputContainer'>
      <h1>Type in your favorite Pokemon's name!</h1> 
      <div id ="searchEngine"> {/* Contains the search bar and button in a flex box to help center items*/}
        <input value={input} id = "searchBar" placeholder='Please enter a Pokemon' onChange={e => setInput(e.target.value)}/>
        <button id= 'searchButton' onClick={() => {setSearch(input)}}>Search</button>
      </div>
      
      <div className='Display' id='dsp' > {/* The card that will have all the pokemon information*/}

        {/* <img className='Display' id='dsp' src={poke_type} ></img> */}
        
        {/* Information is divided into 3 rows based on figma design*/}
        <div id="displayRowOne"> {/* Contains name, ID, sprite, and type(s)*/}
          <div> {/* Div that holds the pokemon name and ID to be displayed on left side*/}
            <p>{pokeName ? Title(pokeName) : 'Pokemon Finder'} </p>
            <p>{`ID: ${pokeID ? pokeID : 'Unknown'}`} </p>
          </div>
          <img className = "sprite" src={`${pokeSprites ? pokeSprites.front_default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCQSlOc0PRILMM5FCtsmAgSrMmjWY2QUHNw&usqp=CAU}'}`}/>
          {renderType}
          <div>
            <p>{`Weight: ${pokeWeight ? pokeWeight : 'Unknown'}`} </p>
            <p>{`Height: ${pokeHeight ? pokeHeight : 'Unknown'}`} </p>
          </div>
        </div>
        <hr></hr>

        <div id="displayRowTwo">
          <ul id = "statsList">
            <li>{`HP: ${pokeStats ? pokeStats[0].base_stat : 'Unknown'}`} </li>
            <li>{`Attack: ${pokeStats ? pokeStats[1].base_stat : 'Unknown'}`} </li>
            <li>{`Defense: ${pokeStats ? pokeStats[2].base_stat : 'Unknown'}`} </li>
          </ul>
          <ul id = "statsList">
            <li>{`Special Attack: ${pokeStats ? pokeStats[3].base_stat : 'Unknown'}`} </li>
            <li>{`Special Defense: ${pokeStats ? pokeStats[4].base_stat : 'Unknown'}`} </li>
            <li>{`Speed: ${pokeStats ? pokeStats[5].base_stat : 'Unknown'}`} </li>
          </ul>
        </div>
        <hr></hr>

        <div id="displayRowThree">
          <p>Row 3 Here</p>
        </div>
        
      </div>

      {/* <div id ="nextPokemonz"> Contains the search bar and button in a flex box to help center items */}
        {/* <input value={input} id = "n" placeholder='Please enter a Pokemon' onChange={e => setInput(e.target.value)}/> */}
        {/* <button value={input} id= 's' onClick={() => {setSearch(input + 1)}}>test</button> */}
      {/* </div> */}

      <button id= 'nextButton' onClick={() => {
        let nextpokeID = pokeID + 1;
        setInput(nextpokeID)
        setSearch(nextpokeID)
         }
        }>Next Pokemon
        </button>
        <button id= 'backButton' onClick={() => {
        let nextpokeID = pokeID - 1;
        setInput(nextpokeID)
        setSearch(nextpokeID)
         }
        }>Last Pokemon
        </button>

      {/* <h1 className='evo_header'>Evolutions</h1> */}
      {/* <EvoCard card={card}/> */}
      {/* <EvoCard card={card}/>
      {
      card?.length > 0
          ? (
            <div className='container'>
              {card.map((card) => (
                <EvoCard card={card}/>
              ))}
            </div>
          ) :
          (
            <div className='empty'>
              <h2>No evolutions found!</h2>
            </div>
          )
} */}
      {/* <div className='Evolutions' > Card that displays for each pokemon evolution */}
        
          {/* <div className='evo_card'> */}
            {/* <img className="evo_sprite" src={`${pokeSprites ? pokeSprites.front_default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCQSlOc0PRILMM5FCtsmAgSrMmjWY2QUHNw&usqp=CAU}'}`}/> */}
          {/* </div> */}

          {/* <div className='evo_name'> */}
            {/* <p>{pokeName ? Title(pokeName) : 'Pokemon Finder'} </p> */}
            {/* <p>{`ID: ${pokeID ? pokeID : 'Unknown'}`} </p> */}
          {/* </div> */}
      {/* </div> */}
      
    </div>
    
  );
}

export default App;











// const card = {
//   "id": 1,
//   "name": "bulbasaur",
//   "types": [
//     {
//       "slot": 1,
//       "type": {
//         "name": "grass",
//         "url": "https://pokeapi.co/api/v2/type/12/"
//       }
//     },
//     {
//       "slot": 2,
//       "type": {
//         "name": "poison",
//         "url": "https://pokeapi.co/api/v2/type/4/"
//       }
//     }
//   ],
//   "height": 7,
//   "weight": 69,
//   "stats": [
//     {
//       "base_stat": 45,
//       "effort": 0,
//       "stat": {
//         "name": "hp",
//         "url": "https://pokeapi.co/api/v2/stat/1/"
//       }
//     },
//     {
//       "base_stat": 49,
//       "effort": 0,
//       "stat": {
//         "name": "attack",
//         "url": "https://pokeapi.co/api/v2/stat/2/"
//       }
//     },
//     {
//       "base_stat": 49,
//       "effort": 0,
//       "stat": {
//         "name": "defense",
//         "url": "https://pokeapi.co/api/v2/stat/3/"
//       }
//     },
//     {
//       "base_stat": 65,
//       "effort": 1,
//       "stat": {
//         "name": "special-attack",
//         "url": "https://pokeapi.co/api/v2/stat/4/"
//       }
//     },
//     {
//       "base_stat": 65,
//       "effort": 0,
//       "stat": {
//         "name": "special-defense",
//         "url": "https://pokeapi.co/api/v2/stat/5/"
//       }
//     },
//     {
//       "base_stat": 45,
//       "effort": 0,
//       "stat": {
//         "name": "speed",
//         "url": "https://pokeapi.co/api/v2/stat/6/"
//       }
//     }
//   ],
  

// }