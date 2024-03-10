import { ProcessSubject } from "@app/core"
import { Subscription } from "rxjs"

export interface SocketData {
    process?:ProcessSubject
    outputSupscription?: Subscription
    endUserIP?: string
}
