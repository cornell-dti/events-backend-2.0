import {type} from "os";

export class Colors {

    /**
     * NOTE: Any colors declared in here as non-optional MUST be given a default
     * value in DefaultColors or it will be set to undefined when the reset occurs.
     * Though this shouldn't matter, as the next theme is loaded on top, it is good practice.
     */

        // Primary color
    static primary: string;
    // Background color
    static background: string;
    // Card background color
    static cardColor: string;
    // Soft Button color of text or icons
    static softButtonTextIconColor: string;
    // The color of the buttons of tests
    static testButtonColor: string;
    // The color of the text in the buttons of tests
    static testButtonTextColor?: string;
}


export class ColorsDefault {

    // These are the global defaults. These values will be overwritten
    // to values of the same name in the class Colors

    // Primary color
    static primary: string = "#EA6261";
    // Background offWhite
    static background: string = "#e4e4e4";
    // Card background color
    static cardColor: string = "#ffffff";
    // Soft Button color of text or icons
    static softButtonTextIconColor: string = "#808A98";
    // The color of the buttons of tests
    static testButtonColor: string = "#f7f7f7";
    // The color of the text in the buttons of tests
    static testButtonTextColor?: string = "#000000";
}