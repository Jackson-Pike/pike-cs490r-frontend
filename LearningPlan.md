# React Learning Plan - CS 490R Frontend Development

**Technology:** React (with Express.js backend integration)  
**Timeline:** 4 weeks (May 18 - June 15)  
**Available Time:** ~2-3 hours/weekday (1 PM - 8 PM, accounting for classes), ~4-6 hours/weekend  
**Goal:** Build a working React frontend that connects to your Express REST API with authentication

---

## Context & Approach

You're new to JavaScript, which is React's foundation. This plan prioritizes **understanding over speed**. You'll learn JavaScript fundamentals *alongside* React, using interactive tools that let you code in the browser and see results immediately. By week 4, you'll understand enough to handle API integration and authentication.

### Key Principles
- **Week 1:** JavaScript basics + React fundamentals (Scrimba interactive coding)
- **Week 2:** Components, state, props, and event handling
- **Week 3:** Fetching data from APIs and handling responses
- **Week 4:** Authentication flows and connecting to your Express backend

---

## Week 1 (May 18-24): React Fundamentals & JavaScript Bootcamp
**LFE 2 Due:** Tuesday, May 20 at 9:59 AM  
**Focus:** Get React running. Understand JSX, components, and state basics.

### Learning Goals
- Install Node.js and create your first React app (Create React App)
- Understand JSX syntax and how it compiles to JavaScript
- Build simple functional components
- Learn the difference between props and state
- Write your first interactive React component
- Understand the component lifecycle basics

### Recommended Resources
1. **Scrimba React Course** (FREE, interactive - BEST for learning)
   - Link: https://scrimba.com/learn/learnreact
   - Time: 3-4 hours of core lessons (do Modules 1-3)
   - Why: You code in the browser, see results instantly, which is perfect for learning React
   - Do Module 1 (React Basics), Module 2 (JSX & Components), Module 3 (Props)

2. **React Official Tutorial** (as reference)
   - Link: https://react.dev/learn
   - Time: 1 hour (read "Describing the UI" section)
   - Read this after Scrimba to reinforce concepts

3. **JavaScript Quick Refresher** (if needed - 30 min)
   - Link: https://javascript.info/js (sections: Getting Started, Fundamentals)
   - Only read if you hit JavaScript concepts you don't understand in React examples

### Milestones (check your progress)
- [ ] Node.js and npm installed; `npx create-react-app` works
- [ ] Can create a simple functional component and render it
- [ ] Understand the difference between JSX and regular JavaScript
- [ ] Built a component that uses `props` to display different content
- [ ] Built a component with `useState` that increments a counter on button click

### Weekly Deliverable for LFE 2 (Due May 20)
Create a **simple interactive app** in your GitHub repo:
- A React component that displays "Hello React!" and has:
  - At least one piece of state (e.g., a counter, color, name input)
  - A button that changes that state
  - Display the state value on the page
- Commit your code to GitHub as you go
- Screencast: Show the app working, explain what state is, and show your Learning Plan

### Time Allocation
- Monday-Thursday: 2 hours/day on Scrimba (8 hours total)
- Friday: 1 hour review + set up GitHub repo
- Weekend: Build the interactive component for LFE 2 (3-4 hours)
- **Total: ~12-13 hours**

---

## Week 2 (May 25-31): Components, Events & Styling
**LFE 3 Due:** Wednesday, May 27 at 9:59 AM  
**Focus:** Move beyond simple state. Build multi-component apps. Handle forms.

### Learning Goals
- Lift state up and pass data between components
- Handle form inputs and onChange events
- Conditionally render components
- Add CSS and styling to React apps
- Build a small multi-component project from scratch
- Understand component composition

### Recommended Resources
1. **Scrimba React Course Modules 4-5** (2-3 hours)
   - Module 4 (State & Props in Depth)
   - Module 5 (Events & Forms)
   - Why: Continues where you left off; very interactive

