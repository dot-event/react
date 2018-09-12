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

function withEventsConsumer(events) {
  const { Component, props } = this
  return <Component {...props} events={events} />
}

export function withEventsProvider(composeEvents) {
  return withEventsProviderComponent.bind({ composeEvents })
}

function withEventsProviderComponent(Component) {
  const { composeEvents } = this

  return class extends React.Component {
    static displayName = `withEventsProvider(${
      Component.displayName
    })`

    static async getInitialProps(context) {
      const events = composeEvents()

      let props = {}

      if (Component.getInitialProps) {
        props = await Component.getInitialProps({
          ...context,
          events,
        })
      }

      return { ...props, eventsState: events.state }
    }

    render() {
      const { eventsState } = this.props
      this.events = composeEvents({ state: eventsState })

      return (
        <EventsProvider events={this.events}>
          <Component {...this.props} />
        </EventsProvider>
      )
    }
  }
}
