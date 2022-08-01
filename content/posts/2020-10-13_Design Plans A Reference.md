---
title: "Design Plans: A Reference"
date: 2020-10-13
tags:
  - design
  - move slow to go fast
  - programming
thumbnail: "/images/sharon-mccutcheon-eMP4sYPJ9x0-unsplash.jpg"
---
When confronted with a complicated task, the first response of any developer is to dive in and start coding. This is _precisely the wrong thing to do_. I might sound hyperbolic, but it’s true. Every single design plan I have ever seen has resulted in a better understanding of the problem, and more importantly, a better solution delivered faster.

### What is a design plan?

A design plan is a short document describing a proposed implementation of a new feature or refactoring. They’re a developer’s equivalent of an artist’s sketch or a writer’s outline. A good design plan will cover three things:

- **What needs to change?** Be specific here, and identify which files/modules/functions/classes will need to change.
- **What is the flow of information?** Having identified the parts of the codebase that will need to change, how will information need to be passed between them? It’s useful at this step to try and identify the minimum requirements for each piece to fulfill its responsibilities.
- **What is still unknown?** Even with a plan, some things can’t be known until they are implemented. Examples of these unknowns are things like performance characteristics - is the simple algorithm fast enough, or will we need to do something more complicated. Third-party libraries and APIs can also present as unknowns.

### Why write one?

Design plans are a manifestation of the principle “move slow to go fast”. Work done carefully and deliberately will be more efficient in the long run than the alternative. The act of putting together a design plan forces you to stop and think. With a better understanding of the problem and a road map forward, you can avoid writing and rewriting the same code as each path turns into a dead end.

They are also an opportunity to get an early check-in from coworkers. Someone else may have a better sense of this part of the codebase or know a more efficient way to solve the same problem. By documenting your planned approach, you can share it with them _before_ building something you’ll only have to take apart later.

### What is it not?

It’s not pseudo-code. It doesn’t need to be so granular that you cover every operation that your code will eventually call.

It’s not a high-level project architecture. Those are good too! But good design isn’t something to be set aside once a project is underway.

### An Example:

In this example, I am pretending that I have an existing TODO List application written with React/Redux. I’m planning to add a feature where some TODO items will be reminders. They’ll look pretty similar to regular TODO items, but if I’m logged into the app when they reach their deadline, I’ll get some kind of alert.

#### View

- **Updated** - TodoItem.jsx - Show the reminder time.
- **Updated** - AddTodoForm.jsx - Add an optional form item for reminder time.
- **New** - ReminderAlert.jsx - This is the component that will show alerts when reminders reach their deadline. It will need to:
  - componentDidMount - set a configurable interval to check if any reminders have reached their deadline since the last time we checked.
  - componentWillUnmount - make sure to clear the interval to prevent memory leaks
  - If a reminder has reached its deadline, add it to an array in the component’s state.
  - Render any reminders in the state array. If the user dismisses a reminder, remove it from the array.
#### Redux

- **Updated** - The SAVE_TODO action will need to include the optional reminder time.
- **Updated** - Add a selector for reminders so that they can be passed to the new ReminderAlert component.

#### Data Flow

![Data Flow Diagram](/images/design-plan-data-flow.png)

#### Unknowns

- What is the correct interval period? 1 second? More/less?
- What happens to intervals if the computer goes to sleep? Are they batched up or skipped?

### Conclusion

The above plan is pretty rough, and despite describing a non-existent codebase, it didn’t take me long to write. But it describes most of what I’m going to have to do and gives me something to show to my coworker when I go to them and say, “I think my ReminderAlert component is doing too much.”

I have yet to find any single technique for junior and mid-level developers that will improve code quality as significantly as writing design plans. For senior developers, I have yet to regret writing one and can think of several off-hand that I wish I had written.

### Updates

- 2022-08-01 - Some companies have an official process for writing these documents and published templates for what they should include. Gergely Orosz has a fantastic write-up on [Companies Using RFCs or Design Docs and Examples of These](https://blog.pragmaticengineer.com/rfcs-and-design-docs/)
