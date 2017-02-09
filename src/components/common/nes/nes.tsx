import * as React from "react";
const Dendy = require('dendy');
const classnames = require('classnames');
const styles = require('./styles.css');
const rom = require('./rom.nes');

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
        this.em = new Dendy(this.canvas);
        this.em.load(rom);
    }

    public render(): JSX.Element {
        return (
            <div className={styles.panel}>
                <div className={styles.controls}>
                    <input className={styles.button} type="button" onClick={this.handleControlButtonClick('play')} value={'▶️'}/>
                    <input className={styles.button} type="button" onClick={this.handleControlButtonClick('reset')} value={'↻'}/>
                    <input className={styles.button} type="button" onClick={this.handleControlButtonClick('toggle')} value={'❚❚'}/>
                </div>
                <canvas ref={this.setRef} className={styles.window}>
                    If you can see me, then nothing works
                </canvas>
            </div>
        );
    }
}