import * as React from "react";
import * as styles from './styles.css'

export interface HelloProps { compiler: string; framework: string; }
export interface HelloState {}

export class Hello extends React.Component<HelloProps, HelloState> {
    render() {
        return (
            <h1 className={styles.hello}>
                {`Hello from ${this.props.compiler} `}
                <span>{'and'}</span>
                {` ${this.props.framework}!`}
            </h1>
        )
    }
}