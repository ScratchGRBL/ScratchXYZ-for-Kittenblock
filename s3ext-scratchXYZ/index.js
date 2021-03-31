"use strict";
var ArgumentType = Scratch.ArgumentType;
var BlockType = Scratch.BlockType;
var formatMessage = Scratch.formatMessage;
function Fmm(ID, Default) {
    return formatMessage({ id: ID, default: Default });
}
function Fm(ID) {
    return formatMessage({ id: ID, default: ID });
}
var Log = Scratch.log;
var React = Scratch.React;
var RunTime = null;
var consoleOn = true;
function AlertError(text, returnValue = null) {
    RunTime.emit("showAlert", {
        type: "error",
        msg: text
    });
    return returnValue;
}
function AlertInfo(text, returnValue = null) {
    RunTime.emit("showAlert", {
        type: "error",
        msg: text
    });
    return returnValue;
}
const menuIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGxSURBVDhPpZTLTgIxFIY7gMYL6oYFvoJbFoSwIcwEQphhNzyAa3duTXgCn8BHIK6MxoSJe5Y+hbqTeAGjQ+3ftOV0oF7CnzT9Z9p+Pac3ptVoNArKWj6O47yykKeKVk7V1hjW6VT3lWX1en1PWXTaUhbCYAowbcIXlbXJFFyr1baVFVGyPIr6tNromDg+2lTWDROyInPBgiA4UNadpopqJazXW4yxYDTlbGQ0TTkR5xKOyKIo6sNTmJXyr2kCdv/CC+MnLmAp/lNYNkorzewGhGE41zDUKE5Y5pwtRybUarV2wyg0sML4kcsOQtmUzSFFVMMhQ8c5vgErlUrvnueV0/TzfGeneDydzT5uzy7YV7UsxwGWJMkk66GlDeCDQS4d+dMIkQl1u93ndrt9KNMXcqYshNmsNAHjic/fbnyOWmyCc82or1QqG6hN2nrN0lHzRMNQJlf+DFC0uWD0kEtpGIRGfhf0AXu99lduwI8wemxwA3Q0D5fNU/lT6I8wuQ9m/WijC0A9vX40Q6n/wmj/JZhI2bxna8I8wMzjsCYMS7d4zelL4fL6nCnRKwuQKIx9A7vBwl6UCsXuAAAAAElFTkSuQmCC";
const blockIcon = menuIcon;
function getEnum(myenum, enumValue) {
    return myenum[enumValue];
}
var EmEcho;
(function (EmEcho) {
    EmEcho[EmEcho["Nothing"] = 0] = "Nothing";
    EmEcho[EmEcho["ok"] = 1] = "ok";
    EmEcho[EmEcho["error"] = 2] = "error";
    EmEcho[EmEcho["WaitSomeTime"] = 3] = "WaitSomeTime";
})(EmEcho || (EmEcho = {}));
var EmG;
(function (EmG) {
    EmG["G0"] = "G0";
    EmG["G1"] = "G1";
    EmG["$J="] = "$J=";
})(EmG || (EmG = {}));
var EmLoca;
(function (EmLoca) {
    EmLoca["Default"] = "Default";
    EmLoca["G90"] = "G90";
    EmLoca["G91"] = "G91";
})(EmLoca || (EmLoca = {}));
var EmAxis;
(function (EmAxis) {
    EmAxis[EmAxis["X"] = 0] = "X";
    EmAxis[EmAxis["Y"] = 1] = "Y";
    EmAxis[EmAxis["Z"] = 2] = "Z";
    EmAxis[EmAxis["A"] = 3] = "A";
    EmAxis[EmAxis["B"] = 4] = "B";
})(EmAxis || (EmAxis = {}));
var EmState;
(function (EmState) {
    EmState[EmState["DisConnected"] = 0] = "DisConnected";
    EmState[EmState["NoneGRBL1_1"] = 1] = "NoneGRBL1_1";
    EmState[EmState["Connected"] = 2] = "Connected";
    EmState[EmState["Idle"] = 3] = "Idle";
    EmState[EmState["Jog"] = 4] = "Jog";
    EmState[EmState["Home"] = 5] = "Home";
    EmState[EmState["Run"] = 6] = "Run";
    EmState[EmState["Hold"] = 7] = "Hold";
    EmState[EmState["Alarm"] = 8] = "Alarm";
    EmState[EmState["Check"] = 9] = "Check";
    EmState[EmState["Door"] = 10] = "Door";
    EmState[EmState["Sleep"] = 11] = "Sleep";
})(EmState || (EmState = {}));
var EmHelpCommand;
(function (EmHelpCommand) {
    EmHelpCommand["Help"] = "Help";
    EmHelpCommand["CancelMotions"] = "CancelMotions";
})(EmHelpCommand || (EmHelpCommand = {}));
var EmReporterGType;
(function (EmReporterGType) {
    EmReporterGType["Wait"] = "Wait";
    EmReporterGType["Code"] = "Code";
})(EmReporterGType || (EmReporterGType = {}));
class Axis {
    constructor(axis = EmAxis.X, value = 0) {
        this.Axis = EmAxis.X;
        this.Value = 0;
        this.Axis = axis;
        this.Value = value;
    }
    get AxiesName() {
        return ImEnumAxis.Names[this.Axis];
    }
    set AxiesName(name) {
        this.Axis = ImEnumAxis.Axis(name);
    }
    get Gcode() {
        if (this.Value != null) {
            return ImEnumAxis.Name(this.Axis) + this.Value.toString();
        }
        return '';
    }
    get Copy() {
        return new Axis(this.Axis, this.Value);
    }
}
class ImEnumAxis {
    static Name(axies) {
        if (axies > -1 && axies < this.Axises.length) {
            return ImEnumAxis.Names[axies];
        }
        return null;
    }
    static Axis(name) {
        return EmAxis[name];
    }
    static CreateMenu() {
        var menus = [];
        for (var i = 0; i < this.Count; i++) {
            menus.push({
                text: this.Names[i], value: this.Names[i]
            });
        }
        return menus;
    }
}
ImEnumAxis.Count = Object.keys(EmAxis).length / 2;
ImEnumAxis.Names = Object.keys(EmAxis).map((k) => EmAxis[k]).filter((v) => typeof v === 'string');
ImEnumAxis.Axises = Object.keys(EmAxis).map((k) => EmAxis[k]).filter((v) => typeof v === 'number').map(Number);
ImEnumAxis.Menu = ImEnumAxis.CreateMenu();
class GPoint {
    constructor(axisized = false) {
        this.Axises = new Array();
        this.G = EmG.G0;
        this.LocateType = EmLoca.G90;
        this.Others = null;
        this.Feed = null;
        this.Error = null;
        this.gcode = null;
        if (axisized)
            this.Axisize();
    }
    get IsError() {
        return this.Error != null;
    }
    Axis(enAxis, force = true) {
        for (let v of this.Axises) {
            if (v.Axis == enAxis)
                return v;
        }
        if (!force)
            return null;
        var v = new Axis(enAxis);
        this.Axises.push(v);
        return v;
    }
    Axis_ByName(axiesName, force = true) {
        var axies = ImEnumAxis.Axis(axiesName);
        return this.Axis(axies, force);
    }
    Axisize() {
        this.Axises.length = 0;
        for (var i = 0; i < ImEnumAxis.Count; i++) {
            this.Axises.push(new Axis(i, 0));
        }
    }
    get Copy() {
        var copy = new GPoint;
        for (let v of this.Axises) {
            copy.Axises.push(v.Copy);
        }
        return copy;
    }
    set Gcode(gcode) {
        this.gcode = gcode;
    }
    get Gcode() {
        if (this.gcode != null)
            return this.gcode;
        var gode = '';
        for (let A of this.Axises)
            gode += ' ' + A.Gcode;
        if (this.Feed != null && this.Feed > 0)
            gode += ' F' + this.Feed.toString();
        if (this.G == EmG['$J='])
            gode = this.G + gode.substring(1);
        else
            gode = this.G + gode;
        if (this.LocateType != EmLoca.Default)
            return gode + ' ' + this.LocateType;
        return gode;
    }
    ParseXYZcode(text) {
        this.gcode = text;
        this.Axises.length = 0;
        if (text == null)
            return;
        var lns = text.split(' ');
        if (lns.length > 1) {
            this.G = lns[0];
            for (let i = 0; i < lns.length - 1; i++) {
                var axies = ImEnumAxis.Axis(lns[i].charAt(0));
                if (axies) {
                    var loca = new Axis(axies, parseFloat(lns[i].substring(1)));
                    this.Axises.push(loca);
                }
                else {
                    if (this.Others = null)
                        this.Others = lns[i];
                    else
                        this.Others += " " + lns[i];
                }
            }
        }
    }
    ParseArgs(args) {
        args.Valid = false;
        this.G = args.GType;
        if (!this.G)
            this.G = EmG['$J='];
        this.LocateType = args.LocateType;
        this.Feed = args.Feed;
        if (this.G == EmG['$J='] || this.G == EmG.G1) {
            if (!args.Feed || args.Feed < 1) {
                this.Error = "$J= or G1 command need Feed";
            }
        }
        for (var i = 0; i < ImEnumAxis.Count; i++) {
            var pos;
            eval("pos = args.Pos" + i.toString());
            if (pos != '') {
                this.Axis(i).Value = parseFloat(pos);
                args.Valid = true;
            }
        }
        this.gcode = this.Gcode;
        return args.Valid;
    }
}
class Command {
    constructor(text = null) {
        this.Text = null;
        this.Echoed = false;
        this.EchoType = EmEcho.ok;
        this.Echoes = new Array();
        this.TimeToEcho = 500;
        this.Reporter = null;
        this.Result = null;
        if (text == null)
            return;
        this.Text = text;
    }
    get ToCom() { return this.Text; }
    Info() { console.info("Command: ", this.Text, typeof this); }
    OnMessaged(line) { }
    Message(line) { this.Echoes.push(line); this.OnMessaged(line); }
    OnEchoed() { }
    Echo(reportIt = true) {
        this.Echoed = true;
        this.OnEchoed();
        if (consoleOn)
            console.info(this.ToCom, " >> ", this.OutputEchoesToConsole());
        if (reportIt)
            this.Report();
    }
    OutputEchoesToConsole() {
        if (this.Result == null) {
            return this.Echoes.join(" > ");
        }
        else {
            return this.Result, this.Echoes.join(" > ");
        }
    }
    Report(force = false) {
        if (this.Reporter) {
            this.Reporter(this.Result);
            this.Reporter = null;
        }
    }
    OnTimeOut() { }
}
class GCommand extends Command {
    constructor(gcode = null) {
        super(gcode);
        this.GPoint = new GPoint();
    }
    get ToCom() {
        if (this.Text != null) {
            return this.Text;
        }
        else {
            return this.GPoint.Gcode;
        }
    }
}
class GWaitCommand extends GCommand {
    constructor() {
        super('?');
        this.Interval = 50;
        this.Idle = false;
    }
    OnMessaged(line) {
        if (line.startsWith("<")) {
            this.Machine.Status.Parse(line);
            if (this.Machine.Status.State == EmState.Idle || this.Machine.Status.State == EmState.Sleep) {
                this.Idle = true;
                this.Result = 0;
            }
        }
    }
    OutputEchoesToConsole() {
        if (this.Idle) {
            return "Idle";
        }
        else
            return "waiting";
    }
    Report(force = false) {
        if (this.Idle || force) {
            if (this.WaitFor)
                this.Result = this.WaitFor.Result;
            super.Report();
        }
    }
}
class MachineStatus {
    constructor() {
        this.Line = "";
        this.Position = new GPoint(true);
        this.WPosition = new GPoint(true);
        this.OVPosition = new GPoint(true);
        this.Feed0 = 0;
        this.Feed1 = 1;
        this.State = EmState.Idle;
    }
    get Name() { return getEnum(EmState, this.State); }
    get IsIdle() { return this.State == EmState.Idle; }
    Parse(line) {
        this.Line = line;
        var lns = line.substring(1, line.length - 2).split("|");
        var xyz = lns[1].substring(lns[1].indexOf(':') + 1).split(',');
        this.State = EmState[lns[0]];
        for (var i = 0; i < ImEnumAxis.Count; i++) {
            this.Position.Axises[i].Value = parseFloat(xyz[i]);
        }
        if (lns.length > 2) {
            var fs = lns[2].split(':')[1].split(',');
            this.Feed0 = parseInt(fs[0]);
            if (fs.length > 1)
                this.Feed1 = parseInt(fs[1]);
        }
        if (lns.length > 3) {
            var name_Poses = lns[3].split(':');
            var point = this.WPosition;
            if (name_Poses[0] == 'OV')
                point = this.OVPosition;
            var poses = name_Poses[1].split(',');
            for (var i = 0; i < poses.length; i++) {
                point.Axises[i].Value = parseFloat(poses[i]);
            }
        }
    }
    AxisValue(AxiesName) {
        var loc = this.Position.Axis_ByName(AxiesName, false);
        if (loc)
            return loc.Value;
        return 0;
    }
}
class Machine {
    constructor() {
        this.Version = '';
        this.MSG = '';
        this.N0 = '';
        this.N1 = '';
        this.Infomation = '';
        this.DefaultFeed = 5000;
        this.DefaultIdleCheckInterval = 100;
        this.Status = new MachineStatus();
        this.Commands = new Array();
        this.GCommands = new Array();
        this.RunedCommandCount = 0;
        this.Last = null;
        this.current = null;
        this.CurrentWaitCommand = null;
        this.CancellingMotion = true;
    }
    get Connected() { return this.Status.State > EmState.DisConnected; }
    get Current() { return this.current; }
    set Current(cmd) {
        this.Last = this.current;
        this.current = cmd;
    }
    Com_Write(data) { }
    Com_Read(line) {
        if (this.RunedCommandCount == 0) {
            if (this.Version == '') {
                this.Version = line;
                if (consoleOn)
                    console.info(line);
                return;
            }
            if (line.startsWith('[MSG:')) {
                this.MSG = line;
                if (consoleOn)
                    console.info(line);
                return;
            }
            if (this.N0 == '')
                this.N0 = line.substring(1, line.length - 3);
            else
                this.N1 = line.substring(1, line.length - 3);
            if (consoleOn)
                console.info(line);
            return;
        }
        if (!this.Current) {
            if (consoleOn)
                console.info(line);
        }
        else {
            switch (this.Current.EchoType) {
                case EmEcho.ok:
                    if (line == "ok") {
                        this.Current.Echo();
                        this.TryPopWrite();
                        return;
                    }
                    else if (line.startsWith("error")) {
                        AlertError(line);
                        console.error(line);
                        this.current.Info();
                        this.Current.Echo();
                        this.Current = null;
                        this.TryPopWrite();
                        return;
                    }
                    break;
                default:
                    break;
            }
            this.Current.Message(line);
        }
    }
    TryPop() {
        if (this.Commands.length > 0) {
            return this.Commands.shift();
        }
        if (this.CurrentWaitCommand) {
            if (this.CurrentWaitCommand.Echoed) {
                if (this.CurrentWaitCommand.Idle) {
                    this.CurrentWaitCommand = null;
                }
                else {
                    this.CurrentWaitCommand.Echoed = false;
                    var e = this;
                    var waitcommand = this.CurrentWaitCommand;
                    setTimeout(function () {
                        if (!waitcommand.Idle)
                            e.Push(waitcommand);
                    }, this.CurrentWaitCommand.Interval);
                    return;
                }
            }
            else {
                return;
            }
        }
        if (this.GCommands.length > 0) {
            var cmd = this.GCommands.shift();
            if (cmd instanceof GWaitCommand) {
                this.CurrentWaitCommand = cmd;
                return cmd;
            }
            else {
                return cmd;
            }
        }
        return null;
    }
    TryPopWrite() {
        if (this.Current == null) {
            var cmd = this.TryPop();
            if (cmd != null) {
                this.RunedCommandCount++;
                this.Current = cmd;
                this.Com_Write(this.Current.ToCom);
                switch (this.Current.EchoType) {
                    case EmEcho.Nothing:
                        this.Current.Echo();
                        this.Current = null;
                        this.TryPopWrite();
                        break;
                    case EmEcho.WaitSomeTime:
                        var e = this;
                        setTimeout(function () {
                            e.current.OnTimeOut();
                            e.Current.Echo();
                            e.Current = null;
                            e.TryPopWrite();
                        }, e.Current.TimeToEcho);
                        break;
                    default:
                        break;
                }
            }
        }
        else if (this.Current.Echoed) {
            this.Current = null;
            this.TryPopWrite();
        }
    }
    ClearCommands() {
        for (let cmd of this.GCommands) {
            if (cmd)
                cmd.Report(true);
        }
        this.GCommands.length = 0;
        for (let cmd of this.Commands) {
            if (cmd)
                cmd.Report(true);
        }
        this.Commands.length = 0;
        if (this.CurrentWaitCommand) {
            this.CurrentWaitCommand.Idle = true;
            this.CurrentWaitCommand.Report(true);
            this.CurrentWaitCommand = null;
        }
        if (this.current) {
            this.current.Report(true);
            this.current = null;
        }
        this.RunedCommandCount = 0;
    }
    Connect() {
        if (this.Version.indexOf("Grbl 1.1") < 0) {
            this.Status.State = EmState.NoneGRBL1_1;
            return;
        }
        this.Status.State = EmState.Connected;
        this.Push_For_Information();
        if (this.MSG.indexOf("to unlock") > 0) {
            this.Push(new Command("$X"));
            this.MSG = '';
        }
    }
    Disconnect() {
        this.Version = '';
        this.MSG = '';
        this.Infomation = '';
        this.N0 = '';
        this.N1 = '';
        this.Status.State = EmState.DisConnected;
        this.ClearCommands();
    }
    Push(cmd) {
        this.Commands.push(cmd);
        this.TryPopWrite();
    }
    PushG(gcmd) {
        this.GCommands.push(gcmd);
        this.TryPopWrite();
    }
    GetWaitCommand(waitFor = null, interval = null) {
        var waitcommand = new GWaitCommand();
        waitcommand.Machine = this;
        waitcommand.WaitFor = waitFor;
        if (interval != null)
            waitcommand.Interval = interval;
        else
            waitcommand.Interval = this.DefaultIdleCheckInterval;
        return waitcommand;
    }
    ReportWaitCommandForG(cmd = null, interval = null) {
        if (cmd)
            this.PushG(cmd);
        return this.ReporterG(this.GetWaitCommand(cmd, interval));
    }
    Reporter(cmd) {
        var e = this;
        return new Promise(function (r) {
            cmd.Reporter = r,
                e.Push(cmd);
        });
    }
    ReporterG(cmd) {
        var e = this;
        return new Promise(function (r) {
            cmd.Reporter = r,
                e.PushG(cmd);
        });
    }
    Push_For_Information() {
        var cmd = new Command("$I");
        cmd.Machine = this;
        cmd.firstLine = true;
        cmd.TimeToEcho = 300;
        cmd.OnMessaged = function (line) {
            if (cmd.firstLine) {
                cmd.Machine.Infomation = line.substring(1, line.length - 1).split(":")[2];
                cmd.firstLine = false;
            }
            cmd.Result = cmd.Machine.Infomation;
        };
        this.Push(cmd);
    }
    Push_GPointArgs(args) {
        var gcmd = new GCommand();
        gcmd.GPoint.ParseArgs(args);
        if (gcmd.GPoint.Error) {
            AlertError("Feed can not be null");
            return;
        }
        this.PushG(gcmd);
    }
    Push_GPoint(gpoint) {
        var gcmd = new GCommand();
        gcmd.GPoint = gpoint;
        if (gcmd.GPoint.Error) {
            AlertError("Feed can not be null");
            return;
        }
        this.PushG(gcmd);
    }
    ReportAxisValue(AxiesName) {
        if (this.Last != null) {
            if (this.Last.Text == '?' && this.Last.Echoed && this.Status.IsIdle) {
                return this.Status.AxisValue(AxiesName);
            }
        }
        var cmd = new Command("?");
        cmd.Machine = this;
        cmd.OnMessaged = function (line) {
            if (line.startsWith("<")) {
                this.Machine.Status.Parse(line);
                this.Result = this.Machine.Status.AxisValue(AxiesName);
            }
        };
        return this.Reporter(cmd).then(ret => (ret));
    }
    ReportIdle() {
        if (this.Last != null) {
            if (this.Last.Text == '?' && this.Last.Echoed && this.Status.IsIdle) {
                return true;
            }
        }
        var cmd = new Command("?");
        cmd.Machine = this;
        cmd.OnMessaged = function (line) {
            if (line.startsWith("<")) {
                this.Machine.Status.Parse(line);
                this.Result = this.Machine.Status.IsIdle;
            }
        };
        return this.Reporter(cmd).then(ret => (ret));
    }
}
class ScratchXYZ {
    constructor(runtime) {
        this.EXTENSION_ID = "ScratchXYZ";
        this.name = "Scratch XYZ";
        this.decoder = new TextDecoder;
        this.encoder = new TextEncoder;
        this.lineBuffer = '';
        this.Machine = new Machine();
        this.runtime = runtime;
        this.comm = new runtime.ioDevices.comm(this.EXTENSION_ID);
        this.fs = runtime.ioDevices.fs;
        this.runtime.registerPeripheralExtension(this.EXTENSION_ID, this);
        this.onmessage = this.onmessage.bind(this);
        this.write = this.write.bind(this);
        this.Machine.Com_Write = this.write.bind(this);
        this.Machine.GRBL = this;
        this.stopAll = this.stopAll.bind(this);
        this.runtime.on("PROJECT_STOP_ALL", this.stopAll);
        RunTime = this.runtime;
    }
    write(data) {
        this.comm.write(data + "\r");
    }
    onmessage(t) {
        var e = this.decoder.decode(t);
        if (this.lineBuffer += e, -1 !== this.lineBuffer.indexOf("\r\n")) {
            var lines = this.lineBuffer.split("\r\n");
            this.lineBuffer = lines.pop();
            for (const l of lines) {
                this.Machine.Com_Read(l.trim());
            }
        }
    }
    getDeviceList() {
        return this.comm.getDeviceList();
    }
    scan() {
        this.comm.getDeviceList().then((result) => {
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
        });
    }
    connect(id) {
        var e = this;
        this.comm.connect(id).then(function (t) {
            e.comm.onmessage = e.onmessage,
                e.runtime.emit(e.runtime.constructor.PERIPHERAL_CONNECTED);
            setTimeout(function () {
                e.Machine.Connect();
            }, 2e3);
        }).catch(function (t) {
            Log.warn("connect GRBL peripheral fail", t);
        });
    }
    disconnect() {
        this.comm.disconnect();
        this.Machine.Disconnect();
    }
    isConnected() {
        return this.comm.isConnected();
    }
    stopAll(arg0, stopAll) {
    }
    sleep(t) {
        return new Promise(function (e) {
            return setTimeout(e, t);
        });
    }
    get Runable() {
        if (!(this.Machine.Status.State >= EmState.Connected)) {
            return AlertInfo("Connect Grbl 1.1 device first!", false);
        }
        if (this.Machine.Status.State > EmState.Run) {
            return AlertInfo('Machine is ' + this.Machine.Status.Name + ' reset device and connect again!', false);
        }
        return true;
    }
    Get_Axies(args) {
        if (!this.Runable)
            return null;
        return this.Machine.ReportAxisValue(args.AxiesName);
    }
    Get_Idle() {
        if (!this.Runable)
            return null;
        return this.Machine.ReportIdle();
    }
    Goto_XYZ(args) {
        if (!this.Runable)
            return;
        args.G = EmG['$J='];
        if (!args.Feed)
            args.Feed = this.Machine.DefaultFeed;
        else
            this.Machine.DefaultFeed = args.Feed;
        this.Machine.Push_GPointArgs(args);
    }
    Goto_XYZ_Gcode(args) {
        var gcmd = new GCommand();
        args.G = EmG['$J='];
        if (!args.Feed)
            args.Feed = this.Machine.DefaultFeed;
        else
            this.Machine.DefaultFeed = args.Feed;
        gcmd.GPoint.ParseArgs(args);
        switch (args.ReporterGType) {
            case EmReporterGType.Wait:
                if (this.Runable) {
                    this.Machine.PushG(gcmd);
                    gcmd.Result = '';
                    return this.Machine.ReporterG(this.Machine.GetWaitCommand(gcmd));
                }
                else {
                    return '';
                }
            default:
                break;
        }
        return gcmd.ToCom;
    }
    Send_Gcode(args) {
        return;
    }
    Help_Command(args) {
        if (!args.CommandSel)
            return;
        switch (args.CommandSel) {
            case EmHelpCommand.Help:
                this.fs.openSite("https://www.scratchGRBL.com/scratchxyz.html", "_blank");
                break;
            case EmHelpCommand.CancelMotions:
                this.Machine.ClearCommands();
                this.Machine.Push(new Command(String.fromCharCode(0X85)));
                break;
            default:
                break;
        }
        return;
    }
    Menu_Axies() { return ImEnumAxis.Menu; }
    getInfo() {
        return {
            id: this.EXTENSION_ID,
            name: this.name,
            color1: '#0FBD8C',
            color2: '#0DA57A',
            menuIconURI: menuIcon,
            showStatusButton: true,
            blocks: [
                { opcode: 'Help_Command',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        CommandSel: {
                            type: ArgumentType.STRING,
                            menu: "Menu_EnumHelpCommand",
                            defaultValue: EmHelpCommand.CancelMotions
                        },
                    },
                    text: '[CommandSel]' },
                { opcode: 'Goto_XYZ',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GType: {
                            type: ArgumentType.STRING,
                            menu: "Menu_GType",
                            defaultValue: EmG['$J=']
                        },
                        Feed: {
                            type: ArgumentType.NUMBER
                        },
                        Pos0: {
                            type: ArgumentType.NUMBER,
                        },
                        Pos1: {
                            type: ArgumentType.NUMBER,
                        },
                        Pos2: {
                            type: ArgumentType.NUMBER,
                        },
                        Pos3: {
                            type: ArgumentType.NUMBER,
                        },
                        Pos4: {
                            type: ArgumentType.NUMBER,
                        },
                        LocateType: {
                            type: ArgumentType.STRING,
                            menu: "Menu_LocateType",
                            defaultValue: EmLoca.Default
                        }
                    },
                    text: Fmm("Goto_XYZ", "Go[LocateType][Pos0][Pos1][Pos2][Pos3][Pos4]Feed[Feed]"), },
                { opcode: 'Goto_XYZ_Gcode',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        GType: {
                            type: ArgumentType.STRING,
                            menu: "Menu_GTypeNonable",
                            defaultValue: EmG['$J=']
                        },
                        Feed: {
                            type: ArgumentType.NUMBER
                        },
                        Pos0: {
                            type: ArgumentType.NUMBER,
                        },
                        Pos1: {
                            type: ArgumentType.NUMBER,
                        },
                        Pos2: {
                            type: ArgumentType.NUMBER,
                        },
                        Pos3: {
                            type: ArgumentType.NUMBER,
                        },
                        Pos4: {
                            type: ArgumentType.NUMBER,
                        },
                        LocateType: {
                            type: ArgumentType.STRING,
                            menu: "Menu_LocateType",
                            defaultValue: EmLoca.Default
                        },
                        ReporterGType: {
                            type: ArgumentType.STRING,
                            menu: "Menu_ReporterGType",
                            defaultValue: EmReporterGType.Wait
                        },
                    },
                    text: Fmm("Goto_XYZ_Gcode", '[LocateType][Pos0][Pos1][Pos2][Pos3][Pos4]Feed[Feed][ReporterGType]') },
                { opcode: 'Send_Gcode',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        Gcode: {
                            type: ArgumentType.STRING,
                            defaultValue: ""
                        }
                    },
                    text: Fmm("Send_Gcode", 'Go[Gcode]') },
                { opcode: 'Get_Axies',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        AxiesName: {
                            type: ArgumentType.STRING,
                            menu: "Menu_Axies",
                            defaultValue: 'X'
                        }
                    },
                    text: Fmm("Get_Axies", '[AxiesName]') },
                { opcode: 'Get_Idle',
                    blockType: BlockType.BOOLEAN,
                    text: Fmm("Get_Idle", 'IDLE') },
            ],
            menus: {
                Menu_LocateType: [{
                        text: Fm("To"),
                        value: EmLoca.Default
                    }, {
                        text: Fm("Offset"),
                        value: EmLoca.G91
                    }],
                Menu_Axies: "Menu_Axies",
                Menu_ReporterGType: [{
                        text: Fm(EmReporterGType.Wait),
                        value: EmReporterGType.Wait
                    }, {
                        text: Fm(EmReporterGType.Code),
                        value: EmReporterGType.Code
                    }],
                Menu_EnumHelpCommand: [{
                        text: Fm(EmHelpCommand.Help),
                        value: EmHelpCommand.Help
                    }, {
                        text: Fmm("CancelMotions", 'Cancel Motions'),
                        value: EmHelpCommand.CancelMotions
                    }],
            },
            translation_map: {
                "zh-cn": {
                    'Goto_XYZ': "走[LocateType][Pos0][Pos1][Pos2][Pos3][Pos4]速度[Feed]",
                    'Goto_XYZ_Gcode': "[LocateType][Pos0][Pos1][Pos2][Pos3][Pos4]速度[Feed][ReporterGType]",
                    'Get_Axies': '[AxiesName]',
                    'Send_Gcode': "走[Gcode]",
                    'Get_Idle': "空闲",
                    'To': '到',
                    'Wait': '等待',
                    'Offset': '偏移',
                    Menu_ReporterGType: {
                        "Wait": '等待',
                        'Code': '代码'
                    },
                    Menu_LocateType: {
                        'To': '到',
                        'Offset': '偏移'
                    },
                    Menu_EnumHelpCommand: {
                        'Help': '帮助',
                        'Cancel Motions': '取消动作'
                    },
                }
            }
        };
    }
}
module.exports = ScratchXYZ;
