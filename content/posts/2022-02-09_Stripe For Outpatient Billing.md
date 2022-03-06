---
title: "Stripe For Outpatient Billing"
date: 2022-02-09
tags:
  - Creative Writing
  - Stripe
  - Proposals
thumbnail: "/images/hush-naidoo-jade-photography-yo01Z-9HQAw-unsplash.jpg"
---
In this article, I will explain why I think Stripe should start treating health insurance cards like any other 3.3”x2.1” pieces of plastic with 12 digits on them and take their slice of a $4.1 trillion industry.

## The situation

Outpatient billing is expensive and unpleasant. 

According to [a study published in 2017](https://doi.org/10.7326/M19-2818), doctors spend 21.8% of gross receipts on it. That means over 20 cents out of every dollar that comes into an outpatient practice gets spent on insurance-related administrative overhead.

Physicians _hate_ this, as evidenced by the rise of Direct Primary Care providers and other cash-only models that seek to avoid interfacing with insurance companies.

## The details

This is covered better and in more detail [elsewhere](https://truecostofhealthcare.org/outpatient_charges/), but a little detail about how outpatient billing (billing for healthcare services _outside_ a hospital, think clinics or a doctor's office) currently works.

After you leave the doctor's office, they submit a bill to your insurance company. This bill describes the services they provided (identified by CPT codes; for example 99213 means "follow up office visit, low complexity") and how much they charge for those services. At this time, they don't know if their bill will be approved or denied. Assuming it is approved, they don’t know how much of the bill the insurance company will pay.

If the claim is denied, there is sometimes the possibility of re-submitting that claim, with additional documentation, but there’s a time limit, and this is a manual, frequently fax-machine-based process.

If the claim is approved, they'll receive an explanation of benefits (EOB). This is the insurance company's explanation of what services will be paid for, and how much they intend to pay for each of those services. Different insurance companies pay different amounts for each service, and frequently, even different plans under the same insurer pay different amounts!

This system is too complex for a typical practice to keep track of all of the different reimbursement rates across insurance providers and plans.

## What Stripe could do

Stripe could submit the bill on behalf of physicians.

They could take a 10% cut for gathering all the required information, submitting the bill to the insurance provider, and making funds available immediately. Remember that currently, doctors spend 21.8% of their revenue on administrative billing-related expenses. By delegating this hassle to stripe, they would reduce their overhead, have more predictable cash flow, and have more time to spend _actually providing healthcare_.

By leveraging their existing expertise in fraud detection and other KYC (know your customer) and documentation related tooling, as well as the economies of scale from working with multiple physician practices and insurance companies, they could predict how much an insurance provider would be willing to pay for a given claim. Not only would the accuracy of this prediction improve over time, but they could use their knowledge of the insurers reimbursement practices to guide physicians towards submitting claims that are more likely to be reimbursed.

## How they could do this

By starting small, with a subset of specialist practices, and limiting reimbursement to a single insurance provider, Stripe could build out the functionality required to monitor and dial in their claim approval heuristics.

They can track the documentation required for specific procedures, and make sure that the physician has that documentation before submitting a claim.

They can build the lookup table that maps what different plans pay for different services. It’s not worth it for individual practices to maintain this table, but it becomes incredibly useful at scale.

All of this should result in more claims being accepted, and more importantly, more predictable revenue from each of those claims.

## Why Stripe

I touched on this before, but because of their existing fraud mitigation requirements, Stripe has significant expertise in facilitating a financial transaction, capturing a bundle of features about that transaction, approving or denying that transaction based on those features, and, most importantly, iterating on each of those previous steps in order to do them better.

In a lot of ways, outpatient billing is an easier problem than credit card fraud. The parties are better known, transactions are more similar and regular, and the "rules" are better spelled out and less likely to be broken.

## The upshot

That 21.8% of gross receipts works out to about $150 billion. Any piece of that pie would make an attractive proposition. And it aligns with Stripe's mission - doctors should no more need to spend a fifth of their time thinking about billiing than an online storefront should need to worry about local sales tax. Stripe is one of the few companies with the expertise to take on this problem, and a lot of doctors would be very happy if they did.
