const urlParams = new URLSearchParams(window.location.search)
const query = urlParams.get('query')
const displaySearchResults = async _ => {
    const results = await getQueryResults(query)
    console.log(results)
    const sortingCategory = ['tv', 'movie', 'person']
    const result_container = document.querySelector('.search-results-wrapper')
    for(element of sortingCategory) {
        console.log(`.search-results-options .${element}>.counter`)
        document.querySelector(`.search-results-options .${element}>.counter`).innerText = results[element].length
        const parentDiv = document.createElement('div')
        parentDiv.classList.add(`${element}--item`, 'mb-2')
        parentDiv.innerHTML = `
        <div class="d-flex row justify-content-between align-items-center gap-3 no-padding"></div>`
        if(!results[element].find(result => result.gender)) await createQueryItem(parentDiv.querySelector('div'), results[element], element)
        else await createPersonItem(parentDiv.querySelector('div'), results[element])
        result_container.appendChild(parentDiv)
        }
}
const createQueryItem = async (parentdiv, resultSet, element) => {
    for(result of resultSet) {
        console.log(result)
        if(result.poster_path && fetchImage(result.poster_path)) {
            var show_name = (result.title ? result.title : result.name).split(' ')
            if (Array.isArray(show_name)) show_name = show_name.join('-')
            console.log(show_name, result.popularity>70 && result.vote_count>200)
            const goToPageUrl = (result.popularity>70 && result.vote_count>200) ? `/movie.html?id=${result.id}&show_status=${element}` : `https://www.themoviedb.org/${element}/${result.id}-${show_name}`
            const date = result.release_date ? result.release_date : result.first_air_date
            const item_wrapper = document.createElement('div')
            item_wrapper.classList.add('result-item', 'rounded', 'bg-dark', 'overflow-hidden')
            item_wrapper.innerHTML = `
            <div class="d-flex align-items-center justify-content-start gap-3">
                <a href="${goToPageUrl}">
                <img class="search-img-poster clickable__movie-page" src="${fetchImage(result.poster_path)}" alt="">
                </a>
                <section class="result-query-details h-100 py-2">
                    <a href="${goToPageUrl}">
                        <div class="result-query-title bold-md font-xmd clickable__movie-page">${result.title ? result.title : result.name}</div>
                    </a>                                          
                    <div class="result-query-date font-1 text-secondary">${processDate(date)[1].month} ${processDate(date)[0].day}, ${processDate(date)[0].year}</div>
                    <p class="result-query-overview font-2 mb-0">${result.overview}</p>
                </section>
            </div>`
            parentdiv.appendChild(item_wrapper)
        }
    }
}
const createPersonItem = async (parentdiv, resultSet) => {
    resultSet.forEach(result => {
        console.log(result)
        if(result.profile_path && fetchImage(result.profile_path)) {
            const known_for = result.known_for.length>1 ? (result.known_for.sort((show1,show2) => {show2.popularity - show1.popularity}))[0] : result.known_for[0]
            const item_wrapper = document.createElement('div')
            item_wrapper.classList.add('person-result-item')
            item_wrapper.innerHTML = `
            <div class="d-flex align-items-center justify-content-start gap-4 px-3 py-2">
                <img class="person-poster rounded" src="${fetchImage(result.profile_path)}" alt="">
                <section class="person-profile-details d-flex row no-padding justify-content-between">
                    <div class="person-name mb-2 bold-md">${result.name}</div>                                          
                    <div class="person-more-details d-flex gap-2 justify-content-start align-items-center">
                        <span class="person-department bold-md">${result.known_for_department}</span>
                        <span class="dot"><i class="fa-solid fa-circle "></i></span>
                        <a class="person-known-for bold-sm" href="/movie.html?id=${result.id}&show_status=${'result.title' ? 'movie' : 'tv'}">${known_for.title ? known_for.title : known_for.name}</a>
                    </div>
                </section>
            </div>`
            
            parentdiv.appendChild(item_wrapper) 
        }
    })
}

window.onload = async _ => {
    await displaySearchResults()
    searching()
    const categories = document.querySelectorAll('.result-category');
    categories.forEach(category => {
        category.addEventListener('click', function() {
            categories.forEach(cat => cat.classList.remove('active-category'));
            this.classList.add('active-category');
            const allResults = document.querySelectorAll('.search-results-wrapper > div');
            allResults.forEach(result => result.style.display = 'none');
            const categoryResults = document.querySelectorAll(`.${this.classList[1]}--item`);
            categoryResults.forEach(result => result.style.display = 'block');
        });
    });
    categories[0].click();
}
