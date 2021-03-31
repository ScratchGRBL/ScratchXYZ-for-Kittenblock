//#region  Heads
// @ts-ignore
var ArgumentType = Scratch.ArgumentType;
// @ts-ignore
var BlockType = Scratch.BlockType;
// @ts-ignore
var formatMessage = Scratch.formatMessage;
function Fmm(ID:string,Default:string){
    return formatMessage({id: ID,default: Default})
}
function Fm(ID:string){
    return formatMessage({id: ID,default: ID})
}

// @ts-ignore
var Log = Scratch.log;
// @ts-ignore
var React = Scratch.React;
// @ts-ignore
var RunTime:any = null;
var consoleOn = true;
function AlertError(text:string,returnValue:any=null){
    //@ts-ignore
    RunTime.emit("showAlert", {
        type: "error",
        msg: text
    })
    return returnValue;
}
function AlertInfo(text:string,returnValue:any=null){
    //@ts-ignore
    RunTime.emit("showAlert", {
        type: "error",
        msg: text
    })
    return returnValue;
}
const menuIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAGxSURBVDhPpZTLTgIxFIY7gMYL6oYFvoJbFoSwIcwEQphhNzyAa3duTXgCn8BHIK6MxoSJe5Y+hbqTeAGjQ+3ftOV0oF7CnzT9Z9p+Pac3ptVoNArKWj6O47yykKeKVk7V1hjW6VT3lWX1en1PWXTaUhbCYAowbcIXlbXJFFyr1baVFVGyPIr6tNromDg+2lTWDROyInPBgiA4UNadpopqJazXW4yxYDTlbGQ0TTkR5xKOyKIo6sNTmJXyr2kCdv/CC+MnLmAp/lNYNkorzewGhGE41zDUKE5Y5pwtRybUarV2wyg0sML4kcsOQtmUzSFFVMMhQ8c5vgErlUrvnueV0/TzfGeneDydzT5uzy7YV7UsxwGWJMkk66GlDeCDQS4d+dMIkQl1u93ndrt9KNMXcqYshNmsNAHjic/fbnyOWmyCc82or1QqG6hN2nrN0lHzRMNQJlf+DFC0uWD0kEtpGIRGfhf0AXu99lduwI8wemxwA3Q0D5fNU/lT6I8wuQ9m/WijC0A9vX40Q6n/wmj/JZhI2bxna8I8wMzjsCYMS7d4zelL4fL6nCnRKwuQKIx9A7vBwl6UCsXuAAAAAElFTkSuQmCC";
const blockIcon = menuIcon
function getEnum<T>(myenum:any,enumValue: number | string):string {
    return myenum[enumValue as keyof typeof myenum];
}
enum EmEcho{Nothing,ok,error,WaitSomeTime} 
enum EmG{G0 = 'G0', G1 = 'G1', '$J=' = "$J="}
enum EmLoca{Default = 'Default', G90 ='G90', G91 = 'G91'}
enum EmAxis{X,Y,Z,A,B}
enum EmState{DisConnected,NoneGRBL1_1,Connected,Idle,Jog,Home,Run,Hold,Alarm,Check,Door,Sleep}
enum EmHelpCommand{Help='Help',CancelMotions='CancelMotions'}
enum EmReporterGType{Wait='Wait',Code='Code'}

class Axis{
    constructor(axis:EmAxis = EmAxis.X,value:number = 0 ){
        this.Axis = axis;
        this.Value = value;
    }
    Axis = EmAxis.X;
    Value: number = 0;
    get AxiesName(){
        return ImEnumAxis.Names[this.Axis];
    }
    set AxiesName(name:string){
        this.Axis = ImEnumAxis.Axis(name);
    }
    get Gcode(){
        if(this.Value!=null){
            return ImEnumAxis.Name(this.Axis)+this.Value.toString();
        }
        return '';
    }
    get Copy():Axis{
        return new Axis(this.Axis, this.Value);
    }

}
class ImEnumAxis{
    static Count = Object.keys(EmAxis).length/2;
    static Names =  Object.keys(EmAxis).map((k: any) => EmAxis[k]).filter((v: any) => typeof v === 'string');   
    static Axises =Object.keys(EmAxis).map((k: any) => EmAxis[k]).filter((v: any) => typeof v === 'number').map(Number) 
    static Menu = ImEnumAxis.CreateMenu();
    static Name(axies:number){
        if(axies>-1 && axies<this.Axises.length){
            return ImEnumAxis.Names[axies];
        }
        return null;        
    }
    static Axis(name:string){
        return EmAxis[name as keyof typeof EmAxis];
    }
    static CreateMenu(){
        var menus = [];
        for(var i =0; i<this.Count; i++){
            menus.push({
                text: this.Names[i], value: this.Names[i]
            });
        }
        return menus;
    }
}

