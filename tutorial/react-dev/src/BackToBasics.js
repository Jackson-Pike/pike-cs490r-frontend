function MyButton() { // -- This is a react component - piece of UI, has its own logic and appearance. They are JavaScript functions, which return markup.
    return (
        <button>I'm a button</button>
    );
}

export default function MyApp() {
    return (
        <div>
            <h1>Welcome to my app</h1>
            <MyButton />
        </div>
    )
}