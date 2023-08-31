import React from "react"

export const ParseJson = () => {

    fetch(`${process.env.REACT_APP_SECRET_NAME}`, {
      headers : { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }).then(function(response){
        return response.json();
      })

      .then(function(myJson) {
      });
    
}
