import React from "react"
import { createProvider } from "./provider"

const { Provider, Consumer } = React.createContext()

export const EventsProvider = createProvider(Provider)
export const EventsConsumer = Consumer

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
      const { events, store } = composer()

      let props = {}

      if (Component.getInitialProps) {
        props = await Component.getInitialProps({
          ...context,
          events,
          store,
        })
      }

      return { ...props, state: store.state }
    }

    render() {
      const { state } = this.props
      const { events, store } = composer(state)

      return (
        <EventsProvider events={events} store={store}>
          <Component {...this.props} />
        </EventsProvider>
      )
    }
  }
}
