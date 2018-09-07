import React from "react"
import { mount } from "enzyme"
import Events from "dot-event"

import {
  EventsProvider,
  withEventsProvider,
  withEvents,
} from "../dist/react"

class Component extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.events.emit()
    }, 10)
  }

  render() {
    return null
  }
}

test("calls forceUpdate on emit", async () => {
  const events = new Events()

  const ComponentWithEvents = withEventsProvider(
    () => events
  )(withEvents(Component))

  jest.spyOn(EventsProvider.prototype, "forceUpdate")
  jest.spyOn(Component.prototype, "render")

  mount(<ComponentWithEvents />)

  await events.onceEmitted("after")

  expect(
    EventsProvider.prototype.forceUpdate
  ).toHaveBeenCalledTimes(1)

  expect(Component.prototype.render).toHaveBeenCalledTimes(
    1
  )
})