interface IGPointArgs { 
    GType:EmG, 
    Feed:number,
    LocateType:EmLoca, 
    Pos0:number,
    Pos1:number,
    Pos2:number,
    Pos3:number,
    Pos4:number,
    Valid:boolean,
} 

class GPoint{
    Axises = new Array<Axis>();
    G = EmG.G0;
    LocateType = EmLoca.G90;
    Others:string = null;// info other then the first G and axises info
    Feed:number = null;
    Error:string=null;
    get IsError(){
        return this.Error!=null;
    }
    //private prePoint:GPoint=null;
    private gcode:string = null;
    constructor(axisized:boolean = false){
        if(axisized)
            this.Axisize(); 
    }
    Axis(enAxis:EmAxis,force=true){
        for(let v of this.Axises){
            if(v.Axis==enAxis) return v;
        }
        if(!force) return null;
        var v = new Axis(enAxis);
        this.Axises.push(v);
        return v;
    }
    Axis_ByName(axiesName:string,force=true){
        var axies = ImEnumAxis.Axis(axiesName);
        return this.Axis(axies,force);
    }
    Axisize(){
        this.Axises.length =0;
        for(var i =0; i<ImEnumAxis.Count; i++){
            this.Axises.push(new Axis(i,0));
        }
    }
    get Copy():GPoint{
        var copy = new GPoint;
        for(let v of this.Axises){
            copy.Axises.push(v.Copy);
        }
        return copy;
    }

    set Gcode(gcode:string){
        this.gcode = gcode;
    }
    get Gcode(){
        if(this.gcode!=null)return this.gcode;
        var gode = '';
        for(let A of this.Axises)
            gode += ' '+ A.Gcode;
        if(this.Feed!=null && this.Feed>0)
            gode+=' F'+this.Feed.toString();
        if(this.G==EmG['$J='])
            gode =  this.G as string + gode.substring(1);
        else
            gode =  this.G as string+ gode;
        if(this.LocateType!=EmLoca.Default)
            return gode+' '+this.LocateType;
        return gode;
    }

    ParseXYZcode(text:string){
        this.gcode = text;
        this.Axises.length =0;
        if(text==null)  return;
        var lns = text.split(' ');
        if(lns.length>1){
            this.G = lns[0] as EmG;
            for(let i=0; i< lns.length-1;i++){
                var axies = ImEnumAxis.Axis(lns[i].charAt(0));
                if(axies){
                    var loca = new Axis(axies,parseFloat(lns[i].substring(1)));
                    this.Axises.push(loca);
                }
                else{
                    if(this.Others=null)
                        this.Others=lns[i];
                    else
                        this.Others+=" "+lns[i];
                }
            }
        }
        // ParseGcode(text:string){
        //     this.gcode = text;
        //     this.Axises.length =0;
        //     if(text==null)  return;
        //     var lns = text.split(' ');
        //     if(lns.length>1){
        //         this.G = lns[0] as EmG;
        //         for(let i=0; i< lns.length-1;i++){
        //             var axies = ImEnumAxis.Axis(lns[i].charAt(0));
        //             if(axies){
        //                 var loca = new Axis(axies,parseFloat(lns[i].substring(1)));
        //                 this.Axises.push(loca);
        //             }
        //             else{
        //                 if(this.Others=null)
        //                     this.Others=lns[i];
        //                 else
        //                     this.Others+=" "+lns[i];
        //             }
        //         }
        //     }
        // }
    }

    
    ParseArgs(args:IGPointArgs){
        args.Valid=false;
        this.G=args.GType;
        if(!this.G) this.G=EmG['$J='];
        this.LocateType = args.LocateType; 
        this.Feed = args.Feed;
        if(this.G==EmG['$J='] || this.G == EmG.G1 ){
            if(!args.Feed || args.Feed < 1){
                this.Error = "$J= or G1 command need Feed";
            }
        }
        for(var i=0;i<ImEnumAxis.Count;i++){
            var pos; eval("pos = args.Pos"+i.toString());
            if(pos!=''){
                this.Axis(i).Value =parseFloat(pos);
                args.Valid=true;
            }
        }
        this.gcode = this.Gcode;
        return args.Valid;
    }
}

