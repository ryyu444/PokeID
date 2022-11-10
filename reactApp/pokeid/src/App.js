import logo from './logo.svg';
import React, {useState, useEffect} from 'react';
import './App.css';

const Title = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  // Holds input, search input, & pokeData from fetch req
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const [pokeData, setPokeData] = useState([]);

  // Holds Pokemon information
  let pokeID = pokeData.id; // 'id': pokedex num
  let pokeName = pokeData.name; // 'name': pokemon
  let pokeType = pokeData.types; // [{0: type: name}, {1: type2: name}, ...]
  let pokeSprites = pokeData.sprites; // ['dir1': url, 'dir2': url2, ...]

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
      <input value={input} placeholder='Please enter a Pokemon' onChange={e => setInput(e.target.value)}/>
      <button id='search' onClick={() => {setSearch(input)}}>Search</button>
      <div className='Display'>
        <h1>{pokeName ? Title(pokeName) : 'Pokemon Finder'} </h1>
        <p>{`ID: ${pokeID ? pokeID : 'Unknown'}`} </p>
        <p>{`Primary Type: ${pokeType ? Title(pokeType[0].type.name) : 'Unknown'}`} </p>
        <img src={`${pokeSprites ? pokeSprites.front_default : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCQSlOc0PRILMM5FCtsmAgSrMmjWY2QUHNw&usqp=CAU}'}`}/>
      </div>
    </div>
  );
}

export default App;
