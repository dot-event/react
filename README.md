# @dot-event/react

React integration for dot-event.

![@dot-event/react](https://media.giphy.com/media/lasKf9ImRHtbG/giphy.gif)

## Install

```bash
npm install --save @dot-event/store @dot-event/react
```

## What it does

This integration provides a [React context](https://reactjs.org/docs/context.html) provider and consumer that passes the dot-event instance down to any component.

### Higher order components

We add the provider and the consumer to your component chain via [higher order component](https://reactjs.org/docs/higher-order-components.html) "composers". Most of the examples below walk you through using the composers.

### Re-render on emit

Additionally, any dot-event emit triggers a [`forceRender()`](https://reactjs.org/docs/react-component.html#forceupdate) from the provider, leaving it to your child components' [`shouldComponentUpdate()`](https://reactjs.org/docs/react-component.html#shouldcomponentupdate) function to decide whether they should render.

## Provider composer

Create a provider composer (`withEventsProvider.js`):

```js
import dotEvent from "dot-event"
import dotStore from "@dot-event/store"
import { withEventsProvider } from "@dot-event/react"

export default withEventsProvider(dotStore)
```

## Add the consumer

Add the consumer and pass it to the [provider composer](#provider-composer):

```js
import React from "react"
import { withEvents } from "@dot-event/react"
import withEventsProvider from "./withEventsProvider"

class Component extends React.Component {
  static async getInitialProps({ events }) {
    await events.set("message", "hello world")
  }
  render() {
    const { events } = this.props
    return events.get("message")
  }
}

export default withEventsProvider(withEvents(Component))
```

Read more about [React context](https://reactjs.org/docs/context.html) if you're not sure how the provider/consumer relationship works.
