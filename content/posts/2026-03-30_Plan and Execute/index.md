---
title: "Building Chart Chat with Plan and Execute"
date: 2026-03-30
tags:
  - chart chat
  - generative-ai
  - LLMs
  - plan-and-execute
  - software patterns
  - agentic software
  - programming
thumbnail: "/images/plan-and-execute-diagram.png"
summary: |
  Observability, tool design, and model selection are harder than the orchestration loop. Lessons from building an agentic charting tool with Plan and Execute.
---

This will be the first in a series of articles about a tool I built called Chart Chat. Chart Chat is a conversational chart builder. You give it a data source, describe how you want it visualized, and a clever robot writes all the chart drawing code for you.

![A recording of the Chart Chat application in action][image1]

This first article will be an overview of what I built, how I built it, and the ~~friends I made~~ things I learned along the way.

## Plan and Execute

I built this tool to explore an agentic software development pattern called Plan And Execute. Plan and execute breaks an agentic task into three parts:

1. **Plan:** prompt the LLM to come up with a step-by-step plan for completing a complex task.  
2. **Execute:** hand off the first step to another LLM along with the necessary tools to accomplish it.  
3. **Replan:** When the execute step has completed, a third LLM reviews the original plan, the step to be executed, and the result of the execution. If it decides that the work is done, it sends a response to the user and ends the loop. If there is more work, it creates a new plan and returns to the Execute handler.

This is a powerful pattern for building tools like Lovable or Claude Code. It allows LLMs to complete complex, multi-step work without accumulating an unwieldy amount of context. It’s composable, so each handler can be improved independently. It gives the system a chance to reflect on the output and confirm that the requested task has actually been completed. It’s also a great way to burn *a lot* of tokens.

![A diagram of the Plan-and-Execute loop][image2]

