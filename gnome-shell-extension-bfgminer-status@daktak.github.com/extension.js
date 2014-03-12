/*
 * todo
 * config variables
 * host
 * port
 * number of decimals
 * refresh time
 *
 * refresh every x
 * drop down extra values
 */
const St = imports.gi.St;
const Main = imports.ui.main;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const GObject = imports.gi.GObject;



let button, bt;


function _getValue() {
      try {
      var client = new Gio.SocketClient ();
      var conn = client.connect_to_host("localhost:4028", null, null);

      //print("Connected to server");

      var output = conn.get_output_stream();
      var output_stream = new Gio.DataOutputStream(output);

      var message = JSON.stringify({ command: 'summary', parameter: '' } );

      output_stream.put_string(message,null);      
      output.flush(null);
      
      var input = conn.get_input_stream();
      var input_stream = new Gio.DataInputStream(input);
      var data = input_stream.read_upto("\n", 1, null);

      var dataS = data.toString();
      var data_out = dataS.substr(0,dataS.lastIndexOf('}')+1);
      var data_json = JSON.parse(data_out);
      var unit = " MHS";

      var num = parseFloat(data_json["SUMMARY"][0]["MHS av"]);
      if (num > 1000){
         num = num / 1000;
         unit = " GHS";
      }
      num = parseFloat(num).toFixed(0);
	
      } catch (err) {
      	return err.toString();
      }
      return num.toString()+unit;
}

function _update() {
    bt.set_text(_getValue());
}

function init() {
    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });
    bt = new St.Label({text:_( _getValue() )});
    button.set_child(bt);
    button.connect('button-press-event', _update);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
