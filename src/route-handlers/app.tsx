import * as React from 'react'

interface AppProps {
    children: Node
}
interface AppState {}

export class App extends React.Component<AppProps, AppState> {
    render () {
        return (
            <div>{this.props.children}</div>
        )
    }
}