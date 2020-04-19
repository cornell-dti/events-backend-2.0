import React from "react";
import {Colors} from "./Colors";


export class Icons {
    static getRerunAllIcon(width: string, height: string, color?: string): JSX.Element {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 0 24 24" width={width}><path fill={color ? color : Colors.softButtonTextIconColor} d="M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        );
    }

    static getPlayIcon(width: string, height: string, color?: string): JSX.Element {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 0 24 24" width={width}><path fill={color ? color : Colors.softButtonTextIconColor} d="M8 5v14l11-7z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
        );
    }

    static getChangeCardStyleIcon(width: string, height: string, color?: string): JSX.Element {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 0 24 24" width={width}><path d="M0 0h24v24H0z" fill="none"/><path fill={color ? color : Colors.softButtonTextIconColor} d="M20 13H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zm0-10H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h17c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1z"/></svg>
        );
    }
}