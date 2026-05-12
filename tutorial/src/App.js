/* 
As a next step, you want the Square component to “remember” that it got clicked, 
and fill it with an “X” mark. 
To “remember” things, components use state.

React provides a special function called useState that you can 
call from your component to let it “remember” things. Let’s
store the current value of the Square in state, and change 
it when the Square is clicked.

Import useState at the top of the file. Remove the 
value prop from the Square component. Instead, add 
a new line at the start of the Square that calls useState.
 Have it return a state variable called value:

*/
import { useState } from 'react';

function Square() { // This will pass in a value from board
  const [value, setValue] = useState(null);

  function handleClick() {
    console.log('clicked!');
  }

  return (

    <button
     className="square"
     onClick={handleClick}
    >
      {value}
      </button>

  );
  // {} - curly brases 'escape into javascript'
}



export default function Board() {
  return (
    <>
      <div className="board-row">
        <Square   />
        <Square   />
        <Square   />
      </div>
      <div className="board-row">
        <Square   />
        <Square   />
        <Square   />
      </div>
      <div className="board-row">
        <Square   />
        <Square   />
        <Square   />
      </div>
    </>
    );
}
