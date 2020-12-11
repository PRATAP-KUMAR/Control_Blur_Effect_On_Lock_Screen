
const { Gio, GLib, Shell, St } = imports.gi;
const Main = imports.ui.main;
const Background = imports.ui.background;
const ExtensionUtils = imports.misc.extensionUtils;

const BLUR_SCHEMA = 'org.gnome.shell.extensions.blur';

let native = imports.ui.unlockDialog.UnlockDialog.prototype._updateBackgroundEffects;

class modified {
    constructor() {
    }

    enable() {
    	imports.ui.unlockDialog.UnlockDialog.prototype._updateBackgroundEffects = this._controlBlur;
    }

    disable() {
        // imports.ui.unlockDialog.UnlockDialog.prototype._updateBackgroundEffects = native;
    }
    
    _controlBlur() {
        const themeContext = St.ThemeContext.get_for_stage(global.stage);
        
        let BRIGHTNESS_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_double('brightness');
        let SIGMA_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_int('sigma');

	for (const widget of this._backgroundGroup) {
            const effect = widget.get_effect('blur');

            if (effect) {
                effect.set({
                    brightness: BRIGHTNESS_VALUE,
                    sigma: SIGMA_VALUE * themeContext.scale_factor,
            });
         }
       }
     }
   }

function init() { return new modified(); }
