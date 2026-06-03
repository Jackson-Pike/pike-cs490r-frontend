# React Learning Plan - CS 490R Frontend Development

**Technology:** React (with Express.js backend integration)  
**Timeline:** 4 weeks (May 13 - June 9, 2026)  
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

## 🚨 CRITICAL DATES (HST - Hawaii Standard Time)

| Assignment | Due Date | Due Time | Status |
|------------|----------|----------|--------|
| **LFE 2** | Tuesday, May 19 | 11:59 PM HST | ✅ Submitted |
| **LFE 3** | Tuesday, May 26 | 11:59 PM HST | ❌ Missed |
| **LFE 4** | Tuesday, June 2 | 11:59 PM HST | ✅ Submitted |
| **LFE 5** | Tuesday, June 9 | 11:59 PM HST | Upcoming |
| **Final Project** | Monday, June 23 | TBD | Upcoming |

---

## Week 4 (June 3-9): Authentication & API Integration
**Learn Frontend 5 Due:** Tuesday, June 9 at 11:59 PM HST  
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

### Weekly Deliverable for Learn Frontend 5 (Due June 9, 11:59 PM HST)
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
- **Mon-Fri (June 3-7):** 2 hours/day learning auth concepts (10 hours)
- **Wed-Fri:** 2 hours/day building auth + integrating backend (6 hours)
- **Sat-Sun:** Test everything, refine, screencast (3 hours)
- **CS 420:** ~2-3 hours/week (parallel + exam prep)
- **CS 490R API:** ~1 hour/week (final tweaks)
- **Total Frontend:** ~13-15 hours

---

## Week 3 (May 27-June 2): Fetching Data & API Integration ✅
**Learn Frontend 4 Due:** Tuesday, June 2 at 11:59 PM HST — **Submitted**  
**Focus:** Connect to backend APIs. Learn async/await. Handle loading and error states.

### Learning Goals
- Understand async/await and Promises (critical for API calls)
- Use fetch() to call APIs from React
- Handle API responses and update component state
- Show loading states while data is being fetched
- Handle and display errors gracefully
- Make authenticated API requests (prep for next week)

### Recommended Resources
1. **React Docs: Fetching Data with useEffect** (CRITICAL)
   - Link: https://react.dev/learn/synchronizing-with-effects

2. **JavaScript.info: Promises, Async/Await** (2 hours)
   - Link: https://javascript.info/promise-basics

3. **Building a Real API Call Example** (1 hour)
   - Used GitHub Search API to practice before connecting to backend

### Milestones
- [x] Understand what `useEffect` does and why it's needed
- [x] Successfully fetched data from a real API using fetch()
- [x] Displayed fetched data in a React component using `.map()`
- [x] Showed a loading state while data is being fetched
- [x] Handled and displayed error messages when API call fails
- [x] Made a request that includes authentication headers (`x-api-key`)
- [x] Extracted a child component (`MovieCard`) — parent passes data down via props
- [x] Used conditional rendering (loading / error / data)

### What Was Built
- Movie listing app connected to Express backend (`/api/movies`)
- `App` owns fetch logic and state; `MovieCard` handles display of a single movie
- Loading/error/success states wired up with `useState` + `useEffect`
- `finally` block used to guarantee loading state resets
- Full-width header component (`PikeHeader`) with layout restructure
- Date formatting with `toLocaleDateString`

---

## Week 2 (May 20-26): Components, Events & Styling
**LFE 3 Due:** Tuesday, May 26 at 11:59 PM HST — **❌ Missed**  
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
2. **React Official Docs: Responding to Events** (30 min)
3. **CSS with React** (1 hour)

### Milestones
- [ ] Created a multi-component app (parent + child components)
- [ ] Successfully passed props from parent to child
- [ ] Built a form component that updates state on input change
- [ ] Used conditional rendering (if/else or ternary operator) in a component
- [ ] Added CSS styling that makes your app look presentable

---

## Week 1 (May 13-19): React Fundamentals & JavaScript Bootcamp
**LFE 2 Due:** Tuesday, May 19 at 11:59 PM HST — **✅ Submitted**  
**Focus:** Get React running. Understand JSX, components, and state basics.

### Learning Goals
- Have a React development environment set up with Vite
- Understand JSX syntax and how it compiles to JavaScript
- Build simple functional components
- Learn the difference between props and state
- Write your first interactive React component
- Understand the component lifecycle basics

### Recommended Resources
1. **Scrimba React Course** (FREE, interactive)
2. **React Official Tutorial** (as reference)
3. **JavaScript Quick Refresher** (if needed - 30 min)

### Milestones
- [x] Vite + React development environment set up and running (`npm run dev`)
- [x] Can create a simple functional component and render it
- [◐] Understand the difference between JSX and regular JavaScript
- [x] Built a component that uses `props` to display different content
- [ ] Built a component with `useState` that increments a counter on button click

---

## Integration with Your Express API

**Timing:** Backend assignments due May 23. By Week 3, backend is running and being consumed by the frontend.

**Authentication Endpoints Your Backend Should Have (by Week 4):**
- `POST /api/auth/register` — Create new user
- `POST /api/auth/login` — Return JWT token
- `GET /api/protected` — Example protected route

---

## Weekly Time Breakdown

| Week | Due Date | LFE | Status |
|------|----------|-----|--------|
| **1** | May 19 | LFE 2 | ✅ Submitted |
| **2** | May 26 | LFE 3 | ❌ Missed |
| **3** | June 2 | LFE 4 | ✅ Submitted |
| **4** | June 9 | LFE 5 | Upcoming |

---

## Tips for Success

### Avoiding AI Pitfalls
- **Use AI for:** Explaining concepts, debugging errors, understanding error messages, reviewing your code
- **Avoid:** Asking AI to write your whole component; use AI-generated code only if you can explain every line

### Testing with Your Backend
- Use Postman or REST Client (VS Code) to test your API before connecting React

### Recording Screencasts
- Use QuickTime (Mac) — free
- Record short demos (2-4 minutes) showing your app working
- Explain one concept you learned in your own words
- Show your GitHub and LearningPlan progress

---

## Success Criteria

By the end of Week 4 (June 9), you should have:
- ✅ A GitHub repository with 4 weeks of work, each with meaningful commits
- ✅ A React app that fetches data from an API
- [ ] A login form that authenticates with your Express backend
- [ ] Protected routes that require authentication
- ✅ Understanding of React fundamentals (components, props, state, hooks, async code)
- ✅ Confidence to extend and debug your frontend code
