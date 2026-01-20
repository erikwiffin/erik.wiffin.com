---
title: Vibecoding Audit
date: 2025-01-19
tags:
  - ai
  - audit
  - testing
  - seo
summary: |
  I spent the holidays building an event platform with an AI "vibecoding" tool to see if the results were actually production-ready. While the speed of development was incredible, my audit reveals the critical gaps—from database safety to broken SEO—that still need a human touch before you hit publish.
---


Over the holidays, I took some time to play around with the AI-powered App building platform [Lovable](https://lovable.dev/). It was obvious within minutes of using it that it could build a lot of functionality very quickly, but less obvious was the answer to the question: would I trust that application to run in production? What follows is a deep dive into the app that I built \- the highs, the lows, and where to go from here.

## The App

Introducing [Gather](https://event-connect-gather.lovable.app/). Gather is an event management platform that lets you schedule public and private events, collect RSVPs, and even charge for promotional placement in search results.

![Gather Screenshot](./gather-screenshot.png)

I built Gather in a couple of hours, spread over a few sessions. Gather is hosted on Lovable’s servers and connects to a couple external services (Mapbox, Stripe, Resend, Supabase). It’s not the most complicated application ever, but certainly more feature complete than what I historically would have been able to put together for a weekend project.

If you want to follow along at home, I’ve made the codebase public [here](https://github.com/erikwiffin/event-connect).

## Audit Summary

Overall, I’m pretty impressed by this application, and the distance between here and something that could be run in production is not far. The biggest issues were a **lack of distinct production and development environments**, a **missing or non-functional test suite**, and some **SEO bugs that would be a significant issue for a B2C application** like this. Nothing I found was anything that couldn’t be resolved in a couple of days by an experienced software developer, and I frequently found myself asking the coding agent to fix issues as I discovered them since the barrier to doing so was so low.

## Production vs. Development Environments

The production application running at [https://event-connect-gather.lovable.app/](https://event-connect-gather.lovable.app/) and the development application connected to the coding agent are running different codebases (Lovable requires you to “publish” your app for any new functionality to go live), but to my surprise were running off of the same shared database. This is a huge issue for any application running with real users that has data that you wouldn’t want to lose.

[![it deleted our production database](./it%20deleted%20our%20production%20database.png)](https://x.com/jasonlk/status/1946239068691665187)

The past year has had several pretty public examples of AI agents dropping production databases, so I have to say that I am not yet prepared to trust them with that kind of access. Beyond that though, it means that features that are currently under development by the coding agent can’t make any database schema changes without potentially bringing down the production application.

*Recommendation: Thankfully Lovable makes all the generated code available in a connected github repository. From here, I would stand up a deployment pipeline connected to a completely standalone production environment.*

## Testing

Without being prompted, the coding agent didn’t write any unit or integration tests. When told to write integration tests for key application functionality, it wrote 39, **25 of which were failing**. Further, the coding agent has no capability to run tests as a part of its development process.

![25 failing tests](./failing-tests.png)

Particularly in the world of AI-driven development, a solid test suite is key to making sure that previously working functionality doesn’t suddenly break when a new feature is added. Other coding agents can even incorporate automated tests into the development lifecycle, checking their own work as they go.

*Recommendation: This is an area where human intervention is probably necessary. Having someone go through the core functionality of the app, verify that it’s working, and write automated tests would give me the confidence to let the coding agent run wild with new functionality. These automated tests should be incorporated into the deployment pipeline mentioned above, particularly since the coding agent can’t run them itself.*

## SEO

This is a consumer facing application where I would expect 90% of inbound traffic to come from searches like “things to do in my city tonight”. Getting the SEO right so that search engines can serve up Gather events for those queries is crucial.

![SEO social previews](./seo-social-previews.png)

One of the last steps in my development process was to ask the coding agent to do an “SEO audit” and resolve any issues that came up. It made some changes, but ultimately I don’t think it fully understood what it needed to do here.

* Meta tags were incorrectly configured, individual pages would show in search engines with the same title and description as the application homepage.  
* The sitemap was missing individual event pages. Unless crawlers lucked out and saw events on the explore page, there would be no way of discovering the long tail of events.

*Recommendation: Fix these issues and set up something like the Google Search Console. The Search Console gives you insights into how the Google crawler sees your website and can be used to debug issues down the road when the events catalog is bigger and these details start to matter more.*

## Everything Else

Those were the three biggest issues, but there’s always something else in software.

* There were a few low-to-medium security issues that were identified and should be resolved. Mostly around making sure that Cross-Site Request Forgery (CSRF) headers were being set correctly.  
* I loaded up the application with some sample events and started running into some performance issues. The coding agent was able to fix the worst of them, but as the application scales performance will continue to be an issue to be resolved.  
* Despite looking very nice on a page by page basis, there were a few design inconsistencies that could and should be resolved.  
* A few of the features need more work. The ticketed events feature doesn’t really do anything other than trigger a Stripe checkout flow. We’d probably want that to use Stripe Connect so event organizers could get paid, and give them more tools for managing purchased tickets and seeing their own revenue flow. The location autocomplete when creating an event could be better. Etc.  
* No analytics have been configured beyond what Loveable comes with out of the box. A marketing team is going to want to know more than that, so they can see what kinds of events are attracting notice and how users are using the app.

My full audit is [here](./Gather%20Audit.pdf). I also have a [Zap report](./Gather%20-%20ZAP%20by%20Checkmarx%20Scanning%20Report.pdf), [Lighthouse report](./Gather%20-%20Lighthouse.pdf), and [some more detailed breakdowns of endpoints and application dependencies](./Gather%20-%20Audit%20Notes.xlsx).