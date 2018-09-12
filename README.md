# dot-event-react

React integration for dot-event.

![dot-event-react](https://media.giphy.com/media/lasKf9ImRHtbG/giphy.gif)

## Install

```bash
npm install --save dot-event dot-event-react
```

## What it does

This integration provides a [React context](https://reactjs.org/docs/context.html) [provider](https://reactjs.org/docs/context.html#provider) and [consumer](https://reactjs.org/docs/context.html#consumer) that passes the dot-event instance down to any component.

Additionally, any emit triggers a [`forceRender()`](https://reactjs.org/docs/react-component.html#forceupdate) at the top level, leaving it to your [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) function to decide whether it should update or not.

## Create a "provider composer"

Pass an [events composer](#events-composer) to `withEventsProvider`, which returns a [provider composer](#provider-composer):

```js
import Events from "dot-event"
import { withEventsProvider } from "dot-event-react"

export default withEventsProvider(Events.composer)
```

Later we use this provider composer to wrap a React component.

### Events composer

In the previos example, we used `Events.composer`, the default dot-event composer. It looks something like this:

```js
function composer({ events = new Events(), state } = {}) {
  events.setState(state)
  return events
}
```

Drop in your own events composer if you need to customize the dot-event instance.

The `state` object is a way to attach state to your events instance. Some extensions, like [dot-store](github.com/dot-store/core) utilize the state object.

### Next.js

If you're using [Next.js](https://github.com/zeit/next.js), the provider utilizes `getInitialProps` to pass state from server to client.

## Add the consumer

Pass a component to `withEvents()` to add the consumer to create a provider composer:

```js
import React from "react"
import { withEvents } from "dot-event-react"
import withEventsProvider from "./withEventsProvider"

class Component extends React.Component {
  componentDidMount() {
    const { events } = this.props
    events.on(async () => {})
  }
  render() {
    return null
  }
}

export default withEventsProvider(withEvents(Component))
```

## dot-store

Example with [dot-store](github.com/dot-store/core) that takes advantage of server side state:

```js
import React from "react"
import Store from "dot-store"
import {
  withEvents,
  withEventsProvider,
} from "dot-event-react"

class Component extends React.Component {
  static async getInitialProps({ store }) {
    await store.set("message", "hello world")
  }
  render() {
    const { store } = this.props
    return store.get("message")
  }
}

export default withEventsProvider(Store.composer)(
  withEvents(Component)
)
```
