export async function enableEthereum(ethereum: any) {
    let connectionResult: boolean = true
            
    await ethereum.enable()
        .catch((reason: string) => {
            alert(reason)
            connectionResult = false
        })
    return connectionResult
}