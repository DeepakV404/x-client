const LocalCache = {}

if(localStorage.getItem('_jungle') == null){
    localStorage.setItem('_jungle', JSON.stringify({}))
} 

LocalCache.getData = (key) => {
    let local_data = JSON.parse(localStorage.getItem('_jungle'));
    return (local_data[key] !== undefined ) ? local_data[key] : "";
}

LocalCache.setData = (key, data) => {
    let local_data = JSON.parse(localStorage.getItem('_jungle'));
    local_data[key] = data;

    localStorage.setItem('_jungle',JSON.stringify(local_data))
}

export default LocalCache;