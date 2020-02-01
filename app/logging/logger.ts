
import { Request, Response } from "express-serve-static-core";

let tabSpaceSize = 2;
let tabStr = "  ";

export let requestBoxLog = (msg: string) => {
  let msgFin = "│ " + msg + " │";
  let msgTop = "┌" + ((msgFinIn: string) => {
    let str = "";
    for (let i = 0; i < msgFinIn.length - 2; i++) {
      str += "─";
    }
    return str;
  })(msgFin) + "┐";
  let msgBottom = "└" + ((msgFinIn: string) => {
    let str = "";
    for (let i = 0; i < msgFinIn.length - 2; i++) {
      if (i == tabSpaceSize - 1) {
        str += "┬";
      } else {
        str += "─";
      }
    }
    return str;
  })(msgFin) + "┘";
  console.log(msgTop);
  console.log(msgFin);
  console.log(msgBottom);
};

export let responseBoxLog = (msg: string) => {
  let maxMsgLen = 60;
  let msgFin = "";
  let msgLen = Math.min(msg.length, maxMsgLen);
  if (msg.length + 4 < maxMsgLen && !msg.includes("\n")) {
    msgFin = "│ " + msg + ((value: string) => {
      let concatStr = "";
      for (let i = 0; i < msgLen - value.length - 4; i++) {
        concatStr += " ";
      }
      return concatStr;
    })(msg) + " │";
  } else {
    let strs = msg.split('\n');
    if (strs.length <= 1) {
      strs = [];
      strs.unshift("RESPONSE OF:");
      for (let i = 0; i < msg.length; i += maxMsgLen) {
        strs.push(((msgFinIn: string) => {
          let str = "│ ";
          str += msg.substr(i, Math.min(i + maxMsgLen - 4, msgFinIn.length));
          let fin = " │";
          return str + fin;
        })(msg));
      }
    } else {
      strs.unshift("RESPONSE OF:");
      for (let i = 0; i < strs.length; i++) {
        let line = strs[i];
        if (line.length > maxMsgLen - 4) {
          strs.splice(i, 1, line.substr(0, maxMsgLen - 4), line.substr(maxMsgLen - 4, line.length));
        }
        if (i > 50)
          break
      }
      strs.forEach((val: any, ind: number) => {
        strs[ind] = "│ " + val + ((value: string) => {
          let concatStr = "";
          for (let i = 0; i < msgLen - value.length - 4; i++) {
            concatStr += " ";
          }
          return concatStr;
        })(val) + " │";
      });
    }
    msgFin = strs.reduce((prev: string, curr: string, currInd: number, arr: string[]) => {
      if (currInd == arr.length - 1) {
        return prev += curr;
      } else {
        return prev += (curr + "\n");
      }
    }, "");
  }
  let msgTop = "┌" + ((msgFinIn: string) => {
    let str = "";
    for (let i = 0; i < msgLen - 2; i++) {
      if (i == tabSpaceSize - 1) {
        str += "┴";
      } else {
        str += "─";
      }
    }
    return str;
  })(msg) + "┐";
  let msgBottom = "└" + ((msgFinIn: string) => {
    let str = "";
    for (let i = 0; i < msgLen - 2; i++) {
      str += "─";
    }
    return str;
  })(msg) + "┘";
  console.log(msgTop);
  console.log(msgFin);
  console.log(msgBottom);
};

export function doLog(returned: any, status: boolean, thisArg: any, f: Function, req: Request, res: Response, args?: any[]) {
  requestBoxLog("REQUEST TO: " + req.url);
  let ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    ((req.connection as any)['socket'] ? (req.connection as any)['socket'].remoteAddress : null);
  console.log(tabStr + "├─── BY: " + ip);
  console.log(tabStr + "├─── AT: " + new Date().toString());
  if (!status) {
    console.log(tabStr + "├─── STATUS: REJECTED");
    console.log(tabStr + (req.url.toLowerCase() != "/logs/" ? "├" : "└") + "─── CALLED: " + f.name);
  } else {
    console.log(tabStr + "├─── STATUS: ACCEPTED");
    console.log(tabStr + (req.url.toLowerCase() != "/logs/" ? "├" : "└") + "─── CALLED: " + f.name);
  }
  if (!(!returned) && req.url.trim().toLowerCase() !== "/logs/") {
    let str: string = JSON.stringify(returned, null, 2);
    responseBoxLog(str);
  }
}