import React, {useState, useEffect} from 'react';
import './App.css';

const Title = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  // Holds input, search input, & pokeData from fetch req
  const [input, setInput] = useState('Piplup'); // set default to piplup 
  const [search, setSearch] = useState('');
  const [pokeData, setPokeData] = useState([]);

  // Holds Pokemon information
  let pokeID = pokeData.id; // 'id': pokedex num
  let pokeName = pokeData.name; // 'name': pokemon
  let pokeType = pokeData.types; // [{0: type: name}, {1: type2: name}, ...]
  let pokeSprites = pokeData.sprites; // ['dir1': url, 'dir2': url2, ...]

  let pokeStats = pokeData.stats; 
  
  // Fetches Pokemon data upon search request
  useEffect(() => {
    
    // Error Handling: Invalid input --> Display error message/popup
    const poke_url = `https://pokeapi.co/api/v2/pokemon/${input ? input.toLowerCase() : '?offset=20&limit=150'}`
    fetch(poke_url)
    .then(response => response.json())
    .then(json => setPokeData(json));
    
  },[search]);
  
  // Add classes that hide or show certain aspects like the ID, Type, Name, etc
  // Need to add ALL types of a Pokemon
  return (
    <div className='InputContainer'>
      <h1>Type in your favorite Pokemon's name!</h1> 
      <div id ="searchEngine"> {/* Contains the search bar and button in a flex box to help center items*/}
        <input value={input} id = "searchBar" placeholder='Please enter a Pokemon' onChange={e => setInput(e.target.value)}/>
        <button id= 'searchButton' onClick={() => {setSearch(input)}}>Search</button>
      </div>
      
      <div className='Display'> {/* The card that will have all the pokemon information*/}

        {/* Information is divided into 3 rows based on figma design*/}
        <div id="displayRowOne"> {/* Contains name, ID, sprite, and type(s)*/}
          <div> {/* Div that holds the pokemon name and ID to be displayed on left side*/}
            <p>{pokeName ? Title(pokeName) : 'Pokemon Finder'} </p>
            <p>{`ID: ${pokeID ? pokeID : 'Unknown'}`} </p>
          </div>
          <img className = "sprite" src={`${pokeSprites ? pokeSprites.front_default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCQSlOc0PRILMM5FCtsmAgSrMmjWY2QUHNw&usqp=CAU}'}`}/>
          <p>{`Primary Type: ${pokeType ? Title(pokeType[0].type.name) : 'Unknown'}`} </p>
        </div>

        <div id="displayRowTwo">
          <ul id = "statsList">
            <li>{`HP: ${pokeStats ? pokeStats[0].base_stat : 'Unknown'}`} </li>
            <li>{`Attack: ${pokeStats ? pokeStats[1].base_stat : 'Unknown'}`} </li>
            <li>{`Defense: ${pokeStats ? pokeStats[2].base_stat : 'Unknown'}`} </li>
            <li>{`Special Attack: ${pokeStats ? pokeStats[3].base_stat : 'Unknown'}`} </li>
            <li>{`Special Defense: ${pokeStats ? pokeStats[4].base_stat : 'Unknown'}`} </li>
            <li>{`Speed: ${pokeStats ? pokeStats[5].base_stat : 'Unknown'}`} </li>

          </ul>
        </div>

        <div id="displayRowThree">
          <p>Row 3 Here</p>
        </div>
        
        
      </div>
    </div>
  );
}

export default App;
