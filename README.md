## Svelte Notifications

Svelte Notifications component based on beyonk's, but updated for the modern era and with:
- hover to pause
- close without persist

## Demo

A [Demo of this component](https://svelte.dev/repl/dd506c546df84c1994a5ae9928ad23b1) is available.

Alternatively, check the project out from github and `npm run dev`.

## Usage

```bash
npm i @thebrenny/svelte-notifications
```

```svelte
<NotificationDisplay />

<button on:click={someFunction}>Show message</button>

<script>
import { NotificationDisplay, notifier } from '@thebrenny/svelte-notifications'

function someFunction () {
  notifier.success('Notifications work!')
}
</script>
```

### Notification types

You can call multiple types of notification:

```js
const options = {
  timeout: 3000, // milliseconds
  persist: false, // automatic timeout (ignores above)
  showProgess: true, // Show (or Hide) the progress bar
  icon: null // Add svelte component to render an icon
}

notifier.show('danger', message, options)
notifier.danger(message, options),
notifier.warning(message, options),
notifier.info(message, options),
notifier.success(message, options)
```

### Persisting across apps

Your notifications can persist across multiple apps / page reloads, as long as they use this library. This is useful for a scenario where you show a notification and then redirect the browser to a different application, or trigger a full reload of the page.

This is completely automatic and uses session storage.

To ensure that notifications don't persist across apps where they should not, set the `sessionKey` attribute to something unique to each app.

```svelte
<NotificationDisplay sessionKey="foo" />
```

### Notification themes

You can customise the themes:

```svelte
<NotificationDisplay {themes} />

<button on:click={someFunction}>Show message</button>

<script>
import { NotificationDisplay, notifier } from '@thebrenny/svelte-notifications'

let themes = { // These are the defaults
  danger: '#bb2124',
  success: '#22bb33',
  warning: '#f0ad4e',
  info: '#5bc0de',
  default: '#aaaaaa' // relates to simply '.show()'
}

function someFunction () {
  notifier.success('Notifications work!')
}
</script>
```

##### Custom types

```svelte
<NotificationDisplay {themes} />

<button on:click={someFunction}>Show message</button>

<script>
import { NotificationDisplay, notifier } from '@thebrenny/svelte-notifications'

let themes = {
  myColour: '#ff00bb'
}

function someFunction () {
  notifier.send('myColour', 'Notifications work!')
}
</script>
```

#### Timeouts

You can set a default timeout:

```svelte
<NotificationDisplay {timeout} />

<button on:click={someFunction}>Show message</button>

<script>
import { NotificationDisplay, notifier } from '@thebrenny/svelte-notifications'

let timeout = 3000 // The default

function someFunction () {
  notifier.success('Notifications work!')
}
</script>
```

##### Custom timeout:

You can set a timeout per message

```svelte
<NotificationDisplay />

<button on:click={someFunction}>Show message</button>

<script>
import { NotificationDisplay, notifier } from '@thebrenny/svelte-notifications'

function someFunction () {
  notifier.success('Notifications work!', { timeout: 5000 }) // built in theme
  notifier.send('custom-theme', 'Notifications work!', { timeout: 5000 }) // custom theme
}
</script>
```

##### Show Progress:

You can show or hide the progress bar per message

```svelte
<NotificationDisplay />

<button on:click={someFunction}>Show message</button>

<script>
import { NotificationDisplay, notifier } from '@thebrenny/svelte-notifications'

function someFunction () {
  notifier.success('Notifications work!', { showProgress: false }) // built in theme
  notifier.send('custom-theme', 'Notifications work!', { showProgress: true }) // custom theme
}
</script>
```

##### Persist

You can make a message persist and never timeout, having a close button that the user can click to remove it.

```svelte
<NotificationDisplay />

<button on:click={someFunction}>Show message</button>

<script>
import { NotificationDisplay, notifier } from '@thebrenny/svelte-notifications'

function someFunction () {
  notifier.success('Notifications work!', { persist: true }) // built in theme
  notifier.send('custom-theme', 'Notifications work!', { persist: true }) // custom theme
}
</script>
```

##### Icons

You can include custom svelte components to render icons (or anything).

```svelte
<NotificationDisplay />

<button on:click={someFunction}>Show message</button>

<script>
import { NotificationDisplay, notifier } from '@thebrenny/svelte-notifications'
impoer Icon from 'somewhere/Icon.svelte'

function someFunction () {
  notifier.success('Notifications work!', { icon: Icon })
}
</script>

// Icon.svelte

<svg width="1em" height="1em" viewBox="0 0 36 36">
  <path
    fill="currentColor"
    d="M18 34a16 16 0 1 1 16-16a16 16 0 0 1-16 16Zm0-30a14 14 0 1 0 14 14A14 14 0 0 0 18 4Z"
  </path>
</svg>
```

## Credits

* Original code by [Antony Jones](https://github.com/antony)
* Idea for persistent notifications by [Henrique Borges](https://github.com/henriquehbr)
* Animation and performance improvements by [Jonathan Greenemeier](https://github.com/6eDesign).


---


# Svelte library

Everything you need to build a Svelte library, powered by [`sv`](https://npmjs.com/package/sv).

Read more about creating a library [in the docs](https://svelte.dev/docs/kit/packaging).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of your library, everything inside `src/routes` can be used as a showcase or preview app.

## Building

To build your library:

```sh
npm pack
```

To create a production version of your showcase app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## Publishing

Go into the `package.json` and give your package the desired name through the `"name"` option. Also consider adding a `"license"` field and point it to a `LICENSE` file which you can create from a template (one popular option is the [MIT license](https://opensource.org/license/mit/)).

To publish your library to [npm](https://www.npmjs.com):

```sh
npm publish
```
