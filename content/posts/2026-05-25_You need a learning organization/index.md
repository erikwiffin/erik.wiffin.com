---
title: "You are Failing at AI Because You Haven’t Built a Learning Organization"
date: 2026-05-25
tags:
  - Chart Chat
  - AI
  - LLMs
  - Management
  - Strategy
summary: |
  LLMs have broken the traditional software playbook: demos are misleading, expertise is shifting too fast to hire for, and the conditions surrounding AI adoption are the worst possible for building the learning organization you actually need.
---
Stop me if you’ve heard this one before. Your boss comes to you and says “This AI thing, it’s kind of a big deal, we should do an AI.” So you do an AI. 

You connect a chat bot to a knowledge base, you add a sparkle emoji to a text box, whatever. You do an internal demo, and it’s *amazing*. “Wow, this is basically magic.” So obviously, you ship it. 

It works for some users, but it mostly fails in weird ways that no one expects. Your team makes an effort to fix it, but priorities have shifted, and it’s slowly forgotten.. 

A couple quarters later, someone else says “we should do an AI,” and the whole cycle starts over.

Recently, I’ve written about an AI app I built called Chart Chat. Parts [one](https://erik.wiffin.com/posts/building-chart-chat-with-plan-and-execute/) and [two](https://erik.wiffin.com/posts/your-ai-agent-is-a-distributed-system/) are technical dives into how I built it and the lessons I learned along the way. Now, let’s take a look at how developing a tool like Chart Chat would play out in an organization. You won’t find any code or architecture diagrams here.

### Why AI development doesn't work the way you think

There’s a reason my opening anecdote sounds familiar. In a traditional software development project, we could be confident  that a proof of concept meant that something was possible and that an impressive demo could be translated into working software. Many software projects still failed. The [Pareto Principle](https://en.wikipedia.org/wiki/Pareto_principle) guaranteed that however promising your demo, there was still lots of work to do. But the process was familiar and those of us with experience had a gut sense of the work ahead. 

LLMs have completely destroyed that intuition.

**Prototyping speed is misleading.** LLMs have dramatically accelerated how fast you can get a working demo. An afternoon of work can produce something that looks like 80% of the finished product. But the remaining 20% takes longer than it used to–it’s more complex than it appears and our estimates aren’t prepared to capture it.

**The normal development sequence breaks down.** In traditional software, you can build an initial version, clean it up, and optimize it, roughly in that order. With AI systems, these phases collapse into each other. Quality problems cause functional failures. Speed is a prerequisite for debugging, not a polish step.

**The cost of the demo is not the cost of production.** The model that made the demo look great might be too expensive to run at scale. Cheaper models introduce new categories of failure.

I experienced all of this while building Chart Chat. I had a working end-to-end demo in a few hours. It had complicated state management that would have taken me all day if I’d been doing it by hand. I was able to pull together a couple libraries and have “an agent” plan and do work in response to a simple prompt. 

I then spent the next couple of weeks chasing weird edge case bugs like “don’t draw an x-axis so big that it’s mostly representing values outside of our dataset”. [Like herding cats](https://dl.acm.org/doi/10.1145/3563657.3596138), I’d fix one bug only for an old one to resurface.

### Nobody is an expert yet

None of the above issues are insurmountable, but as with everything, it will take time to develop the experience and intuition to make working with LLMs second nature. In the meantime, your instinct is going to be to hire someone who is already there. Or to buy a course for your team, and then execute. That playbook won’t work here.

The landscape is shifting faster than expertise can take root. The tools your team learns this quarter will be obsolete next quarter and best practices are being written in real time.

I see a few patterns of failure showing up in response to this situation:

**Hire an AI person, and they’ll handle it.** The problem is, you don’t know the field well enough to evaluate them, and you can’t rely on a track record that is *at best* 3 years old, built mostly on technology that is *already out of date*.

**Wait until this matures.** It feels prudent in the moment, but it means you’re falling behind competitors who are learning by doing. The learning itself is the asset, and you can’t catch up by reading about it later.

**Take a single training course.** A course or a couple blog posts might be enough to jump start things if you’re far enough behind, but the best models are never more than a couple months old and the patterns for working with them change almost as quickly. One-time  “training” won’t help you keep up with the rapid pace of change in this environment.

This is an emerging field and advantage is built on how quickly you can identify mistakes and course-correct. Not by how many you can avoid.

I’ve been working with natural language processing since before LLMs existed. The state of the field now looks *nothing* like it did when I started. Chart Chat would not have been possible as recently as three years ago. Keeping pace has meant building continuous learning into both my professional and personal life. The organizations who win with AI will be the ones who create the conditions for their teams do the same. 

### What a learning organization looks like in practice

In 1996, Amy Edmondson published the results of [a study](https://www.researchgate.net/publication/250959492_Learning_from_Mistakes_Is_Easier_Said_Than_Done_Group_and_Organizational_Influences_on_the_Detection_and_Correction_of_Human_Error) that explored the relationship between teamwork and medication errors in hospitals. She began the study with straightforward expectations: better teams would have fewer errors. What she found was that better teams, as measured by a team diagnostic survey, reported higher error rates, not lower ones. This forced her to reconsider whether better teams actually made more mistakes or were simply more willing and able to talk about them.

The best teams are the ones where people feel safe enough to surface problems, admit mistakes, and discuss them openly. This is true in every field–not just medicine–and Edmondson’s research gives us a useful foundation for building a learning organization: 

**Psychological safety as the substrate.** Learning depends on people’s willingness to ask questions, admit confusion, and report failures. Without that, information stays hidden.

**Slack in the system.** People need space to learn. That means intentionally creating room for curiosity: things like 20% time to work on self-directed projects, cross-team discussions to bring in outside perspectives, and regular retrospectives to reflect on what’s working.Without that breathing room, the learning won’t happen.

**Response to mistakes matters more than mistake rate.** Organizations learn more effectively when they respond to mistakes with analysis and curiosity, rather than with automatic blame. Looking at mistakes this way helps teams separate preventable errors from failures that lead to useful insight.

### You need a learning organization most when it’s hardest to build one

Nothing I’ve written so far is new. No one expects everyone in their company to instantly be AI experts. Mountains of research give us insight into how to build an adaptive and flexible organization that learns from its mistakes.

While all of that is true, it doesn’t mean it’s easy.

We’re living in an echo chamber that’s screaming “if you don’t adopt AI, your competitors will and your company will fail and everyone will get laid off.” This kind of existential pressure is lethal to everything I’ve described so far. Psychological safety is shot. Instead of 20% time, companies are switching to 996 work schedules. They demand certainty, and consider mistakes unacceptable. 

The conditions surrounding AI adoption–urgency, fear, hype, competitive pressure–are the *worst possible conditions* for becoming a learning organization. Yet, *being a learning organization is what matters most right now.*

We have to be intentional about counterbalancing these conditions. That means:

**Creating space for failure when failure feels most dangerous.** Edmondson created a taxonomy of failure. She distinguished intelligent failures (necessary experiments in new territory), basic failures (preventable errors in known domains), and complex failures (systemic breakdowns from multiple factors). The best learning organizations don't lump these together. They minimize basic and complex failures while deliberately increasing the rate of intelligent ones–they know that this is where innovation comes from.

**Giving people time to internalize what they learn.** Speed matters, but sprinting from one experiment to the next without reflection produces motion, not learning. People need time to be thoughtful, to connect what they just discovered to the broader picture.

**Recognizing that your people are going through their own paradigm shift.** Your engineers, designers, and product managers are renegotiating their own relationship with their craft. The tools they mastered are being redefined. That’s disorienting. A leader who treats this adjustment as a problem to manage, rather than a transition to support, will get compliance but not the creative engagement that learning requires.

I have the great fortune of being able to explore new tools without having to report to anyone. That’s a big win for psychological safety. That being said, I’m still listening to the same drumbeat of warnings that AI is going to take all our jobs and that I need to completely reinvent my personal development workflow to keep up. Projects like Chart Chat are how I try to recontextualize this shift into playful learning. The gap between an interesting idea and its tangible expression is smaller than ever, so what do I want to create?

There will be failures. When I finished this project, on a whim, I asked Claude to build me a chart. In about 5 minutes, it made a [better looking chart with fewer bugs](https://claude.ai/public/artifacts/e82b7c40-9c3a-4750-adb1-58232226824e) than anything Chart Chat could. But that’s okay, because today I’m using the tools and techniques that I learned to build an agentic chatbot for a client that’s solving real problems.

### Ask yourself: Is our organization learning?

Do you know how you’re doing as a learning organization? You don’t need to overhaul your organization. But you should be able to answer these questions. If you can’t, then that’s your starting point.

* How long does it take your team to go from “I want to try something” to knowing whether or not it worked? If the answer is weeks, your feedback loops are too slow for how quickly this space moves.  
* When was the last time someone on your team shared a failed experiment? If you can’t think of one, your team may not feel safe failing visibly.  
* When you group your failures into Edmondson’s taxonomy, which group is the biggest? Too many basic failures mean that you’ve underinvested in quality management. Consistent complex failures point to broken communication. A team collecting intelligent failures like badges is a team ready to roll with anything you throw at it.  
* Does your team want the risky projects or the safe projects? Someone needs to keep the lights on, but they should be excited–not anxious–about the experiment with the uncertain outcome.

The companies that succeed with AI won’t be the ones that hire the smartest person or choose the best model. They’ll be the ones that develop the organizational muscle to learn continuously in an environment that’s changing faster than any individual can track.