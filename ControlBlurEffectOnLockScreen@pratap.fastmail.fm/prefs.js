'use strict';

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const ExtensionUtils = imports.misc.extensionUtils;

let Me = ExtensionUtils.getCurrentExtension();

const BLUR_SCHEMA = 'org.gnome.shell.extensions.blur';

const BuilderScope = GObject.registerClass({
  Implements: [Gtk.BuilderScope],
  }, class BuilderScope extends GObject.Object {
 
  vfunc_create_closure(builder, handlerName, flags, connectObject) {
   return this[handlerName].bind(connectObject);
  }
  
  brightness_changed(connectObject) {
        let value = connectObject.get_value();
        ExtensionUtils.getSettings(BLUR_SCHEMA).set_double('brightness', value);
   }
   
  sigma_changed(connectObject) {
        let value = connectObject.get_value();
        ExtensionUtils.getSettings(BLUR_SCHEMA).set_int('sigma', value);
  }
   
  });
   
function init() {
  }

function buildPrefsWidget () {
  
    let builder = new Gtk.Builder();
    builder.set_scope(new BuilderScope());
    builder.add_from_file(Me.dir.get_path() + '/prefs.ui');
    
        let BRIGHTNESS_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_double('brightness');
        builder.get_object("brightness_scale").set_value(BRIGHTNESS_VALUE);

        let SIGMA_VALUE = ExtensionUtils.getSettings(BLUR_SCHEMA).get_int('sigma');
        builder.get_object("sigma_scale").set_value(SIGMA_VALUE);
  
    return builder.get_object('main_frame');
  }
  
  
