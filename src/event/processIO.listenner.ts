import { IOType, ProcessSubject } from "@app/core";
import { Subscription, tap } from "rxjs";
import { Socket } from "socket.io";

export class ProcessIOListener {
    subscription: Subscription;

    constructor(private socket: Socket, processIO : ProcessSubject){
        this.subscription = processIO.subscribe(this.event);
    }

    event = (io:IOType) =>{
        if(io.type == 'stderr' || io.type == 'stdout' || io.type == 'exit'){
            this.socket.emit(io.type, io.data);
        }
    }
}