class Command
{
    Text:string =null;
    Machine:Machine;
    Echoed = false;
    EchoType = EmEcho.ok;
    Echoes = new Array<string>();
    TimeToEcho = 500; //default milliseconds, for those commands without echoes and wait sometime to finished
    Reporter: any = null;
    Result: any = null;
    constructor(text:string=null){
        if(text==null)return;
        this.Text = text; 
    }
    get ToCom ():string{return this.Text;} // Return content for witing to machine com serial port
    Info(){console.info("Command: ", this.Text, typeof this);}
    OnMessaged(line:string){}
    Message(line:string){this.Echoes.push(line); this.OnMessaged(line);}
    OnEchoed(){}
    Echo(reportIt:boolean=true){
        this.Echoed = true;     
        this.OnEchoed();
        if(consoleOn) console.info( this.ToCom," >> ",this.OutputEchoesToConsole());
        if(reportIt) this.Report();
    }   
    OutputEchoesToConsole(){
        if(this.Result==null){
            return this.Echoes.join(" > ");
        }
        else{
            return  this.Result,this.Echoes.join(" > ");
        }      
    }
    Report(force:boolean=false){
        if(this.Reporter) {            
            this.Reporter(this.Result);
            this.Reporter =null;
        }
    }
    OnTimeOut(){}
}

class GCommand extends Command{
    GPoint=new GPoint();
    constructor(gcode:string = null){
        super(gcode);
        //if(gcode!=null) if (gcode!='') this.ParseGcode();
    }
    get ToCom():string{
        if(this.Text != null){
            return this.Text;
        }
        else{
            return this.GPoint.Gcode;
        }        
    }
    //ParseGcode(){this.GPoint.ParseGcode(this.Text);}
}

class GWaitCommand extends GCommand{
    Interval=50;//millisecond
    Idle=false;
    WaitFor:Command;
    constructor(){
        super('?');
        //if(gcode!=null) if (gcode!='') this.ParseGcode();
    }
    OnMessaged(line:string){
        if(line.startsWith("<")){
            this.Machine.Status.Parse(line);
            if(this.Machine.Status.State == EmState.Idle || this.Machine.Status.State ==  EmState.Sleep){
                this.Idle=true;
                this.Result=0;
            }
         }
    }
    OutputEchoesToConsole(){
        if(this.Idle) {return "Idle"}
        else return "waiting"
    }
    Report(force:boolean=false){
        if(this.Idle || force) {
            if(this.WaitFor)  this.Result=this.WaitFor.Result;
            super.Report();
        }
    }
}

class MachineStatus{
    Line = "";//<Idle|MPos:0.000,0.000,0.000,0.000,0.000|FS:0,0|WCO:100.000,0.000,0.000,0.000,0.000>
    Position = new GPoint(true);//MPos
    WPosition = new GPoint(true);//wco
    OVPosition = new GPoint(true);//ov
    Feed0 = 0;//FS
    Feed1 = 1;//FS
    State = EmState.Idle;
    get Name(){ return getEnum(EmState,this.State);}
    get IsIdle():boolean{return this.State == EmState.Idle;}
    Parse(line:string){
        this.Line = line;
        var lns = line.substring(1,line.length-2).split("|");
        //MPos
        var xyz = lns[1].substring(lns[1].indexOf(':')+1).split(',');
        this.State = EmState[lns[0] as keyof typeof EmState]
        for(var i = 0;i<ImEnumAxis.Count;i++){
            this.Position.Axises[i].Value=parseFloat(xyz[i]);
            //console.info(this.Position.Locations[i].Position);
        }
        //Feeds
        if(lns.length>2){
            var fs = lns[2].split(':')[1].split(',');
            this.Feed0 = parseInt(fs[0]);
            if(fs.length>1) this.Feed1 = parseInt(fs[1]);

        }
        //WPos or ov
        if(lns.length>3){
            var name_Poses = lns[3].split(':');
            var point = this.WPosition;
            if(name_Poses[0]=='OV')   point = this.OVPosition;
            var poses = name_Poses[1].split(',')
            for(var i = 0; i<poses.length; i++){
                point.Axises[i].Value=parseFloat(poses[i]);
            }
        }
    }
    AxisValue(AxiesName:string){
        var loc = this.Position.Axis_ByName(AxiesName,false);
        if(loc)  return loc.Value;
        return 0;
    }
}

