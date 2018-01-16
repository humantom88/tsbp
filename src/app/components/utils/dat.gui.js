// @flow

import { GUI } from 'dat-gui'

interface GUIOption {
    name: string,
    /** This */
    value?: string,
    /** Or this */
    min?: number,
    max?: number
}

function initDatGUI(obj: any, props: Array<GUIOption>) {
    const gui : GUI = new GUI();
    if (props) {
        props.forEach((option) => {
            if (option.value) {
                gui.add(obj, option.name, option.value)
            } else if (option.min && option.max){
                gui.add(obj, option.name, option.min, option.max)
            } else {
                gui.add(obj, option.name);
            }      
        })
    }
}

export { initDatGUI }