At a high level, it’s a pretty straightforward pattern. The core loop only needs three prompts, most of the tool use is limited to the execute step, and you can review the plan as it goes along to make sure your agents aren’t going completely off the rails. LangGraph even had [a tutorial](https://web.archive.org/web/20260113130650/https://langchain-ai.github.io/langgraph/tutorials/plan-and-execute/plan-and-execute/) for how to set it all up (although they’ve since taken it down). As with most software, though, the devil is in the (implementation) details. Plan-and-execute is simple in concept, but the real work is in tooling, observability, and model/harness tradeoffs.

## Each part comes with a distinct set of challenges

[Plan](https://github.com/erikwiffin/chart-chat/blob/main/backend/app/llm/plan.py) is the least complicated of the three, but it comes with something of a cold start problem. You need to give the LLM enough context that it can make a reasonable plan to hand off to the Execute agent, all while not knowing what your user is going to ask for. The planner also has to have some idea of the capabilities of the Execute agent, so that it doesn’t plan a step like “search the web for…” when the Execute agent isn’t connected to the internet. It also runs at two different points in the project lifecycle: it’s the first step to execute on a brand new project, but it also gets invoked mid-project and needs to handle conversation history. These two modalities are different enough that they could potentially be served better by two separate prompts: one for a blank canvas with “getting started” guidance, and another with less built-in instruction but supplemented by conversation history.

[Execute](https://github.com/erikwiffin/chart-chat/blob/main/backend/app/llm/execute.py) is where the bulk of the work is being done and this is where I spent the bulk of my time writing tools for the agent to use. Again, there’s a balancing act: too few tools, and the agent can’t complete the task; too many, and it starts calling them just because it can. I didn’t get to it in this project, but I think it would be helpful to add a classifier for the plan step. Then, a router could dispatch a different prompt and set of tools depending on the work to be performed. In Chart Chat, data manipulation and visual configuration are different enough operations that they could benefit from more curated instructions.

Once the other two pieces are working, [Replan](https://github.com/erikwiffin/chart-chat/blob/main/backend/app/llm/replan.py) might be the most straightforward. It mirrors a lot of logic from the planner, with an additional step of “check your work, decide if we’re done or if we need a new plan”. The challenge with Replan is testing. Plan and Execute can both work off a single input: either the human-provided task or the planner-provided plan step. Replan needs the full intermediate state: the task, the plan, the output from the executor. It's a lot of state to assemble, but outputs from the planner and executor can be used to bootstrap a testing context.

## Debugging and Observability are key

This is obvious, but it still bears repeating. There are a lot of moving parts here and they all feed into each other. The three-agent loop is complicated enough, but this is an asynchronous workflow that has to coordinate chart state management, streaming LLM responses, pushing updates to the UI, and possible user interruption at any point.

![LiteLLM dashboard showing prompt logging and cost tracking][image3]

I used LiteLLM as an LLM gateway because it gave me prompt logging, tagging, cost tracking, and was easy to set up and run locally. Using it to review LLM requests and responses was invaluable while debugging multi-step executions with chains of tool calls. It was also helpful as an LLM router, letting me switch model providers with a simple configuration change. All that being said, the out-of-the-box logging view leaves a lot to be desired. If I keep working on this project, a custom UI that consumes LiteLLM's API and is tailored to these requests would go a long way toward making the debug loop manageable.

```bash
$ uv run chart-chat plan 19 "Filter out non-coal commodity types"

Planning: "Filter out non-coal commodity types"

Plan steps:  
  1. Identify the field name by inspecting the dataset emissions.csv to determine the exact field name used for commodity types and the specific string value used to represent coal.  
  2. Add a filter transform by modifying the chart specification to include a transform array at the top level.  
  3. Define the filter condition within the transform array by adding a filter object using expression syntax to retain only records where the commodity is coal.  
  4. Verify the output by rendering the chart to ensure only coal data points are displayed and axis/legend scales are updated.
```

In the same spirit, something I should have set up much earlier was a straightforward way to run individual steps in isolation. Eventually, I wrote separate CLI scripts for plan, execute, and replan, but it took me a long time to do it because of a fundamental mistaken assumption about the complexity of the work. Replan needs a lot of context to run. It needs the original user input, a plan, and the results of each execution run. Each one of those is a block of text, and not something I wanted to type into iTerm by hand. Because replan is so heavy, and plan and execute are at the same level of abstraction, I mistakenly assumed that plan and execute would require a similarly heavy lift to set up. In reality, both of them take two parameters: a project id and a single string, either the user input or a plan step. Once I set those up, it was pretty trivial to scaffold all the required parameters for a replan call by capturing the inputs and outputs of plan and execute.

Finally, if I were to start this project over, I probably wouldn’t use LangGraph. The tutorial I followed made it easy to get up and running quickly and their graph structure maps very nicely to the plan-execute-replan loop. However, LangGraph makes it difficult to control exactly what went into each API call and to inspect exactly what came back. LangGraph abstracts away a crucial part of the application, but doesn’t do much to lower the essential complexity of what is being built.

## You’re only as good as your tools

Execute relies on LLM tool use to actually accomplish its goals. At this point, adding functionality to Chart Chat would mostly mean writing new tools for the LLM to use. Here are a couple that ended up being helpful.

### search\_vega\_lite\_docs

For Chart Chat’s underlying data model, I decided to go with [Vega-Lite](https://vega.github.io/vega-lite/) for my internal chart representation. It represents charts as declarative JSON objects, which felt like a good fit for incremental chart building while avoiding the overhead of needing to handle all of the complexity of sandboxing a language execution environment.

Commercial language models seem to have a pretty solid grasp of the Vega-Lite format, but it’s not perfect or exhaustive. One of the tools I knew I’d need to make available if I didn’t want to give my agent full web-search capability was a way of looking at Vega-Lite documentation.

Vega-Lite’s docs are available as [markdown files in their GitHub](https://github.com/vega/vega-lite/tree/main/site/docs), so I was able to download them and load them into a SQLite db and make them searchable. There’s room for improvement here: chunking would help save tokens and reduce context pollution, semantic search would return better results for worse queries, and with more usage data there’s probably a lot of benefit to be gained from writing custom documentation that specifically addressed recurring failure modes.

As with the agents, having a CLI for documentation search was a big help in debugging.

```bash
$ uv run chart-chat search-docs "mark"  
Marks are the basic visual building block of a visualization.  
...
```

### edit\_chart

One of the decisions I had to make in this project was determining how my agents would actually modify the chart schema. I could have treated the chart definition as a plaintext file and built a set of tools to edit it that way (find/replace, line diffs, etc), but JSON conveniently comes with its own standard for expressing changes: JSON Patch. Using JSON Patch meant I never had to worry about the chart definition becoming invalid JSON.

This patch format was another advantage to using Vega-Lite. Originally, I was considering using [plotnine](https://plotnine.org/) for this project. It’s an extremely powerful library and the declarative, layer-based approach felt like it would have aligned well with modeling a chart as a concept rather than making a general-purpose code editor that just happened to make a lot of charts. Unfortunately, the way that plotnine implements their DSL in Python meant that I’d either have to build an extensive and granular tool library for every single plotnine function, write my own wrapper spec on top of it, or give up and accept all the challenges that came with a fully general code editor.

### render\_chart

Most (all?) commercial models (and many open-weight models) are multimodal, meaning they can accept both text and images as input. Since charts are primarily a visual medium, I wanted to give my agents a way of previewing their work to confirm that changes were properly applied and hopefully to catch bugs. One downside of going with the Vega-Lite format is that the tools for rendering a Vega-Lite chart are primarily written in JavaScript and my agent harness is in Python.

There are two main libraries for working with Vega-Lite in Python: [vl-convert](https://github.com/vega/vl-convert) and [Altair](https://altair-viz.github.io/). Both of them need to embed a JavaScript runtime in order to generate a png and in my experience that ended up being pretty slow (multiple seconds per render). Since the agent loop contains a lot of “make a change, preview the chart” cycles, those extra seconds add up fast.

I ended up using vl-convert to generate an SVG, then [CairoSVG](https://www.courtbouillon.org/cairosvg/) to convert that SVG to a PNG. I’m not convinced this was the best possible solution and it still slows down a lot when specs start to include multiple layers, but it dramatically sped things up for most of the charts that I was testing with.

## Language Models and Agent Harnesses

This is a lot of words to spend without mentioning the choice that probably matters most in an agentic application: the model(s). This is simultaneously the most important choice and the easiest to change after the fact. It governs cost and speed of execution. It impacts the prompts that need to be written and the capabilities of the application.

I started this project using Claude Sonnet 4.5. It’s Anthropic’s middle-of-the-road model, offering a healthy balance between cost, speed, and intelligence. It worked really well and papered over a lot of my early not-so-clear-just-get-it-working prompting efforts. Unfortunately, for a toy project like this I didn’t really want to be spending multiple dollars a day on tokens, so I went looking for something else. My next move was to swing to the opposite end of the spectrum and try to get Chart Chat working with open-weight models running locally on my machine that I could run for “free”. The best coding model I could fit in RAM and run at a reasonable speed was Qwen3.5-35B-A3B. It worked fine for planning and execution, but I could not get it to obey the schema instructions for the replan response.

Ultimately, I landed on Google’s Gemini 3.1 Flash-Lite Preview. It’s a fast, cheap model, smart enough for the task at hand, and capable of following a schema definition.

As I was writing this article, Anthropic published a guide for [harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) written by Prithvi Rajasekaran. There’s a lot of overlap between their guidelines and my project despite the intended scale (Anthropic: hours, hundreds of dollars per run. Me: minutes, pennies). One of the biggest parallels though is how much the capabilities of your chosen model impact what you need to provide at the orchestration layer. Prithvi started his guide with the 4.5 generation of Claude models and explores the differences between working with Sonnet and Opus at the time. Midway through his exploration, Opus 4.6 was released and it is so much more capable that he was able to remove entire concepts from his harness and move his evaluator check to a single run at the end instead of multiple times at every step.

I never achieved any structural changes that significant, but my first pass with Sonnet was pretty sloppy and Sonnet handled it without any problem. Switching to local models forced me to be a lot more specific with my prompting and a lot more careful about what was in or out of context.

## What have we learned?

My biggest takeaway from this project was that even for a small project like this one, I have to be extremely on top of observability and debuggability to make any meaningful progress. The orchestration loop is simple, but it encompasses a long chain of smaller steps, any of which can fail and completely derail the larger system. Larger models gave me more slack to accommodate sub-component weaknesses at the very real financial cost of paying more per token. Human intelligence and effort during development trade off for machine intelligence and effort during operation.

Part 2 in this series will be a bit more philosophical, digging into some conceptual challenges agent orchestration faces and how some traditional software development practices struggle to incorporate LLMs productively.

[image1]: chart-chat-recording.gif
[image2]: plan-and-execute-diagram.png
[image3]: lite-llm-screenshot.png