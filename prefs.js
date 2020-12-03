'use strict';

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;

let Extension = imports.misc.extensionUtils.getCurrentExtension();

const BLUR_SCHEMA = 'org.gnome.shell.extensions.blur';

function init() {
}

function buildPrefsWidget() {
    let widget = new PrefsWidget();
    widget.show_all();
    return widget;
}

const PrefsWidget = new GObject.Class({
    Name: "My.Prefs.Widget",
    GTypeName: "PrefsWidget",
    Extends: Gtk.ScrolledWindow,

    _init: function (params) {
        this.parent(params);

        let builder = new Gtk.Builder();
        builder.set_translation_domain('Preferences');
        builder.add_from_file(Extension.path + '/prefs.ui');
        this.connect("destroy", Gtk.main_quit);

        // ! brightness value
        let BRIGHTNESS_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_double('brightness');
        builder.get_object("brightness_scale").set_value(BRIGHTNESS_VALUE);

        // ! sigma value
        let SIGMA_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_int('sigma');
        builder.get_object("sigma_scale").set_value(SIGMA_VALUE);

        // ! connect
        let SignalHandler = {
            brightness_changed(w) {
                let value = w.get_value();
                ExtensionUtils.getSettings(BLUR_SCHEMA).set_double('brightness', value);
            },

            sigma_changed(w) {
                let value = w.get_value();
                ExtensionUtils.getSettings(BLUR_SCHEMA).set_int('sigma', value);
            },
        };

        builder.connect_signals_full((builder, object, signal, handler) => {
            object.connect(signal, SignalHandler[handler].bind(this));
        });

        this.add(builder.get_object('main_frame'));
    }
});