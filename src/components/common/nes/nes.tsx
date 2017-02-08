import * as React from "react";
const classnames = require('classnames');
const rom = require('./rom.nes');
const NesNes = require('nesnes');

interface INesProps {
    mute?: true
};

interface INesState {};

export class Nes extends React.Component<INesProps, INesState> {
    private canvas: HTMLCanvasElement;
    private em: any;
    private setRef = (ref: HTMLCanvasElement) => {
        this.canvas = ref;
    }

    private handleControlButtonClick = (type: string) => (ev: MouseEventInit): void => {
        switch (type) {
            case 'play':
                this.em.play();
                break;
            case 'reset':
                this.em.reset();
                break;
            case 'toggle':
                if (this.em.paused) {
                    this.em.play();    
                } else {
                    this.em.pause();
                }                
                break
            default:
                break;
        }
    }

    constructor () {
        super();
    }

    componentDidMount () {
        this.em = new NesNes(this.canvas);
        this.em.load(rom);
    }

    public render(): JSX.Element {
        return (
            <div>
                <div>
                    <input type="button" onClick={this.handleControlButtonClick('play')} value={'Play'}/>
                    <input type="button" onClick={this.handleControlButtonClick('reset')} value={'Reset'}/>
                    <input type="button" onClick={this.handleControlButtonClick('toggle')} value={'Pause'}/>
                </div>
                <canvas ref={this.setRef} className={classnames()}>
                    If you can see me, then nothing works
                </canvas>
            </div>
        );
    }
}