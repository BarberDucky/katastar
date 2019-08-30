import Identicon from 'identicon.js'

export function formDataToJson<T> (formData: FormData): T {
    const obj: any = {}
    for (const [key, value] of formData) {
        obj[key] = value
    }
    return obj as T
}
 
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const generateIdenticon = (address: string) => {
    const data = new Identicon(address.slice(2), 240)
    return `data:image/png;base64,${data}` 
}
