export class SshConnectionConfig {
    username? : string;
    host? : string;
    port? : number;
    key? : string;

    toArray(){
        const config: string[] = []
        if(this.port)
            config.push("-p",this.port.toString())

        if (this.key)
            config.push("-i",this.key)

        if(this.username)
            config.push(`${this.username}@${this.host??'localhost'}`)
        else
            config.push(`${this.host??'localhost'}`)

        return config;
    };

    toString(){
        return this.toArray().join(" ");
    }
}
