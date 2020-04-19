import React, { Component } from 'react';
import {Test} from "./Test";
import {TestResult} from "../Types";
import {Colors} from "../util/Colors";
import {Collection} from "js-data";

export type SoftDivProps = {
    onClick?: Function,
    text?: string,
    textColor?: string,
    colorHex?: string,
    onBackgroundHex?: string,
    height?: string,
    width?: string,
    thisArg?: any,
    style?: React.CSSProperties,
    borderRadius?: string,
    zIndex?: number,
    changesTheme?: boolean,
    impressedByDefault?: boolean,
    animationIsEnabled?: boolean,
    msAnimationTime?: number
};

type SoftDivState = {
    color: string,
    highlightColor: string,
    shadowColor: string,
    insideHighlightColor: string,
    insideShadowColor: string,
    textColor: string,
    isImpressed: boolean
}

const boldName: React.CSSProperties = { fontWeight: 'bolder', fontFamily: 'Arial', fontSize: '16pt' };
const expand: React.CSSProperties = { width: '100%', height: '100%' };

class SoftDivListSingleton {

    static softDivs: SoftDiv[];

    static getDivs(){
        if(!this.softDivs){
            this.softDivs = [];
            return this.softDivs;
        } else {
            return this.softDivs;
        }
    }

    static setDivs(softDivsState: SoftDiv[]){
        SoftDivListSingleton.softDivs = softDivsState;
    }

    public static registerSoftDiv = (softDiv: SoftDiv) => { let x = SoftDivListSingleton.getDivs(); x.push(softDiv); SoftDivListSingleton.setDivs(x); };
    public static unregisterSoftDiv = (softDiv: SoftDiv) => { let x = SoftDivListSingleton.getDivs(); x = x.filter((val) => val !== softDiv); SoftDivListSingleton.setDivs(x); };

}

export class SoftDiv extends Component<SoftDivProps, SoftDivState> {


    static highlightAmount = 9;
    static shadowAmount = 10;
    static highlightDist = 6;
    static shadowDist = 8;
    static highlightBlur = 9;
    static shadowBlur = 10;
    static highlightSpread = 0;
    static shadowSpread = 0;

    constructor(props: Readonly<SoftDivProps>, state: SoftDivState) {
        super(props);
        SoftDivListSingleton.registerSoftDiv(this);
        this.state = this.doStylingSetup();
    }

