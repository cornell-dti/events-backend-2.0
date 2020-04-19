import {Colors, ColorsDefault} from "./Colors";

export class ThemeManager {

    static currentTheme: number;
    static themes = [
        () => {
            Colors.primary = "#EA6261";
            Colors.background = "#e4e4e4";
            Colors.testButtonColor = "#f7f7f7";
            Colors.cardColor = "#ffffff";
            Colors.softButtonTextIconColor = "#808A98";
        },
        () => {
            Colors.primary = "#FFCAD4";
            Colors.background = "#FFCAD4";
            Colors.testButtonColor = "#ffd2d9";
            Colors.cardColor = "#ffebf0";
            Colors.softButtonTextIconColor = "#FFFFFF";
        },
        () => {
            Colors.primary = "#ffe3ed";
            Colors.background = "#beebe9";
            Colors.testButtonColor = "#ededed";
            Colors.cardColor = "#beebe9";
            Colors.softButtonTextIconColor = "#8ac6d1";
        },
        () => {
            Colors.primary = "#8ac6d1";
            Colors.background = "#ffd5e5";
            Colors.testButtonColor = "#b4ffeb";
            Colors.cardColor = "#ffffee";
            Colors.softButtonTextIconColor = "#5ecfff";
        },
        () => {
            Colors.primary = "#ff677d";
            Colors.background = "#ffae8f";
            Colors.testButtonColor = "#cd6684";
            Colors.cardColor = "#f7f7f7";
            Colors.softButtonTextIconColor = "#6f5a7e";
        },
        () => {
            Colors.primary = "#00adb5";
            Colors.background = "#222831";
            Colors.testButtonColor = "#eeeeee";
            Colors.cardColor = "#7fd6da";
            Colors.softButtonTextIconColor = "#00adb5";
        },
        () => {
            Colors.primary = "#f9ed69";
            Colors.background = "#6a2c70";
            Colors.testButtonColor = "#ffadc7";
            Colors.cardColor = "#ffe3ed";
            Colors.softButtonTextIconColor = "#ffadc7";
        },
        () => {
            Colors.primary = "#ff80b0";
            Colors.background = "#ffc7c7";
            Colors.testButtonColor = "#ffadc7";
            Colors.cardColor = "#ced2ff";
            Colors.softButtonTextIconColor = "#9399ff";
        },
        () => {
            Colors.primary = "#ff8880";
            Colors.background = "#424244";
            Colors.testButtonColor = "#424244";
            Colors.cardColor = "#ff6d5a";
            Colors.softButtonTextIconColor = "#ff6d5a";
            Colors.testButtonTextColor = "#ffffff";
        },
    ];

    static resetColors(){
        let obj = Colors;
        for (let prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                if(typeof (Colors as any)[prop] === 'string'){
                    if(typeof (ColorsDefault as any)[prop] === 'string'){
                        (Colors as any)[prop] = (ColorsDefault as any)[prop];
                    } else {
                        (Colors as any)[prop] = undefined;
                    }
                }
            }
        }
    }

    static doColorSetup(theme: number){
        ThemeManager.currentTheme = theme;
        ThemeManager.themes[theme]();
    }

    static changeColorTheme(theme: number){
        if(theme > ThemeManager.themes.length - 1){
            console.error("Can't change theme to theme " + theme + " because it doesn't exist");
            return;
        }
        ThemeManager.doColorSetup(theme);
    }

    static cycleColorTheme(){
        ThemeManager.resetColors();
        if(ThemeManager.currentTheme == ThemeManager.themes.length - 1){
            ThemeManager.changeColorTheme(0);
        } else {
            ThemeManager.changeColorTheme(ThemeManager.currentTheme + 1);
        }
    }

}

ThemeManager.doColorSetup(5);