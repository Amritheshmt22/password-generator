# Password Generator

A small browser tool for generating strong random passwords. It is built with plain HTML, CSS and JavaScript, with no build step, server or external dependency.

## Features

- Adjustable length from 4 to 32 characters
- Uppercase, lowercase, number and symbol character sets
- Option to avoid look-alike characters (l, 1, I, O, 0)
- Strength meter that reacts to length and variety
- Copy to clipboard with a fallback for older browsers
- Validation when no character set is selected
- Responsive desktop and mobile layout

## Files

- `index.html` - page structure, options and output
- `styles.css` - responsive layout, strength bar and controls
- `script.js` - generation, strength rating, copy and state

## How to run

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Pick a length and character sets, then click Generate password.

No account, package install or server is required.

## How it works

Passwords are generated locally with the Web Crypto API (`crypto.getRandomValues`), so nothing is sent over the network and nothing is stored. The strength meter looks at length and character variety.

## Testing

The project was checked in a browser with functional tests for length control, character set inclusion and exclusion, the look-alike filter, validation, strength ratings, copy behavior and regenerate flow. Desktop and mobile layouts were visually inspected.

## Note

This project was built with the help of an AI assistant (Instinct) as a learning project.
