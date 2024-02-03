# Low Effort Web Accessibility

A common myth about Web accessibility is that it is very hard and expensive. In this article, I want to show a possible approach to create accessible web sites with low effort.

## Let's use AI for that?

When talking about low effort, AI might come to mind. But to be strict, AI is not low effort.
AI comes with a big carbon-dioxide footprint and this should be considered.

Furthermore, there are several issues with AI which doesn't make it a good choice for content creators. Casey Kreer held a talk on that at the 37C3.

One of her points on this was because AI output is biased. All output needs to be fact-checked and thus needs to be reviewed carefully.

There is still the same amount of in-depth accessibility testing to be done. So it doesn't really make the developer's life easier.

But the most important point is: AI should assist users rather than developers. There, it can be a game-changer.

## But it's hard and expensive

Yes, creating accessible systems requires additional effort and it does cost money. At first glance, this seems barely feasible, especially for smaller budgets.

## The wrong track

The extra cost of accessibility often tricks deciders into choosing a wrong track along the road. They might consider buying an "accessibility overlay" for the website. However, that's not a cheap solution and cannot automagically all issues.

## Starting with accessibility from the ground up

When starting from scratch, it doesn't take too much effort to create accessible websites as soon as you start with accessibility in mind from the ground up.

- TODO how

## What about fixing existing apps?

Yes, retro-fitting an application to meet accessibility standards is more challenging and may require huge and costly refactorings. There are various steps for approaching brownfield projects. As with every large refactoring, it may be best recommended to work in an iterative manner.

- TODO how

## Focus on basics

Have you heard of the WebAIM million report and the top 5 accessibility bugs?

- TODO mention the top 5 with reference

A million websites are checked and apparently all do some very common accessibility bugs.
They are all very low-hanging fruits. Most of them are even detectable with developer tools.

You don't need an IAAP certificate to fix these bugs.

- TODO elaborate more. How to integrate checks for it into CI?

According to the report, focussing on only fixing those 5 top issues would improve the overall situation significantly.

## But complex widgets?

One key principle is: focus on things you are familiar with, hire where you are not

- TODO
- don't over aria
- use html over aria
- when and why to avoid aria

Integrate automated accessibility tools into your build pipeline

## Key point

- TODO
- hire accessibility experts, especially people with disabilities
- you don't people with disabilities, they are the teachers (sometimes deliberately), they provide valuable feedback aka ("pupil-teacher-principle")
