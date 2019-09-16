import Identicon from 'identicon.js'
import jsSHA from 'jssha'
import Parcel from './models/parcel.model'

export function formDataToJson<T>(formData: FormData): T {
	const obj: any = {}
	for (const [key, value] of formData) {
		obj[key] = value
	}
	return obj as T
}

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const generateIdenticon = (address: string) => {
	let formatedString = address.toString()
	const shaObj = new jsSHA('SHA-512', 'TEXT')
	shaObj.update(formatedString)
	formatedString = shaObj.getHash('HEX')

	const data = new Identicon(formatedString.slice(2), 240)
	return `data:image/png;base64,${data}`
}

export const coordinatesToArray = (parcel: Parcel) => {
	type Coords = [number, number] 
	const array: Array<Coords> = parcel.coordinates
		.map(cooridnates => {
			return [cooridnates.x, cooridnates.y]
		})
	return array
} 