    private doStylingSetup(): SoftDivState {
        let poundCheck = this.props.onBackgroundHex ? this.props.onBackgroundHex.split("#") : (this.props.colorHex ? this.props.colorHex : Colors.cardColor).split("#");
        let hR = Math.min(parseInt(poundCheck[poundCheck.length - 1].substr(0, 2), 16) + SoftDiv.highlightAmount, 255);
        let hG = Math.min(parseInt(poundCheck[poundCheck.length - 1].substr(2, 2), 16) + SoftDiv.highlightAmount, 255);
        let hB = Math.min(parseInt(poundCheck[poundCheck.length - 1].substr(4, 2), 16) + SoftDiv.highlightAmount, 255);
        let sR = Math.max(parseInt(poundCheck[poundCheck.length - 1].substr(0, 2), 16) - SoftDiv.shadowAmount, 0);
        let sG = Math.max(parseInt(poundCheck[poundCheck.length - 1].substr(2, 2), 16) - SoftDiv.shadowAmount, 0);
        let sB = Math.max(parseInt(poundCheck[poundCheck.length - 1].substr(4, 2), 16) - SoftDiv.shadowAmount, 0);
        let highlightStr = "#" + hR.toString(16) + hG.toString(16) + hB.toString(16);
        let shadowStr = "#" + sR.toString(16) + sG.toString(16) + sB.toString(16);
        let textColorStr = this.props.textColor ? this.props.textColor : Colors.softButtonTextIconColor;
        let color = "#" + (this.props.colorHex ? this.props.colorHex : Colors.cardColor).replace(/^#/, '');

        let poundCheck2 = (this.props.colorHex ? this.props.colorHex : Colors.cardColor).split("#");
        let hR2 = Math.min(parseInt(poundCheck2[poundCheck2.length - 1].substr(0, 2), 16) + SoftDiv.highlightAmount, 255);
        let hG2 = Math.min(parseInt(poundCheck2[poundCheck2.length - 1].substr(2, 2), 16) + SoftDiv.highlightAmount, 255);
        let hB2 = Math.min(parseInt(poundCheck2[poundCheck2.length - 1].substr(4, 2), 16) + SoftDiv.highlightAmount, 255);
        let sR2 = Math.max(parseInt(poundCheck2[poundCheck2.length - 1].substr(0, 2), 16) - SoftDiv.shadowAmount, 0);
        let sG2 = Math.max(parseInt(poundCheck2[poundCheck2.length - 1].substr(2, 2), 16) - SoftDiv.shadowAmount, 0);
        let sB2 = Math.max(parseInt(poundCheck2[poundCheck2.length - 1].substr(4, 2), 16) - SoftDiv.shadowAmount, 0);
        let highlightStr2 = "#" + hR2.toString(16) + hG2.toString(16) + hB2.toString(16);
        let shadowStr2 = "#" + sR2.toString(16) + sG2.toString(16) + sB2.toString(16);
        let state = ({ isImpressed: false, insideShadowColor: shadowStr2, insideHighlightColor: highlightStr2, color: color, textColor: this.props.textColor ? this.props.textColor : textColorStr, highlightColor: highlightStr, shadowColor: shadowStr });
        this.setState(state);
        return state;
    }

    private cardStyling = () => {
        let colorTxt = this.state.color ? this.state.color : Colors.cardColor;
        let decider = this.state.isImpressed;
        if(this.props.impressedByDefault){
            decider = !decider;
        }
        if(decider){
            return {
                color: colorTxt, width: this.props.width, height: this.props.height,
                borderRadius: this.props.borderRadius ? this.props.borderRadius : '24px', background: colorTxt,
                boxShadow: `inset -${SoftDiv.highlightDist}px -${SoftDiv.highlightDist}px ${SoftDiv.highlightBlur}px 
                ${SoftDiv.highlightSpread}px ${this.state?.insideHighlightColor ? this.state.insideHighlightColor : "#E7E7E7"}, 
                inset ${SoftDiv.shadowDist}px ${SoftDiv.shadowDist}px ${SoftDiv.shadowBlur}px ${SoftDiv.shadowSpread}px 
                ${this.state?.insideShadowColor ? this.state.insideShadowColor : "#BFBFBF"}`
            };
        } else {
            return {
                color: colorTxt, width: this.props.width, height: this.props.height,
                borderRadius: this.props.borderRadius ? this.props.borderRadius : '24px', background: colorTxt, boxShadow: `-${SoftDiv.highlightDist}px -${SoftDiv.highlightDist}px ${SoftDiv.highlightBlur}px ${SoftDiv.highlightSpread}px ${this.state?.highlightColor ? this.state.highlightColor : "#E7E7E7"}, ${SoftDiv.shadowDist}px ${SoftDiv.shadowDist}px ${SoftDiv.shadowBlur}px ${SoftDiv.shadowSpread}px ${this.state?.shadowColor ? this.state.shadowColor : "#BFBFBF"}`
            };
        }
    };

    componentWillUnmount(): void {
        SoftDivListSingleton.unregisterSoftDiv(this);
    }

    private prevClick: NodeJS.Timeout | undefined = undefined;

    public clickIt(){
        return async () => {
            if(!this.props.onClick)
                return;
            if(this.props.onClick){
                if (this.props.thisArg) {
                    await this.props.onClick.apply(this.props.thisArg);
                } else {
                    await this.props.onClick.apply(this);
                }
            }
            if(this.props.changesTheme){
                for(let i = 0; i < SoftDivListSingleton.getDivs().length; i++){
                    let b = SoftDivListSingleton.getDivs()[i];
                    b.doStylingSetup();
                    b.forceUpdate();
                    b.setState(b.state);
                }
            }
            let anim = this.props.animationIsEnabled;
            if(anim !== undefined && !anim)
                return;
            if(this.prevClick){
                clearTimeout(this.prevClick);
            }
            this.setState({ ...this.state, isImpressed: true });
            this.prevClick = setTimeout(() => { this.setState({ ...this.state, isImpressed: false }); this.doStylingSetup(); this.forceUpdate(); }, this.props.msAnimationTime ? this.props.msAnimationTime : 150);
        }
    }

    render() {
        return (
            <div style={{ display: 'flex', justifyContent: "center", alignItems: 'center', zIndex: this.props.zIndex ? this.props.zIndex : 8,
                ...this.props.style, ...this.cardStyling() }} onClick={this.clickIt()}>
                {this.props.text && <p style={{ color: this.state.textColor, ...boldName, zIndex: this.props.zIndex ? this.props.zIndex : 8 }}>
                    { this.props.text }
                </p>}
                { [this.props.children] }
            </div>
        );
    }
}