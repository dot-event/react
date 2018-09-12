# dot-event-react

React integration for dot-event.

![dot-event-react](https://media.giphy.com/media/lasKf9ImRHtbG/giphy.gif)

## Install

```bash
npm install --save dot-event dot-event-react
```

## What it does

This integration provides a [React context](https://reactjs.org/docs/context.html) provider and consumer that passes the dot-event instance down to any component.

### Higher order components

We add the provider and the consumer to your component chain via [higher order component](https://reactjs.org/docs/higher-order-components.html) "composers". Most of the examples below walk you through using the composers.

### Re-render on emit

Additionally, any dot-event emit triggers a [`forceRender()`](https://reactjs.org/docs/react-component.html#forceupdate) from the provider, leaving it to your child components' [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) function to decide whether they should render.

## Events composer

First we need a way to create the dot-event instance in a way that the provider can reuse.

Luckily `dot-event` provides a default events composer:

```js
import Events from "dot-events"
Events.composer() // returns a new Events instance
```

Just in case you're wondering, the default events composer looks like this:

```js
function composer({ events = new Events(), state } = {}) {
  events.setState(state)
  return events
}
```

Feel free to create your own events composer to customize the dot-event instance.

### Events composer state

The `state` object in the events composer exists as a means to attach state to your events instance. Some extensions, like [dot-store](github.com/dot-store/core), utilize the state object.

If you're using [Next.js](https://github.com/zeit/next.js), the provider uses `getInitialProps()` to pass state from server to client.

## Provider composer

Pass your [events composer](#events-composer) to `withEventsProvider()` to create a [provider composer](#provider-composer):

```js
import Events from "dot-event"
import { withEventsProvider } from "dot-event-react"

export default withEventsProvider(Events.composer)
```

## Add the consumer

Add the consumer to a component using `withEvents()` and pass it to the events provider we created above:

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

## Summary

1. Create an events composer or use the default one (`Events.composer`)
2. Pass the events composer to `withEventsProvider()` to create a provider composer
3. Pass a component to `withEvents()` to add the consumer
4. Pass the component with the consumer to the provider composer to create the final component chain

Read more about [React context](https://reactjs.org/docs/context.html) if you're not sure how the provider/consumer relationship works.

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