2. **React Official Docs: Responding to Events** (30 min)
   - Link: https://react.dev/learn/responding-to-events
   - Reference for event handling patterns

3. **CSS with React** (1 hour)
   - Basic approach: Import CSS files
   - Scrimba will cover this, but also check: https://react.dev/learn#styling

### Milestones
- [ ] Created a multi-component app (parent + child components)
- [ ] Successfully passed props from parent to child
- [ ] Built a form component that updates state on input change
- [ ] Used conditional rendering (if/else or ternary operator) in a component
- [ ] Added CSS styling that makes your app look presentable

### Weekly Deliverable for LFE 3 (Due May 27)
Build a **small project** that demonstrates all Week 2 concepts:
- **Idea examples:**
  - A To-Do List (add/remove/check off items)
  - A Simple Quiz (multiple questions, score tracking)
  - A Form-Based App (e.g., user profile builder)
- Requirements:
  - At least 2 components (parent + child)
  - Handle form input with state
  - Conditional rendering (show/hide elements based on state)
  - Some CSS styling
  - Commit incrementally to GitHub

- Screencast: Demonstrate the app working, explain what you learned about components/props, check off milestones

### Time Allocation
- Monday-Wednesday (before LFE 3 due): 2 hours/day learning + 1 hour building (9 hours)
- Thursday-Friday: Build your project (4 hours)
- Weekend: Polish & screencast (2 hours)
- **Total: ~15 hours**

---

## Week 3 (June 1-7): Fetching Data & API Integration
**Learn Frontend 4 Due:** Wednesday, June 4 (projected)  
**Focus:** Connect to backend APIs. Learn async/await. Handle loading and error states.

### Learning Goals
- Understand async/await and Promises (critical for API calls)
- Use fetch() or axios to call APIs from React
- Handle API responses and update component state
- Show loading states while data is being fetched
- Handle and display errors gracefully
- Make authenticated API requests (prep for next week)

### Recommended Resources
1. **Scrimba: Async/Await & Fetch** (if available) OR
2. **React Docs: Fetching Data with useEffect** (CRITICAL)
   - Link: https://react.dev/learn/synchronizing-with-effects
   - Time: 1.5 hours
   - This is the foundation for API calls in React

3. **JavaScript.info: Promises, Async/Await** (2 hours)
   - Link: https://javascript.info/promise-basics
   - Read: Promise Basics, Async/Await sections
   - Why: You need to understand async concepts to work with APIs

4. **Building a Real API Call Example** (1 hour)
   - Use a public API (e.g., JSONPlaceholder, OpenWeather) to practice
   - Example: Fetch a list of posts, display them in your React app

### Milestones
- [ ] Understand what `useEffect` does and why it's needed
- [ ] Successfully fetched data from a public API using fetch()
- [ ] Displayed fetched data in a React component
- [ ] Showed a loading state while data is being fetched
- [ ] Handled and displayed error messages when API call fails
- [ ] Made a request that includes authentication headers (prep for week 4)

### Weekly Deliverable for Learn Frontend 4 (Due June 4)
Build a **data-fetching app** that pulls from an API:
- **Option 1 (Simpler):** Use a public API (JSONPlaceholder, OpenWeather, etc.)
  - Fetch and display a list of items (posts, weather, repos, etc.)
  - Show loading state while fetching
  - Show error state if fetch fails
  
