import * as React from "react";
import * as styles from './styles.css'

export interface HelloProps { compiler: string; framework: string; }

//export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

export class Hello extends React.Component<HelloProps, undefined> {
    render() {
        return <h1 className={styles.hello}>Hello from {this.props.compiler} <span>and</span> {this.props.framework}!</h1>;
    }
}