//#endregion
class Machine {
    //#region  BASES
    GRBL:ScratchXYZ;
    Version = '';
    MSG ='';
    N0:string = '';
    N1:string = '';
    Infomation ='';

    DefaultFeed = 5000;

    DefaultIdleCheckInterval=100;

    Status = new MachineStatus();

    Commands = new Array<Command>();
    GCommands = new Array<Command>();
    RunedCommandCount = 0;
    //WaitCommands = new Array<Command>();
    Last:Command = null;
    private current: Command = null;
    CurrentWaitCommand:GWaitCommand=null;
    CancellingMotion=true;
    constructor() { }    
    get Connected(){ return this.Status.State>EmState.DisConnected;}
    get Current(){ return this.current; }
    set Current(cmd:Command){
        this.Last = this.current;
        this.current = cmd;
    }
    Com_Write(data:any){ }
    Com_Read(line:string){
        //console.info("->",line);
        if(this.RunedCommandCount==0){
            if(this.Version ==''){
                this.Version = line;
                if(consoleOn) console.info(line);
                return;
            }
            if(line.startsWith('[MSG:')){
                this.MSG = line;
                if(consoleOn) console.info(line);
                return;
            }

            if(this.N0=='') this.N0=line.substring(1,line.length-3);
            else this.N1=line.substring(1,line.length-3);
            if(consoleOn) console.info(line);
            return;
        }
        if(!this.Current){
            if(consoleOn) console.info(line);
        }
        else {//if has done 
            switch (this.Current.EchoType) {
                case EmEcho.ok:
                    if(line == "ok") { 
                        this.Current.Echo();
                        this.TryPopWrite();
                        return;                     
                    }
                    else if(line.startsWith("error")){
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
            //this.TryPopWrite(); 
        }
    }
    TryPop():Command{
        if(this.Commands.length>0){
            return this.Commands.shift();
        }

        if(this.CurrentWaitCommand){
            if(this.CurrentWaitCommand.Echoed){
                if(this.CurrentWaitCommand.Idle){
                    this.CurrentWaitCommand=null;
                }
                else{
                    this.CurrentWaitCommand.Echoed=false;
                    var e = this;
                    var waitcommand = this.CurrentWaitCommand;        
                    setTimeout(function () {
                        if(!waitcommand.Idle)
                            e.Push(waitcommand);
                    }, this.CurrentWaitCommand.Interval)
                    return;
                }
            }
            else{
                return;
            }
        }
 
        if(this.GCommands.length>0){
            var cmd = this.GCommands.shift() as Command;
            if(cmd instanceof GWaitCommand){
                this.CurrentWaitCommand = cmd;               
                return cmd;
            }
            else{
                //this.ConsumeGCommand(cmd as GCommand);
                return cmd;
            }
        }
        return null;
    }
    TryPopWrite(){
        if(this.Current == null){
            var cmd = this.TryPop();
            if(cmd!=null){
                this.RunedCommandCount++;
                this.Current = cmd;
                //this.Current.Info();
                this.Com_Write(this.Current.ToCom);
                switch (this.Current.EchoType) {
                    case EmEcho.Nothing:
                        this.Current.Echo();
                        this.Current = null;
                        this.TryPopWrite();
                        break;
                    case EmEcho.WaitSomeTime:
                        var e = this
                        setTimeout(function () {
                            e.current.OnTimeOut();
                            e.Current.Echo();
                            e.Current = null;
                            e.TryPopWrite();
                        }, e.Current.TimeToEcho)
                        break;
                    default:
                        break;
                }
            }
        }
        else if(this.Current.Echoed){
            this.Current = null;
            this.TryPopWrite();
        }
    }

    ClearCommands(){
        for(let cmd of this.GCommands){
            if(cmd) cmd.Report(true);
        }
        this.GCommands.length = 0;
        for(let cmd of this.Commands){
            if(cmd) cmd.Report(true);
        }
        this.Commands.length = 0;

        if(this.CurrentWaitCommand){
            this.CurrentWaitCommand.Idle=true;
            this.CurrentWaitCommand.Report(true);
            this.CurrentWaitCommand = null;
        }

        if(this.current){
            this.current.Report(true);
            this.current = null;
        }

        this.RunedCommandCount =0;
    }
    Connect(){
        if(this.Version.indexOf("Grbl 1.1")<0){
            this.Status.State = EmState.NoneGRBL1_1;
            return;
        }
        this.Status.State = EmState.Connected;
        this.Push_For_Information(); 
        if(this.MSG.indexOf("to unlock")>0){
            this.Push(new Command("$X"));
            this.MSG='';
        }
    }
    Disconnect() {
        this.Version ='';
        this.MSG ='';
        this.Infomation='';
        this.N0 ='';
        this.N1='';
        this.Status.State = EmState.DisConnected;
        this.ClearCommands();
    }
    Push(cmd:Command){
        this.Commands.push(cmd);
        this.TryPopWrite();
    }
    PushG(gcmd:GCommand){
        this.GCommands.push(gcmd);
        this.TryPopWrite();
    }
    GetWaitCommand(waitFor:Command=null,interval:number=null){
        var waitcommand = new GWaitCommand();
        waitcommand.Machine=this;
        waitcommand.WaitFor=waitFor;
        if(interval!=null) waitcommand.Interval=interval;
        else waitcommand.Interval=this.DefaultIdleCheckInterval;
        return waitcommand;
    }
    ReportWaitCommandForG(cmd:GCommand=null,interval:number=null){
        if(cmd) this.PushG(cmd);
        return this.ReporterG(this.GetWaitCommand(cmd,interval));   
    }

    Reporter(cmd:Command){
        var e = this;
        return new Promise(function (r) {
            cmd.Reporter = r,
            e.Push(cmd)
        })
    }
    ReporterG(cmd:GCommand){
        var e = this;
        return new Promise(function (r) {
            cmd.Reporter = r,
            e.PushG(cmd)
        })
    }

    Push_For_Information(){
        var cmd = new Command("$I");
        cmd.Machine = this; 
        //@ts-ignore
        cmd.firstLine = true;
        cmd.TimeToEcho = 300;
        cmd.OnMessaged = function(line:string){
            //@ts-ignore
            if(cmd.firstLine){
                cmd.Machine.Infomation = line.substring(1,line.length-1).split(":")[2];
                //@ts-ignore
                cmd.firstLine = false;
            }
            cmd.Result = cmd.Machine.Infomation;
        }
        this.Push(cmd);
    }

//#endregion


    Push_GPointArgs(args:IGPointArgs){
        var gcmd = new GCommand()
        gcmd.GPoint.ParseArgs(args);
        if( gcmd.GPoint.Error){
            AlertError("Feed can not be null");
            return;
        }
        this.PushG(gcmd);
    }

    Push_GPoint(gpoint:GPoint){
        var gcmd = new GCommand()
        gcmd.GPoint=gpoint;
        if( gcmd.GPoint.Error){
            AlertError("Feed can not be null");
            return;
        }
        this.PushG(gcmd);
    }


    ReportAxisValue(AxiesName:string){
        if(this.Last!=null){
            if(this.Last.Text=='?' && this.Last.Echoed && this.Status.IsIdle){
                return this.Status.AxisValue(AxiesName)  
            }
        }
        var cmd = new Command("?");
        cmd.Machine = this;       
        cmd.OnMessaged = function(line:string){
            if(line.startsWith("<")){
                this.Machine.Status.Parse(line);
                this.Result = this.Machine.Status.AxisValue(AxiesName)                
            }
        }
        return this.Reporter(cmd).then(ret => (ret));
    }
    ReportIdle(){
        if(this.Last!=null){
            if(this.Last.Text=='?' && this.Last.Echoed && this.Status.IsIdle){
                return true;  
            }
        }
        var cmd = new Command("?");
        cmd.Machine = this;       
        cmd.OnMessaged = function(line:string){
            if(line.startsWith("<")){
                this.Machine.Status.Parse(line);
                this.Result = this.Machine.Status.IsIdle                
            }
        }
        return this.Reporter(cmd).then(ret => (ret));
    }
}

class ScratchXYZ{ 
    //#region Normal
    EXTENSION_ID= "ScratchXYZ"; name = "Scratch XYZ"
    comm: any;    runtime: any
    decoder = new TextDecoder;   encoder = new TextEncoder;  lineBuffer=''
    Machine = new Machine()
    fs:any;
    constructor(runtime: any){
        this.runtime = runtime; 
        this.comm = new runtime.ioDevices.comm(this.EXTENSION_ID); 
        this.fs=runtime.ioDevices.fs;
        this.runtime.registerPeripheralExtension(this.EXTENSION_ID, this); 
        this.onmessage = this.onmessage.bind(this); 
        this.write = this.write.bind(this); 
        this.Machine.Com_Write = this.write.bind(this);
        this.Machine.GRBL=this;
        this.stopAll = this.stopAll.bind(this);
        this.runtime.on("PROJECT_STOP_ALL", this.stopAll);
        RunTime = this.runtime;
        //@ts-ignore
        //this.vm = vm;
    }
    write(data:any){        
        //console.info("----",data);
        this.comm.write(data+"\r")//\n
    }
    onmessage(t:any){
        var e = this.decoder.decode(t);
        if (this.lineBuffer += e, -1 !== this.lineBuffer.indexOf("\r\n")) {
            var lines = this.lineBuffer.split("\r\n");
            this.lineBuffer = lines.pop() as string;
            for (const l of lines){
                //console.info("->",l.trim())
                this.Machine.Com_Read(l.trim());
            }
        }
    }
    getDeviceList() {
        return this.comm.getDeviceList()
    }
    scan(){
        this.comm.getDeviceList().then((result: any) => {
            this.runtime.emit(this.runtime.constructor.PERIPHERAL_LIST_UPDATE, result);
        });
    }
    connect(id:any){
        var e = this;
        this.comm.connect(id).then(function (t:any) {
            e.comm.onmessage = e.onmessage,
            e.runtime.emit(e.runtime.constructor.PERIPHERAL_CONNECTED)

            setTimeout(function () {  
                e.Machine.Connect();
            }, 2e3)

        }).catch(function (t:any) {
            Log.warn("connect GRBL peripheral fail", t)
        })
    }
    disconnect(){
        this.comm.disconnect()
        this.Machine.Disconnect()
    }
    isConnected(){
        return this.comm.isConnected()
    }
    stopAll(arg0: string, stopAll: any) {
        //
    }
    sleep(t:any){
        return new Promise(function (e) {
            return setTimeout(e, t)
        })
    }
    //#endregion
    get Runable():boolean{
        if(! (this.Machine.Status.State>=EmState.Connected)){
            return AlertInfo("Connect Grbl 1.1 device first!",false);        
        }
        if(this.Machine.Status.State>EmState.Run){
            return AlertInfo('Machine is '+this.Machine.Status.Name+' reset device and connect again!',false);
        }
        return true;
    }
    Get_Axies(args:any){
        if(!this.Runable) return null;
        return this.Machine.ReportAxisValue(args.AxiesName);
    }
    Get_Idle(){
        if(!this.Runable) return null;
        return this.Machine.ReportIdle();
    }
    Goto_XYZ(args:any){
        if(!this.Runable) return;
        args.G=EmG['$J='];
        if(!args.Feed) args.Feed=this.Machine.DefaultFeed;
        else this.Machine.DefaultFeed = args.Feed;
        this.Machine.Push_GPointArgs(args);
    }
    Goto_XYZ_Gcode(args:any){
        var gcmd = new GCommand();
        args.G=EmG['$J='];
        if(!args.Feed) args.Feed=this.Machine.DefaultFeed;
        else this.Machine.DefaultFeed = args.Feed;  
        gcmd.GPoint.ParseArgs(args);
        //    return '';
        switch (args.ReporterGType) {
            case EmReporterGType.Wait:
                if(this.Runable){
                    this.Machine.PushG(gcmd);
                    gcmd.Result='';
                    return this.Machine.ReporterG(this.Machine.GetWaitCommand(gcmd));
                }
                else{
                    return '';
                }
            default:
                break;
        }    
        return gcmd.ToCom;
    }
    Send_Gcode(args:any){    
        return;
    }
    Help_Command(args:any){
        if(!args.CommandSel) return
        switch (args.CommandSel) {
            case EmHelpCommand.Help:
                this.fs.openSite("https://www.scratchGRBL.com/scratchxyz.html","_blank");
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
    //#region  menus
    Menu_Axies(){return ImEnumAxis.Menu;}
    //#endregion
    getInfo(){
        return {
            id: this.EXTENSION_ID,
            name: this.name,
            color1: '#0FBD8C',//'#5116ff',
            color2: '#0DA57A',//'#2c00af',
            menuIconURI: menuIcon,//blockIconURI: blockIcon,
            //blockIconURI: blockIcon,
            showStatusButton: true,
            blocks: [
                {opcode: 'Help_Command',
                blockType: BlockType.COMMAND,
                arguments: {
                    CommandSel:{
                        type:ArgumentType.STRING,
                        menu:"Menu_EnumHelpCommand",
                        defaultValue: EmHelpCommand.CancelMotions
                    },
                },
                text: '[CommandSel]'},  

                {opcode: 'Goto_XYZ',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GType: {
                            type: ArgumentType.STRING,
                            menu: "Menu_GType",
                            defaultValue: EmG['$J=']
                        },
                        Feed:{
                            type: ArgumentType.NUMBER
                        },
                        Pos0: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        Pos1: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        Pos2: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        Pos3: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        Pos4: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        LocateType: {
                        type: ArgumentType.STRING,
                        menu: "Menu_LocateType",
                        defaultValue: EmLoca.Default
                        }
                    },
                text: Fmm("Goto_XYZ","Go[LocateType][Pos0][Pos1][Pos2][Pos3][Pos4]Feed[Feed]"),},
                
                {opcode: 'Goto_XYZ_Gcode',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        GType: {
                            type: ArgumentType.STRING,
                            menu: "Menu_GTypeNonable",
                            defaultValue:EmG['$J=']
                        },  
                        Feed:{
                            type: ArgumentType.NUMBER
                        },          
                        Pos0: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        Pos1: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        Pos2: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        Pos3: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        Pos4: {
                            type: ArgumentType.NUMBER,
                            //defaultValue: 0
                        },
                        LocateType: {
                            type: ArgumentType.STRING,
                            menu: "Menu_LocateType",
                            defaultValue:  EmLoca.Default
                        },
                        ReporterGType: {
                            type: ArgumentType.STRING,
                            menu: "Menu_ReporterGType",
                            defaultValue:  EmReporterGType.Wait
                        },
                    },
                text:  Fmm("Goto_XYZ_Gcode", '[LocateType][Pos0][Pos1][Pos2][Pos3][Pos4]Feed[Feed][ReporterGType]') },
                {opcode: 'Send_Gcode',
                blockType: BlockType.COMMAND,
                arguments: {
                    Gcode: {
                        type: ArgumentType.STRING,
                        defaultValue: ""
                    } 
                },
                text: Fmm("Send_Gcode",'Go[Gcode]')},

                {opcode: 'Get_Axies',
                    blockType: BlockType.REPORTER,
                    arguments:{
                        AxiesName:{
                            type:ArgumentType.STRING,
                            menu:"Menu_Axies",
                            defaultValue: 'X'
                        } 
                    },
                text: Fmm("Get_Axies",'[AxiesName]')},

                {opcode: 'Get_Idle',
                    blockType: BlockType.BOOLEAN,
                text: Fmm( "Get_Idle", 'IDLE')},                
            ],
            menus: {
                Menu_LocateType:  [{
                    text: Fm("To"),
                    value: EmLoca.Default
                }, {
                    text: Fm("Offset"),
                    value: EmLoca.G91
                }],
                Menu_Axies: "Menu_Axies",
                Menu_ReporterGType:  [{
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
                    text: Fmm("CancelMotions",'Cancel Motions'),
                    value: EmHelpCommand.CancelMotions
                }],
            },
            translation_map: {
                "zh-cn": {
                    'Goto_XYZ':"走[LocateType][Pos0][Pos1][Pos2][Pos3][Pos4]速度[Feed]",
                    'Goto_XYZ_Gcode': "[LocateType][Pos0][Pos1][Pos2][Pos3][Pos4]速度[Feed][ReporterGType]",
                    'Get_Axies': '[AxiesName]',
                    'Send_Gcode': "走[Gcode]",
                    'Get_Idle': "空闲",
                    'To':'到',
                    'Wait':'等待',
                    'Offset':'偏移',
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
        }
    }
}

//@ts-ignore
module.exports = ScratchXYZ;