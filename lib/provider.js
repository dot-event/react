import React from "react"

export function createProvider(Provider) {
  return class EventsProvider extends React.Component {
    constructor(props) {
      super(props)
      this.anyUpdated = this.anyUpdated.bind(this)
    }

    anyUpdated() {
      this.forceUpdate()
    }

    componentDidMount() {
      this.off = this.props.events.onAny(
        "after",
        this.anyUpdated
      )
    }

    componentWillUnmount() {
      this.off()
    }

    render() {
      const { events, store } = this.props
      return (
        <Provider value={[events, store, Math.random()]}>
          {this.props.children}
        </Provider>
      )
    }
  }
}
