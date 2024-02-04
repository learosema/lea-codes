# A Low Effort Web Accessibility?

A common myth about Web accessibility is that it is very hard and expensive. One thing I've experienced in many past projects was: Accessibility was not an objective at all. It wasn't although the developer team put a big focus on Software Quality.

It's not understandable to me that Accessibility is so hardly neglected.

Accessibility is one very important criteria for good software quality. In fact, they complement each other pretty well. Robustness, for example is one core feature for Software Quality and is also part of the WCAG (Web Content Accessibility Guidelines), see [the POUR principles](https://www.w3.org/WAI/WCAG22/Understanding/intro#understanding-the-four-principles-of-accessibility): Perceivable, Operable, Understandable and _Robust_.

So what can help improving the accessibility of a product and integrating it into the development process? Let's have a look at several approaches.

## Let's use AI for that?

When talking about low effort, AI might instantly come to mind. 

There is some potential AI can assist in building accessible products. However, AI cannot replace proper accessibilty expertise. As of current, AI can generate relatively good alt text but might miss important context.

Also, to be strict, AI is not really low effort. It comes with a big carbon-dioxide footprint and this should be considered and counted in.

Furthermore, there are several issues with AI which doesn't make it a good choice for content creators. Casey Kreer held a great talk on that at the 37C3: [Rettet uns die KI?](https://media.ccc.de/v/37c3-12157-rettet_uns_die_ki).

One of her points on this was because AI output is biased and sometimes it even lies to you. All output needs to be fact-checked and thus needs to be reviewed carefully.

There is still the same amount of in-depth accessibility testing to be done. So it doesn't really make the developer's life easier.

But the most important point is: AI should assist users rather than developers.

## The wrong track

The extra cost of accessibility often tricks deciders into choosing a wrong track along the road. They might consider buying an "accessibility overlay" for the website. They also promise AI will automatically fix every accessibility problem of your website.

There is are several reviews whether overlays can keep their promises. According to the german [BFIT Bund](https://www.bfit-bund.de/DE/Publikation/einschaetzung-overlaytools.html):

- Currently, overlay tools are not able to display a website that has barriers in a completely barrier-free manner.
- The use of such tools can create further barriers to the website.
- Overlay tools can improve existing accessibility, e.g. B. additional criteria of conformity level AAA of the WCAG must be met.

So, accessibility tools can not ensure a website is completely barrier-free but can introduce further barriers.

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

## Conclusion

- a11y is always effort and there's no shortcut
- automagic
- TODO
- hire accessibility experts, especially people with disabilities
- you don't people with disabilities, they are the teachers (sometimes deliberately), they provide valuable feedback aka ("pupil-teacher-principle")
