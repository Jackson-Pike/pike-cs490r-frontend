### Final Project - Reflection.md 

1. **What did you ask the AI to do?**
    As we got later on in the project, and as the views and flows got more complicated, AI really started becoming a critical companion
    and enabled AI driven development. I utilized agents, design and implementation plans, and subagent driven development to manage tokens,
    context engineering, and overall try to provide a more structured, appropriate output. These agents often had review steps which validated
    or critiqued the work of the agent to scan for bugs and inconsistencies. 

2. **What did it do well?**
    AI is great at a lot of things. It has a wide knowledge of patterns and an ability to implement just about all that you could want. It did well 
    with the API - interfacing with the backend and learning what it provided and what the frontend could consume. In the right modes, it was good
    at asking clarifying questions as well, rather than immediately assuming and jumping straight to implementation. It often surfaced
    questions that I hadn't even thought about. 

3. **What did it get wrong or what did you have to fix?**
    Sometimes, on particular things, it would get really bogged down or stuck on certain features or additions. Below I mentioned the horizontal scroll
    shelfs - it really struggled getting that right. In completing this final project, I used superpowers to attempt to create / implement a 'theme' feature
    that would allow preset theme changes to change the colors, fonts, and look and feel of the site. While it overall came up with a good plan and implementation,
    there were a lot of things that ended up missing once the code was written. Certain elements of the existing theme that weren't picked up or changed, etc. 
    Large features like this if not broken down into the right chunks, or done with the right model, leads to worse output and increased iterations. 
4. **What did you learn from working with it?**
    I continue to learn the workings of AI, prompt and context engineering, and overal how to orchestrate AI and agents in order to build strong, robust code. 
    It clearly accelerates build velocity. However, I also learned its limitations, such as those that I've briefly described here. Overall, its additional clarity
    to me that there will always be a need for the devloper. What that role expands to look like in the future is still not 100% clear to anyone I don't think, 
    but I do know that AI is a great tool, but needs the person to use the tool in the right way. 



### Prior
1. **What did you ask the AI to do?**
    For the most part, throughout the intitial development, I would ask it to give me tips and tricks, or help me understand how to do a specific thing, 
    but to let me write the code. I actually changed the 'output style' to learning, and instructed it to give me opportunities to learn and apply. 
    It moments where it did write code, it would leave comments (which you'll see) where it modified my original code, or where it would give me
    human 'TODO's. Pretty cool. In the end, after implementing the frontend logic to connect to the API myself, and the barebones, minimum plain CSS
    that I'm familiar with, that is when i collaborated with AI to take the styling further. (I had a base of what I wanted)
2. **What did it do well?**
    When you give it good context, keep an eye on your context window, and make use of skills and agents, AI does honestly pretty well. I made
    sure that it had access to both my frontend and backend working directors (they're separate). That way it was able to see my architecture 
    and stay on the rails. I used a mix of claude superpowers, brainstorming, and at the end frontend design plugin.

    Some of the simple design, if I gave it direction, it did well. 
3. **What did it get wrong or what did you have to fix?**
    There was one moment when it was really struggling with task, and was wasted almost 100,000 tokens on it cumulative.
    It was at the point when I was just adding some flavorful touches, and wanted a streaming-service-like 'horiontal scroll'
    of my movie posters. *It really struggled with this* and went back and forth between failed attempts. This was on Sonnet 4.6
    I tried with a fresh context window, and it still couldn't figure it out. I had to switch to Opus and a fresh context window, 
    and give it some better prompting for it to implement a working solution. I was pretty surprised at how caught up it got. 
4. **What did you learn**
    In this session, I learned at least for this assignment, a little bit more about the boundaries and the limitations.
    I was honestly pretty surprised when I got stuck on the above bug. But overall, I learned a lot about.
    Learning with AI. My boss at Family Search introduced me to that output style flag in /config 
    where you can tell claude to be more verbose and more of a teacher rather that only a doer. Sometimes too, 
    you have to just stop it when its stuck, and start over on that prompt, rather than let it spin its wheels,
    or spend too much time trying to steer it in the right direction. Also, not trying to do too much with one prompt. 