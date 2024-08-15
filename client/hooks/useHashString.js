export default function useHashString(){
    return  async (data)=>{
        const stringData = JSON.stringify(data)
        const encoder = new TextEncoder()
        const dataBuffer = encoder.encode(stringData)
        const hashBuffer = await crypto.subtle.digest('SHA-256',dataBuffer)
        const hashArray  = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        return hashHex
    }
}