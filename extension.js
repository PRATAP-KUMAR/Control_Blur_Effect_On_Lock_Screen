
const { Gio, GLib, Shell, St } = imports.gi;
const Main = imports.ui.main;
const Background = imports.ui.background;
const ExtensionUtils = imports.misc.extensionUtils;

const BLUR_SCHEMA = 'org.gnome.shell.extensions.blur';

let shellMicroVersion = parseInt(imports.misc.config.PACKAGE_VERSION.split('.')[2]);

let blur = imports.ui.unlockDialog.UnlockDialog.prototype._createBackground;
let blur1 = imports.ui.unlockDialog.UnlockDialog.prototype._updateBackgroundEffects;

class Blur {
    constructor() {
    }

    enable() {
    if (shellMicroVersion > 3) {
    	imports.ui.unlockDialog.UnlockDialog.prototype._updateBackgroundEffects = this._controlBlur1;
    	} else {
        imports.ui.unlockDialog.UnlockDialog.prototype._createBackground = this._controlBlur;
    	}
    }	

    disable() {
    // if (shellMicroVersion > 3) {
    	// imports.ui.unlockDialog.UnlockDialog.prototype._updateBackgroundEffects = blur1;
    	// } else {    
        // imports.ui.unlockDialog.UnlockDialog.prototype._createBackground = blur;
    	// }
    }
    
    _controlBlur1() {
        const themeContext = St.ThemeContext.get_for_stage(global.stage);
        
        let BRIGHTNESS_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_double('brightness');
        let SIGMA_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_int('sigma');

        for (const widget of this._backgroundGroup.get_children()) {
            widget.get_effect('blur').set({
                brightness: BRIGHTNESS_VALUE,
                sigma: SIGMA_VALUE * themeContext.scale_factor,
            });
        }
    }
    
    _controlBlur(monitorIndex) {

        let monitor = Main.layoutManager.monitors[monitorIndex];
        let widget = new St.Widget({
            style_class: 'screen-shield-background',
            x: monitor.x,
            y: monitor.y,
            width: monitor.width,
            height: monitor.height,
        });

        let bgManager = new Background.BackgroundManager({
            container: widget,
            monitorIndex,
            controlPosition: false,
        });

        this._bgManagers.push(bgManager);

        this._backgroundGroup.add_child(widget);

        const themeContext = St.ThemeContext.get_for_stage(global.stage);
        
        let BRIGHTNESS_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_double('brightness');
        let SIGMA_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_int('sigma');

        let effect = new Shell.BlurEffect({ brightness: BRIGHTNESS_VALUE, sigma: SIGMA_VALUE * themeContext.scale_factor, });

        this._scaleChangedId = themeContext.connect('notify::scale-factor', () => { effect.sigma = SIGMA_VALUE * themeContext.scale_factor; });

        widget.add_effect(effect);
    }    

}

function init() { return new Blur(); }
