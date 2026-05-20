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

function Square({value, onSquareClick}) { // This will pass in a value from board
  
  // const [value, setValue] = useState(null);

  // function handleClick() {
  //   setValue('X');
  //   /*
  //       By calling this set function from an onClick handler, 
  //       you’re telling React to re-render that Square whenever
  //        its <button> is clicked. After the update, the Square’s
  //         value will be 'X', so you’ll see the “X” on the game board.
  //         Click on any Square, and “X” should show up:
  //   */
  // }

  return (
    <button 
    className='square'
  
    onClick={onSquareClick}>
      {value}
    </button>
  );
  // {} - curly brases 'escape into javascript'
}



export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  }
  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }
  
  return (
    <>
      <HelloWorld />
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
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


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;

}

}

