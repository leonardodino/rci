# `rci` [WIP]

> status: Work In Progress

new take for code inputs on the web.

## Compared

|![Single Input](https://user-images.githubusercontent.com/8649362/136673697-c51a167f-444e-40cc-b5f6-eafae575e803.png)|![Segmented Input](https://user-images.githubusercontent.com/8649362/136673699-b39fbd58-b5eb-424f-a0b0-3ff8113200b0.png)|![rci](https://user-images.githubusercontent.com/8649362/136673700-bd227d9c-9919-49d6-ae92-bbbef7882365.png)|
|:---:|:---:|:---:|
|DOM Input|multi-input pattern|rci|

<kbd>rci</kbd> is uses a single DOM input element, most other implementations are based on multiple inputs.

Using multiple inputs gives out-of-the-box style consistency, but comes with the disadvantage of JS hacks to deal with focus shifiting, pasting, etc. It also prevents some [:sparkles:`autocomplete` magic:sparkles:](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/autocomplete#:~:text=one-time-code) from working, and might also be worse for acessibility.<sup>[citation needed]</sup>

# Demo

TODO: add codesandbox link here


## Caveats
The font used must either contain [tabular lining](https://www.fonts.com/content/learning/fontology/level-3/numbers/proportional-vs-tabular-figures)(for numeric values) or be [monospaced](https://en.wikipedia.org/wiki/Monospaced_font)(for alphanumeric values), as the advances widths are assumed to be fixed.
