import React from "react"

const { Provider, Consumer } = React.createContext()

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
    static displayName = `withStoreProvider(${
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

export class EventsProvider extends React.Component {
  constructor(props) {
    super(props)
    this.anyUpdated = this.anyUpdated.bind(this)
  }

  anyUpdated() {
    this.forceUpdate()
  }

  componentDidMount() {
    this.off = this.props.events.onAny(this.anyUpdated)
  }

  componentWillUnmount() {
    this.off()
  }

  render() {
    const { events } = this.props
    return (
      <Provider value={events}>
        {this.props.children}
      </Provider>
    )
  }
}
