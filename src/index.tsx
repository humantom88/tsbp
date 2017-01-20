import * as React from 'react'
import * as ReactDOM from 'react-dom';

import { Hello } from "./components/common/hello/Hello"
import { TSCTypes } from "./components/common/types/Types"

ReactDOM.render(
    <div>
        <Hello compiler="Typescript" framework="React" />
        <TSCTypes
            booleanType={false}
            numberType={0}
            stringType={'zero'}
            arrayType={[1, 2, 3]}
            array2Type={["a", "b", "c"]}
            turpleType={["zero", 0]}
            enumType={0}
            notSureType={'string for example'}
        />
    </div>,
    document.getElementById("example")
);