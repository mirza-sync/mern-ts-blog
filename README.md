# MERN Typescript Blog

> Me practicing MERN stack with Typescript

This is a CRUD blog webapp from the [MERN Typescript BLOG Application](https://www.youtube.com/playlist?list=PLdSnLYEzOTtqWFNLg7M8iwhOBROHKXWIp) tutorial.

## Objective

- To learn how to write REST API usign Express from scratch.
- To learn authentication using JWT.
- Learn MongoDB.
- Practice Typescript.

## Logs

- This tutorial was outdated. In part 3 of the video, the instructor demonstrated setting up react router from scratch, along with custom Typescript interfaces. But the latest React router uses different implementation with different prop types. Hence I have a few options:

  1. Downgrade react-router to follow the tutorial.
  2. Abandon this project. Find a new and better tutorial.
  3. Find a tutorial of setting up latest react-router and combine it with this tutorial.

  > Still don't know what to do yet. Maybe I'll go with option 2.

- **Update** : I've chose option 1, which is to downgrade to react-router-dom v6 to v5. There's already pinned comment that ask viewers to use v5. But I don't realize this lol. Maybe should've read the comments before watching a video.

- Btw this tutorial kinda sucks. There's bunch of interfaces created in seperate files. Makes me feel like doing Java. I prefer to create the type/interface in the file that uses it. Then will consider refactor out the types if it is used in multiple places.

- The instructor uses Context API to manage user state. But he kinda mixing it with Redux pattern by writing reducers and dispatching actions. Is this pattern effective?

- I never understand callbacks. For example, in an event listener function, where does the "event" argument came from? Who declared it there in the first place? When going through the tutorial and doing the authenticate method, I need to write a callback from scratch. That's the moment that I get the gist of what callbacks are.
