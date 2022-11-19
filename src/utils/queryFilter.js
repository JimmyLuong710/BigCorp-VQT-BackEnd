
const queryFilter = (query, props) => {
    let result = {}
    for(let prop of props) {
        if(query[prop]) result[prop] = query[prop]
    }
    return result
}