function MyButton() { // -- This is a react component - piece of UI, has its own logic and appearance. They are JavaScript functions, which return markup.
    return (
        <button>I'm a button</button>
    );
}



export default function MyApp({user}) { 
    // Because this is default export, it can be imported in other places, under any name like import MyComponent from './BackToBasics' and MyComponent will map to MyApp
    // By doing {user}, you get the user object itself. if you did (user) like i had at first, user in that context actually becomes the entire props object. 
    return (
        <div className="my-new-style">
            <h1>Welcome to my app, {user.name}</h1>
            <MyButton />
        </div>
    )
}