- **Option 2 (Recommended - Align with your backend):** Start testing with your Express API
  - Fetch data from your Express server (that you're building in parallel)
  - Display the response
  - Show loading/error states

- Screencast: Show data being fetched and displayed, explain async/await, demonstrate error handling

### Time Allocation
- Monday-Wednesday: 2 hours/day learning async concepts (6 hours)
- Thursday-Friday: Build your data-fetching app (4-5 hours)
- Weekend: Refine and record screencast (3 hours)
- **Total: ~13-14 hours**

---

## Week 4 (June 8-15): Authentication & API Integration
**Learn Frontend 5 Due:** Wednesday, June 11 (projected)  
**Focus:** Build login/authentication. Connect to your Express API with auth tokens.

### Learning Goals
- Understand authentication flow (login, store token, use token in requests)
- Build a login form that sends credentials to your backend
- Store authentication tokens (localStorage/sessionStorage)
- Add Authorization headers to API requests
- Protect routes (redirect to login if not authenticated)
- Handle logout
- Integrate fully with your Express backend

### Recommended Resources
1. **JWT Authentication in React** (2 hours)
   - Link: https://blog.logrocket.com/jwt-authentication-best-practices/
   - Or watch: "JWT Auth in React" tutorials on YouTube

2. **React Context or State Management for Auth** (1.5 hours)
   - Simple approach: Store token in React state (useState)
   - Or: Use Context API for global auth state
   - Recommended: Start simple with useState, upgrade to Context if needed

3. **Your Express API Documentation** (30 min)
   - Review the auth endpoints your API will provide
   - Understand what credentials to send and what response to expect

### Milestones
- [ ] Built a login form component that collects username/password
- [ ] Sends credentials to your Express API
- [ ] Stores the returned authentication token
- [ ] Adds Authorization header to subsequent API requests
- [ ] Built a logout function that clears the token
- [ ] Created a protected component (redirects to login if not authenticated)
- [ ] Successfully logged in, made authenticated API requests, logged out

### Weekly Deliverable for Learn Frontend 5 (Due June 11)
Build a **complete authenticated React app** that connects to your Express backend:
- **Login Screen:** Username/password form
  - Sends POST request to your backend `/login` endpoint
  - Stores token on successful login
  - Shows error message on failed login
  
- **Dashboard/Protected Area:** Only visible after login
  - Displays authenticated data from your API
  - Has a logout button
  - Makes authenticated requests to your backend
  
- Requirements:
  - At least 2 pages/screens (login + authenticated content)
  - Proper error handling
  - Token stored and used correctly
  - Successfully communicates with your Express backend

- Screencast: Demonstrate login flow, show authenticated request, explain how tokens work

### Time Allocation
- Monday-Wednesday: 2 hours/day learning auth concepts (6 hours)
- Thursday-Friday: Build auth + integrate with backend (5-6 hours)
- Weekend: Test everything, refine, screencast (3 hours)
- **Total: ~14-15 hours**

---

## Integration with Your Express API

**Timing:** Your backend assignments (Express serves an API) are due May 23 (Phase 1-3). By Week 3, you should be building your backend, so you can use it in Week 3-4 frontend work.

**Recommended Backend Schedule:**
- Week 1: Basic CRUD API for one entity (do this alongside LFE 1-2)
- Week 2-3: Add related models and authentication endpoints
- Week 4: Frontend calls your backend endpoints

**Authentication Endpoints Your Backend Should Have (by Week 3):**
- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Return JWT token
- `GET /api/protected` — Example protected route

---

## GitHub Repository Setup

Create a repository called `cs490r-frontend` (or similar) with this structure:

```
cs490r-frontend/
├── LearningPlan.md          (this file)
├── week1/                   (LFE 2 deliverable)
│   ├── src/
│   └── README.md
├── week2/                   (LFE 3 deliverable)
│   ├── src/
│   └── README.md
├── week3/                   (LFE 4 deliverable)
│   ├── src/
│   └── README.md
├── week4/                   (LFE 5 deliverable)
│   ├── src/
│   └── README.md
└── final-project/           (Create a Frontend assignment)
    ├── src/
    └── README.md
```

**Alternatively:** Use separate repos for each week (either way is fine).

---

## Weekly Time Breakdown (REALISTIC)

⚠️ **Important Context:** This assumes you're ALSO doing CS 490R API work (~4-5 hrs/week) + CS 420 (~2-3 hrs/week). See `CS490R_Time_Analysis.md` for the full picture.

| Week | Frontend Deadlines | Frontend Hours | Context | Peak? |
|------|-------------|------------------|---------|-------|
| **1** | LFE 1 (May 13) | 4 hours | Choose tech, tutorial, plan | Easy |
| **2** | LFE 2 (May 20) | 6-8 hours | API due May 23! Week 2 is PEAK | **CRUNCH** |
| **3** | LFE 3 (May 27) | 8-10 hours | Continue learning + practice | Normal |
| **4** | LFE 4 (Jun 3) | 8-10 hours | Data fetching + integration | Normal |
| **5** | LFE 5 (Jun 10) | 8-10 hours | Auth + full backend connection | Normal |
| **Total** | | **34-42 hours** | Spread across 5 weeks (May 13 - Jun 10) | |

**Key Adjustment:** LFE 1 is due **May 13** (earlier than I said!), giving you 5 weeks of learning from May 13 to June 10.

---

## Tips for Success

### JavaScript Learning Curve
- React relies heavily on modern JavaScript (ES6+: arrow functions, destructuring, spread operator)
- Don't skip the JavaScript. It's unfamiliar, but it will click by week 2-3
- Use Scrimba because it forces you to write code, not just watch

### Avoiding AI Pitfalls
- **Use AI for:** Explaining concepts, debugging errors, understanding error messages, reviewing your code
- **Avoid:** Asking AI to write your whole component; use AI-generated code only if you can explain every line
- **After fetching from API:** Before copy-pasting AI code, ask it to explain what each part does

### Testing with Your Backend
- Start Week 3 with a simple public API (JSONPlaceholder) to learn fetching without backend complexity
- By Week 3 end / Week 4 start, you'll be ready to connect to your Express API
- Use Postman or REST Client (VS Code) to test your API before connecting React

### Time Management
- Internship ends at 1 PM; you have 1 PM - 8 PM (7 hours) on weekdays
- Classes: Tues/Thurs 12-2 PM (CS 420), Tues 3-4 PM (CS 490R)
- **Realistic daily schedule:**
  - 1-2 PM: Classes or lunch
  - 2-4 PM: Learning (2 hours) — Scrimba, React docs, tutorials
  - 4-5 PM: Break/other class prep
  - 5-7 PM: Building/practicing (2 hours) — Code your project, commit
  - 7+ PM: Free/other classes
- **Weekends:** 4-6 hours per day if possible (Saturday/Sunday)

### Recording Screencasts
- Use QuickTime (Mac) or OBS (Windows/Mac/Linux) — both free
- Record short demos (2-4 minutes) showing your app working
- Explain one concept you learned in your own words
- Show your GitHub and LearningPlan progress

---

## Resources Summary

| Resource | Type | Time | Purpose |
|----------|------|------|---------|
| Scrimba React | Interactive Video | 3-4 hrs | Learn React fundamentals with instant feedback |
| React Docs (react.dev) | Official Docs | 2-3 hrs | Reference, concepts, best practices |
| JavaScript.info | Tutorial | 1.5 hrs | Async/Await, Promise basics |
| YouTube "React Hooks" | Video | 1 hr | Additional explanation (if needed) |
| Your Express API | Backend | Parallel | Test API integration in Weeks 3-4 |
| Public API (JSONPlaceholder) | Test API | Week 3 | Practice fetch without backend setup |

---

## Success Criteria

By the end of Week 4, you should have:
- ✅ A GitHub repository with 4 weeks of work, each with meaningful commits
- ✅ A React app that fetches data from an API
- ✅ A login form that authenticates with your Express backend
- ✅ Protected routes that require authentication
- ✅ Understanding of React fundamentals (components, props, state, hooks, async code)
- ✅ Confidence to extend and debug your frontend code

---

## Questions or Blockers?

If you get stuck:
1. Check React docs first (react.dev)
2. Search for the exact error message
3. Use AI to explain the concept, but don't ask it to write code
4. Ask in Discord/office hours if stuck for >30 min

Good luck! 🚀
