import * as React from "react";

enum Corps {'Apple', 'Google', 'Sbertech'}

export interface TSCTypesProps {
    booleanType: boolean,
    numberType: number,
    stringType: string,
    arrayType: Array<number>,
    array2Type: string[],
    turpleType: [string, number],
    enumType: Corps,
    notSureType: any
}

//export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

export class TSCTypes extends React.Component<TSCTypesProps, undefined> {
    render() {
        return (
            <div>
                <ul>
                    <li>{`boolean: ${this.props.booleanType ? 'true' : 'false'}`}</li>
                    <li>{`number: ${this.props.numberType}`}</li>
                    <li>{`string: ${this.props.stringType}`}</li>
                    <li>{`array: ${this.props.arrayType}`}</li>
                    <li>{`array2: ${this.props.array2Type}`}</li>
                    <li>{`enum: ${this.props.enumType}`}</li>
                    <li>{`notSure: ${this.props.notSureType}`}</li>
                </ul>
            </div>
        );
    }
}