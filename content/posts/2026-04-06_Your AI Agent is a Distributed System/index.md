---
title: "Your AI Agent is a Distributed System"
date: 2026-04-06
tags:
  - Chart Chat
  - Generative AI
  - LLMs
  - Plan and Execute
  - Software Patterns
  - Agentic Software
  - Programming
thumbnail: "/images/distributed-system.png"
summary: |
  Mid-way through building an agentic application, I got stuck. I found myself needing to make it work, make it right, and make it fast, all at once, and progress was slow.
  Reframing it as a distributed system helped me recognize where my problems were coming from and got me going again.
---

This is Part 2 in [a series](/tags/chart-chat/) of articles I’m writing about an app I built called Chart Chat. [Part 1](/posts/building-chart-chat-with-plan-and-execute/) is a technical breakdown of the agentic software pattern that I used to build the app. This piece will be a bit of a higher-level exploration of a conceptual mistake I made when I started this project that left me feeling stuck and how I had to rethink my approach to get moving again.

On its surface, Chart Chat is a simple application. It has two inputs: a text field and a data source; and two outputs: a response message and a chart. There’s some AI magic in the middle, but that’s “just an API call”, so there’s nothing to worry about.

![System diagram of Chart Chat (simple)][image1]

We’ll get back to that “just” in a minute, so bear with me. I went about building this app the way I normally would: there's a frontend, a backend, an API layer, a database, and a domain model at the heart of it all. Most of these parts are things I’m very familiar with; I [chose boring technology](https://mcfunley.com/choose-boring-technology) for most of the application and saved my innovation tokens for the plan-and-execute loop that I wrote about in Part 1\.

As I got started, most things moved very quickly. Claude Code is great at assembling the boilerplate of an application, I had already worked out the proof of concept of the agent in a Jupyter notebook, and I very quickly had a skeleton of Chart Chat up and running. Right as I got to this point though, everything suddenly got a lot harder and everything started taking a lot more time than I expected.

Debugging was a challenge. I was using LiteLLM to log LLM completions, but sometimes they wouldn’t show up. When they did show up, I would be overwhelmed by long conversation chains that I couldn’t follow, or random requests that consumed orders of magnitude more tokens than I was expecting. When things went wrong, issues took forever to track down and resolving them felt like trying to fix a broken clock through a keyhole.

I was missing something.

## Phase Collapse

Before I get to how I solved my problems and got the project moving again, I’m going to take a quick detour to talk about a well known phrase in software development:

Make it work.  
Make it right.  
Make it fast.  
In that order.

This rule has been around in some form or other since the 1980s. In practice, it means that software developers should first start with a rough working example of their solution. *Then*, clean up code, add error handling, and make sure that it does exactly what it’s supposed to do. *Finally*, implement any performance improvements necessary to get it running fast enough to be fit for purpose. In my experience, any other approach will be an exercise in “one step forward, two steps back”. Highly tuned performance optimizations will be undone when you find out that an edge case can’t be handled in that way. Too much time will be spent on the perfect conceptual model and no software ever ships. And so on.

It’s a good rule.

When I got stuck in Chart Chat, it felt like I was dealing with a collapse in the three phases. Getting my app to “work” wasn’t enough, because if my agent generated a plan that wasn’t “right”, no amount of LLM usage could accomplish my goals. If the application wasn’t “fast”, then it would take too long to reach later steps of complicated plans, and my testing loop would take too long to be useful.

For example: in an attempt to save money, I decided to switch mid-project from using Anthropic’s Sonnet model ($3 / MTok in, $15 / MTok out) to an open weight model running on my local machine (free, if you don’t count my power bill). That switch threw a spotlight on all my sloppy prompting. Sonnet’s pretty smart, and a lot of things just worked because it was capable enough to understand the intent behind conflicting instructions and reliable enough to consistently solve the task at hand.

The first problem I ran into wasn’t even in my Plan-and-Execute harness. It was in a simple “summarize this request” prompt to generate a status update - a task we’ve been running successfully since the early days of GPT 3. The prompt I had written looked something like this:

> Summarize the user request in 4 to 5 words that I can use as a status update. Example: “reviewing data”.

Attentive readers will notice that “reviewing data” is not in fact 4 to 5 words. My local model got trapped in a reasoning loop where it would thrash back and forth between 2 and 5 word summaries as it reacted to conflicting instructions.

In retrospect, this has an easy fix, but it took a while to track down. Because task summarization only happens on an execute step and LiteLLM only logs a request once it’s complete, the observed behavior was that I would send a message to my agent, it would successfully generate a plan, and then it would hang for a couple minutes while my GPU turned into a personal heater.

I had gotten it to *work*. Sonnet was able to generate a summary and my local model sometimes figured it out. But it was not *right*. “Two” is not included in “four to five”. And it was not fast. 5 minutes to see a timeout message makes for a painful debugging process. Right and fast had transitioned from something I could deal with later to things that were immediately necessary to make any progress at all.

## Conceptual breakthrough

So, to recap: I’m exploring a new software pattern, I have a working (sometimes) skeleton of an application, but I’m struggling to make progress and constantly getting derailed by tedious debugging exercises.

When I find myself in this position, I’ve learned to recognize that there’s a good chance I’ve made a fundamental mistake in my model of the problem. [The map did not match the territory](https://en.wikipedia.org/wiki/Map%E2%80%93territory_relation).

It finally clicked for me when I realized that I was building a distributed system. The “simple app” that I thought I was building was actually a complicated set of independent parts that all needed to communicate.

![System diagram of Chart Chat (complicated)][image2]

I don’t want to overplay my hand here; Distributed Systems are *A Thing* and putting that label on my toy project implies certain things about what I’ve built and how all the pieces coordinate. That being said, thinking about this project in that way helped me find a way out of my phase collapse problem and I started making progress again.

Distributed systems come with certain considerations that felt appropriate to this project. How do various services communicate? What is happening inside a single component irrespective of the rest of the system? What state is shared, and how can that be minimized as much as possible?

```
$ uv run chart-chat
Usage: chart-chat [OPTIONS] COMMAND [ARGS]...

  Chart Chat CLI tools.

Options:
  --help  Show this message and exit.

Commands:
  execute           Run one execute step for PROJECT_ID with the given STEP.
  plan              Run the plan step for PROJECT_ID with the given DIRECTIVE.
  replan            Run the replan step for PROJECT_ID with objective,...
```

The first thing I did after this reframe was break each agent into a standalone script that I could run independently of the rest of the system. The phases immediately uncollapsed. I was able to iterate on individual components that let me get them from working, to right, to fast. Even the act of breaking out each individual agent was useful; it forced me to think clearly about what each agent needed to run, and made it obvious when I was passing along more information than needed, just because it was easy. When I stepped back and ran the entire system, it was easier to debug issues since I could confirm that each part was behaving the way it was supposed to.

I don’t think I’ve ever *noticed* phase collapse quite so directly in my work before. I’m sure it’s happened, but approaching Chart Chat as a learning project has made me a lot more aware of the process of the work. Chart Chat is not a commercial tool, no one will ever make any money off it directly. The value of this project will come from the insight I gained; and that insight will inform any future work I do with LLMs and agentic development. Part 3 of this series will explore how this learning mindset is going to be crucial for software developers and even *organizations* as our industry evolves to incorporate these new tools that are suddenly showing up everywhere.

[image1]: chart-chat-diagram-simple.png
[image2]: chart-chat-diagram-complicated.png