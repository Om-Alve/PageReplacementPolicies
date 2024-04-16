document.getElementById('submit').addEventListener('click', () => {
    let cols = parseInt(document.getElementById('cache_size').value);
    let pages = document.getElementById('pages').value.split(',').map(Number);
    let rows = pages.length;
    console.log(rows, cols, pages);
  
    let canvas = document.getElementById('canvas');
  
    while (canvas.firstChild) {
        canvas.firstChild.remove(); 
    }
    
    displayPolicy("Optimal", optimalPageReplacement, pages, cols);
    displayPolicy("FIFO", fifoPageReplacement, pages, cols);
    displayPolicy("LRU", lruPageReplacement, pages, cols);
});

function displayPolicy(policyName, pageReplacementFunction, pages, cols) {
    let table = document.createElement('table');
  
    // Add the first row with the pages
    let tr = document.createElement('tr');
    for (let i = 0; i < pages.length; i++) {
        let th = document.createElement('th');
        th.innerHTML = pages[i];
        tr.appendChild(th);
    }
    table.appendChild(tr);
  
    let pageFaults = pageReplacementFunction(pages, cols, table);
    let numHits = pages.length - pageFaults;
    let hitRatio = numHits / pages.length;
    let missRatio = pageFaults / pages.length;
  
    let policyTitle = document.createElement('h3');
    policyTitle.innerHTML = `${policyName} Page Replacement Policy`;
  
    let pageFaultsInfo = document.createElement('p');
    pageFaultsInfo.innerHTML = `Total Page Faults: ${pageFaults}`;
    
    let hitsInfo = document.createElement('p');
    hitsInfo.innerHTML = `Total Number of Hits: ${numHits}`;
    
    let hitRatioInfo = document.createElement('p');
    hitRatioInfo.innerHTML = `Hit Ratio: ${hitRatio.toFixed(2)}`;
    
    let missRatioInfo = document.createElement('p');
    missRatioInfo.innerHTML = `Miss Ratio: ${missRatio.toFixed(2)}`;
    
    canvas.appendChild(policyTitle);
    canvas.appendChild(table); 
    canvas.appendChild(pageFaultsInfo);
    canvas.appendChild(hitsInfo);
    canvas.appendChild(hitRatioInfo);
    canvas.appendChild(missRatioInfo);
}

function fifoPageReplacement(pages, cacheSize, table) {
    console.log("Cache size", cacheSize)
    let pageFaults = 0;
    let cache = new Set();
    let cache_state = [];
    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        if (!cache.has(page)) {
            pageFaults++;
            cache.add(page);
            if (cache.size > cacheSize) {
                let removedPage = cache.values().next().value; 
                cache.delete(removedPage);
            }
        }
        cache_state.push([...cache])
    }
    for (let i = 0; i < cacheSize; i++) {
        let temp = [];
        for (let j = 0; j < pages.length; j++) { 
            if (cache_state[j].length > i) {
                temp.push(cache_state[j][i]);
            } else {
                temp.push('');
            }
        }
        let tr = document.createElement('tr');
        for (let j = 0; j < temp.length; j++) {
            let td = document.createElement('td');
            td.innerHTML = temp[j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return pageFaults; 
}

function optimalPageReplacement(pages, cacheSize, table) {
    let pageFaults = 0;
    let cache = new Set();
    let cache_state = [];

    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        if (!cache.has(page)) {
            pageFaults++;
            if (cache.size === cacheSize) {
                let pageToReplace = null;
                let maxIndex = -1;
                for (let pageInCache of cache) {
                    let nextUse = pages.indexOf(pageInCache, i + 1);
                    if (nextUse === -1) {
                        pageToReplace = pageInCache;
                        break;
                    } else if (nextUse > maxIndex) {
                        maxIndex = nextUse;
                        pageToReplace = pageInCache;
                    }
                }
                cache.delete(pageToReplace);
            }
            cache.add(page);
        }
        cache_state.push([...cache]);
    }

    for (let i = 0; i < cacheSize; i++) {
        let temp = [];
        for (let j = 0; j < pages.length; j++) { 
            if (cache_state[j].length > i) {
                temp.push(cache_state[j][i]);
            } else {
                temp.push('');
            }
        }
        let tr = document.createElement('tr');
        for (let j = 0; j < temp.length; j++) {
            let td = document.createElement('td');
            td.innerHTML = temp[j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    return pageFaults;
}
function lruPageReplacement(pages, cacheSize, table) {
    let pageFaults = 0;
    let cache = [];
    let cache_state = [];

    for (let i = 0; i < pages.length; i++) {
        let page = pages[i];
        let pageIdx = cache.indexOf(page);
        if (pageIdx === -1) {
            pageFaults++;
            if (cache.length >= cacheSize) {
                cache.shift(); 
            }
        } else {
            cache.splice(pageIdx, 1); 
        }
        cache.push(page); 
        cache_state.push([...cache]);
    }

    for (let i = 0; i < cacheSize; i++) {
        let temp = [];
        for (let j = 0; j < pages.length; j++) { 
            if (cache_state[j].length > i) {
                temp.push(cache_state[j][i]);
            } else {
                temp.push('');
            }
        }
        let tr = document.createElement('tr');
        for (let j = 0; j < temp.length; j++) {
            let td = document.createElement('td');
            td.innerHTML = temp[j];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }    
    return pageFaults;
}
