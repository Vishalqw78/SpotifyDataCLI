// Importing required packages
import axios from 'axios';
import figlet from 'figlet';
import gradient from "gradient-string";

// Function to get top 10 tracks
async function getTopTracks(accesstoken,term) {
  try {
    // Make a GET request to the Spotify API endpoint to get the top 10 tracks
    const response = await axios.get(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${term}`, {
      headers: {
        'Authorization': `Bearer ${accesstoken}`
      }
    });

    // Display a fancy heading using figlet and gradient-string packages
    figlet(`Top 10 Song `, (err, data) => {
      console.log(gradient.pastel.multiline(data) + '\n');
    });

    // Loop through the response data and display the name of each track
    for (let i = 0; i < response.data.total && i<10; i++) {
      let item_name= response.data.items[i].name;
      if(item_name!=''){
        console.log(item_name);
      }
      else{
        console.log('Unknown Song');
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to get top 10 artists
async function getTopArtists(accesstoken,term) {
    try {
      // Make a GET request to the Spotify API endpoint to get the top 10 artists
      const response = await axios.get(`https://api.spotify.com/v1/me/top/artists?limit=10&time_range=${term}`, {
        headers: {
          'Authorization': `Bearer ${accesstoken}`
        }
      });

      // Display a fancy heading using figlet and gradient-string packages
      figlet(`Top 10 Artist `, (err, data) => {
        console.log(gradient.pastel.multiline(data) + '\n');
      });

      // Loop through the response data and display the name of each artist
      for (let i = 0; i < response.data.total && i<10; i++) {
        let item_name= response.data.items[i].name;
        if(item_name!=''){
          console.log(item_name);
        }
        else{
          console.log('Unknown Artist');
        }   
      }
      
    } catch (error) {
      console.error(error);
    }
  }

// Function to get user details
async function getUserDetail(accesstoken) {
    try {
      // Make a GET request to the Spotify API endpoint to get the user details
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accesstoken}`
        }
      });
      
      // Display a fancy welcome message using figlet and gradient-string packages
      let item_name= response.data.display_name;
      figlet(`Welcome  , ${item_name} `, (err, data) => {
        console.log(gradient.pastel.multiline(data) + '\n');
      });
      
    } catch (error) {
      console.error(error);
    }
  }

// Exporting the functions so that they can be used in other modules
export {getTopArtists,getTopTracks,getUserDetail};
