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

  const [typeOne, setTypeOne] = useState('');
  const [typeTwo, setTypeTwo] = useState('');


  // Holds Pokemon information
  let pokeID = pokeData.id; // 'id': pokedex num
  let pokeName = pokeData.name; // 'name': pokemon
  let pokeType = pokeData.type; // [{0: type: name}, {1: type2: name}, ...]
  let pokeSprites = pokeData.sprites; // ['dir1': url, 'dir2': url2, ...]
  let pokeHeight = pokeData.height;
  let pokeWeight = pokeData.weight;
  let pokeStats = pokeData.stats; 
  let typeLength = 0;
  if(pokeType){
    typeLength = pokeType.length;
  }
  
  // Fetches Pokemon data upon search request
  useEffect(() => {

    fetch(`http://localhost:4000/pokemon_by_id?id=${input ? input.toLowerCase() : '?offset=20&limit=150'}`,
    {
      method: 'GET',
      headers: {'Content-Type': 'application/json'},
      }
    )
    .then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error('Something went wrong')
    })
    .then((responseJson) => {
      console.log(responseJson['success'])
      if(responseJson['success'] == false){
        alert("Incorrect name or ID")
      }
      else{
        setPokeData(responseJson.data)
      }

   })
   .catch((err) => {
      console.log(err.message);
      setPokeData("piplup");
   });
  },[search]);

  let renderType = <div></div>

  if(typeLength == 2){
    renderType = 
      <div>
          <p>{`${pokeType ? Title(pokeType[0]) : 'Unknown'}`} </p>
          <p>{`${pokeType && 1 in pokeType ? Title(pokeType[1]) : 'Unknown'}`} </p>
      </div>
  } else {
    renderType = 
      <div>
          <p>{`${pokeType ? Title(pokeType[0]) : 'Unknown'}`} </p>
      </div>
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
      
      <div className='Display'> {/* The card that will have all the pokemon information*/}

        {/* Information is divided into 3 rows based on figma design*/}
        <div id="displayRowOne"> {/* Contains name, ID, sprite, and type(s)*/}
          <div> {/* Div that holds the pokemon name and ID to be displayed on left side*/}
            <p>{pokeName ? Title(pokeName) : 'Pokemon Finder'} </p>
            <p>{`ID: ${pokeID ? pokeID : 'Unknown'}`} </p>
          </div>
          <img className = "sprite" src={`${pokeSprites ? pokeSprites : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBCQSlOc0PRILMM5FCtsmAgSrMmjWY2QUHNw&usqp=CAU}'}`}/>
          {renderType}
          <div>
            <p>{`Weight: ${pokeWeight ? pokeWeight : 'Unknown'}`} </p>
            <p>{`Height: ${pokeHeight ? pokeHeight : 'Unknown'}`} </p>
          </div>
        </div>
        <hr></hr>

        <div id="displayRowTwo">
          <ul id = "statsList">
            <li>{`HP: ${pokeStats ? pokeStats[0]['statValue'] : 'Unknown'}`} </li>
            <li>{`Attack: ${pokeStats ? pokeStats[1]['statValue'] : 'Unknown'}`} </li>
            <li>{`Defense: ${pokeStats ? pokeStats[2]['statValue'] : 'Unknown'}`} </li>
          </ul>
          <ul id = "statsList">
            <li>{`Special Attack: ${pokeStats ? pokeStats[3]['statValue']: 'Unknown'}`} </li>
            <li>{`Special Defense: ${pokeStats ? pokeStats[4]['statValue']: 'Unknown'}`} </li>
            <li>{`Speed: ${pokeStats ? pokeStats[5]['statValue'] : 'Unknown'}`} </li>
          </ul>
        </div>
        <hr></hr>

        <div id="displayRowThree">
          <p>Row 3 Here</p>
        </div>
        
        
      </div>
    </div>
  );
}

export default App;
