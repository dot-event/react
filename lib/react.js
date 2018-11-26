// Packages
import React from "react"

// Helpers
import { createProvider } from "./react/provider"

// Constants
const { Provider, Consumer } = React.createContext()
export const EventsProvider = createProvider(Provider)
export const EventsConsumer = Consumer

// Composer
export function withEvents(Component) {
  return class extends React.Component {
    static async getInitialProps(context) {
      if (Component.getInitialProps) {
        return await Component.getInitialProps(context)
      }
    }

    render() {
      return (
        <Consumer>
          {withEventsConsumer.bind({
            Component,
            props: this.props,
          })}
        </Consumer>
      )
    }
  }
}

function withEventsConsumer([events, state]) {
  const { Component, props } = this
  return (
    <Component {...props} events={events} state={state} />
  )
}

export function withEventsProvider(composer) {
  return withEventsProviderComponent.bind({ composer })
}

function withEventsProviderComponent(Component) {
  const { composer } = this

  return class extends React.Component {
    static displayName = `withEventsProvider(${
      Component.displayName
    })`

    static async getInitialProps(context) {
      const { events } = composer()

      let props = {}

      if (Component.getInitialProps) {
        props = await Component.getInitialProps({
          ...context,
          events,
        })
      }

      return { ...props, state: events.get() }
    }

    render() {
      const { state } = this.props
      const { events } = composer({ state })

      return (
        <EventsProvider events={events}>
          <Component {...this.props} />
        </EventsProvider>
      )
    }
  }
}
