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
    notSureType: any,
    sayHello: void
}

//export const Hello = (props: HelloProps) => <h1>Hello from {props.compiler} and {props.framework}!</h1>;

export class TSCTypes extends React.Component<TSCTypesProps, undefined> {
    render() {
        return (
            <div>
                <ul>
                    <li>{this.props.booleanType}</li>
                    <li>{this.props.numberType}</li>
                    <li>{this.props.stringType}</li>
                    <li>{this.props.arrayType}</li>
                    <li>{this.props.array2Type}</li>
                    <li>{this.props.enumType}</li>
                    <li>{this.props.notSureType}</li>
                </ul>
            </div>
        );
    }
}