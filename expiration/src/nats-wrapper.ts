import nats, { Stan } from 'node-nats-streaming'

class NatsWrapper {
    private _client?: Stan

    get client(){

        if(!this._client){
            throw new Error('client not defined yet')
        }
        return this._client
    }

    connect(clusterId: string, clientId: string, url: string) {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
            this._client?.on('connect', () => {
                console.log("Nats Connected")
                resolve()
            })
            this._client?.on('error', (err) => {
                console.log("nats error ",err)
                reject(err)
            })
        })
    }
}

export const natsWrapper = new NatsWrapper()
