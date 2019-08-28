interface Point {
    x: number
    y: number
}

export default interface Parcel {
    address: string
    owner: string
    region: string
    municipality: string
    cadastreMunicipality: string
    coordinates: Point[]
}