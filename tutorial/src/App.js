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
    setValue('X');
    /*
        By calling this set function from an onClick handler, 
        you’re telling React to re-render that Square whenever
         its <button> is clicked. After the update, the Square’s
          value will be 'X', so you’ll see the “X” on the game board.
          Click on any Square, and “X” should show up:
    */
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
      <HelloWorld />
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


function HelloWorld() {
  return (
  <>
    <h1>Welcome to Tic-Tac-Toe</h1>
    <p>Hello World!</p>
    <p>This was a tutorial site completed by Jackson Pike
      following along the official React tutorial found <a href='https://react.dev/learn/tutorial-tic-tac-toe#setup-for-the-tutorial'>here</a>
    </p>
    </>
  );
}

}
