const urlParams = new URLSearchParams(window.location.search)
const Id = urlParams.get('id')
const show_status = urlParams.get('show_status')

async function setActive() {
    const clickedBtn = document.querySelectorAll('#menu-buttons>div.d-flex>button')
    clickedBtn.forEach(button => {
        button.addEventListener('click', () => {
            const activeBtn = document.querySelector('.active-button')
            if(activeBtn) activeBtn.classList.remove('active-button')
            button.classList.add('active-button')
        })
    })
}
async function getCrewDetails() {
    const data = await fetchJSON(getCrewDetailsURL(Id, show_status))
    if(!data) {
        document.getElementById('movie-direction-story-crew').style.display = None
        return
    }
    const crew = data.crew
    // Create a map to store crew members and their jobs
    let crewMap = new Map()
    crew.forEach(member => {
        if(crewMap.has(member.name)) {
            // If the crew member is already in the map, add the job to their list of jobs
            crewMap.get(member.name).jobs.push(member.job)
        } else {
            // If the crew member is not in the map, add them to the map
            crewMap.set(member.name, { jobs: [member.job], popularity: member.popularity })
        }
    })
    // Convert the map to an array of objects
    let crewArray = Array.from(crewMap, ([name, { jobs, popularity }]) => ({ name, jobs, popularity }))
    // Sort the array by popularity
    crewArray.sort((a, b) => b.popularity - a.popularity)
    // Get the two most popular crew members
    let mostPopularCrew = crewArray.slice(0, 2)
    return mostPopularCrew
}
function displayCrew(crewName) {
    // movie-directors and storyline
    const story_crew = document.querySelector('#movie-direction-story-crew>div')
    if(show_status==='movie') {
        crewName.forEach(crew => {
            const crew_li = document.createElement('section')
            crew_li.classList = 'h-100'
            story_crew.appendChild(crew_li)
            const flex_div = document.createElement('div')
            flex_div.classList.add('d-flex', 'row', 'gap-0', 'justify-content-between', 'align-items-center', 'no-padding')
            crew_li.appendChild(flex_div)
            const crew_member_name = document.createElement('span')
            crew_member_name.classList.add('crew-member-name', 'fw-bold')
            crew_member_name.innerText = crew.name
            const crew_member_roles = document.createElement('span')
            let jobs = crew.jobs
            crew_member_roles.className = 'crew-member-jobs'
            crew_member_roles.innerText = Array.isArray(jobs) ? jobs.join(', ') : jobs
            flex_div.appendChild(crew_member_name)
            flex_div.appendChild(crew_member_roles)
        })
    }
    else {
        const crew_li = document.createElement('li')
        story_crew.appendChild(crew_li)
        const flex_div = document.createElement('div')
        flex_div.classList.add('d-flex', 'row', 'gap-0', 'justify-content-between', 'align-items-center', 'no-padding')
        crew_li.appendChild(flex_div)
        const crew_member_name = document.createElement('span')
        crew_member_name.classList.add('crew-member-name', 'fw-bold')
        crew_member_name.innerText = crewName[0]
        const crew_member_role = document.createElement('span')
        crew_member_role.className = 'crew-member-jobs'
        crew_member_role.innerText = crewName[1]
        flex_div.appendChild(crew_member_name)
        flex_div.appendChild(crew_member_role)
    }
}
// for tv show only creator needed
const getCreatorDetails = (show_result) => {
    if(show_result.created_by[0])
        return [show_result.created_by[0].name,'Creator']
    else {
        document.getElementById('movie-direction-story-crew').style.display = 'None'
        return
    }
}
// to get movie status - movie available or not
const displayWatchProviders = async(id, show_status) => {
    let req_url = `https://api.themoviedb.org/3/${show_status}/${id}/watch/providers?api_key=${api_key}`
    let releaseDates = await fetchGenericURL(req_url)
    let releaseResult = releaseDates.IN ? releaseDates.IN : releaseDates.US
    if(!releaseResult) {
        document.querySelector('.movie-banner-img').classList.remove('rounded-bottom-0')
        document.querySelector('#movie-providers').style.display = 'None'
        return
    }
    var provider_status = document.getElementById('provider-status')
    var provider_link = document.getElementById('provider-link')
    provider_link.href = releaseResult.link
    var provider_img = document.querySelector('#provider>img')
    if(releaseResult.flatrate) {
        provider_status.innerText = 'Streaming Now'
        provider_link.innerText = 'Watch Now'
        provider_img.src = fetchImage(releaseResult.flatrate[0].logo_path)
    }
    else if(releaseResult.buy || releaseResult.rent) {
        provider_status.innerText = 'Available for Rent or Buy'
        provider_link.innerText = 'Buy/Rent Now'
        provider_img.src = fetchImage(releaseResult.buy ? releaseResult.buy[0].logo_path : releaseResult.rent[0].logo_path)
    }
    else {
        provider_status.innerText = 'Movie Available'
        provider_link.innerText = 'Watch Now'
        provider_img.src = fetchImage(releaseResult.ads[0].logo_path)
    }
}
const displayMovieDetails = async(result, crewName) => {
    await displayOverview(result, crewName)
    const local_dates = await movieReleaseDatesLocal(Id)
    document.getElementById('movie-release-date').innerText = local_dates!=null ? local_dates+" (IN)" : result.release_date
    // watch time
    var runtime_hr = (result.runtime/60)>1 ? Math.floor(result.runtime/60)+'h' : ''
    var runtime_min = (result.runtime%60)>1 ? result.runtime%60+'m' : ''
    document.getElementById('movie-time').innerText = `${runtime_hr} ${runtime_min}`    
    // movie cast, reviews, media
    // console.log(result)
}
const displayTVShowDetails = async(result, crewName) => {
    await displayOverview(result, crewName)
    // remove dots that are between release-year and local-release dates
    movie_secondary_details_div = document.getElementById('movie-secondary-details')
    document.querySelectorAll('.dot').forEach(div => {
        div.style.display = 'None'
    })
    // movie cast, reviews, media
    // console.log(result)
}
const displayOverview = async(result, crewName) => {
    // background image wrapper
    const bg_wrapper = document.getElementById('movie-bg-wrapper')
    let root = document.documentElement
    root.style.setProperty('--backdrop-image', `url(${fetchImage(result.backdrop_path)})`)
    // image poster
    bg_wrapper.querySelector('#movie-banner img').src = fetchImage(result.poster_path) 
    // service providers
    displayWatchProviders(Id, show_status)

    // movie_title
    document.getElementById('movie-name').innerText = result.title ? result.title : result.name
    // release year
    var release_year = show_status==='movie' ? result.release_date.split('-')[0] : result.first_air_date.split('-')[0]
    if(release_year==='' || !release_year)
        document.getElementById('movie-release-year').style.display = 'None'
    document.getElementById('movie-release-year').innerText = `(${release_year})`
    
    // for showing either movie is ua or 18+ or 19+
    const movie_certification_status = document.getElementById('movie-certification-status')
    movie_certification_status.innerText = await getMovieCertification(Id, show_status)
    // for showing genres
    const movie_secondary = document.getElementById('movie-secondary-details')
    let genre_list = []
    result.genres.forEach(element => {
        genre_list.push(element.name)
    })
    movie_secondary.querySelector('#movie-genre>div.col').innerText = genre_list.join(', ')
    // displays user ratings in circular progress bar
    displayCircularProgress(result.vote_average)
    // fav button
    document.querySelector('#add-to-favs>button').addEventListener('click', () => {
        let heartIcon = document.querySelector('#add-to-favs>button i')
        const defaultRed = getComputedStyle(document.documentElement).getPropertyValue('--heart-color').trim()
        heartIcon.style.color = heartIcon.style.color===defaultRed ? 'white' : defaultRed 
    })      

    const tagLine = result.tagline
    if(tagLine)
        document.querySelector('#movie-tagline>span').innerText = result.tagline
    else
        document.getElementById('movie-tagline').style.display = 'None'
    document.querySelector('#movie-overview p').innerText = result.overview
    if(crewName) displayCrew(crewName)
}
const displayMoreDetails = async (result) => {
    document.querySelector('#top-billed-cast h5').addEventListener('click', function() {
        goToCastPage(result.id, result.name ? result.name : result.title, show_status);
    });
    var movieCast = (await getMovieCast(Id, show_status)).cast;
    movieCast = movieCast.slice(0, 10);
    console.log(movieCast);
    if (!movieCast.length) return document.getElementById('top-billed-cast').style.display = 'none';
    if (show_status === 'tv') document.getElementById('top-billed-text').innerText = 'Series Cast';
    const list_wrap = document.querySelector('#top-billed-cast ul');
    movieCast.forEach((actor) => {
        createActorElement(actor, list_wrap); // no need to pass index and gap
    });
}

const createActorElement = (actor, parentElement) => {
    const actorElement = document.createElement('li');
    actorElement.className = 'movie-cast-item rounded overflow-hidden';
    actorElement.innerHTML = `
        <div class="d-flex row gap-0 align-items-center justify-content-top h-100 w-100">
            <a href="${fetchPersonProfile(actor.id)}" class="p-0 w-100 d-block">
                <img src="${fetchImage(actor.profile_path)}" class="actor-profile-img">
            </a>
            <section class="py-2 px-2">
                <div class="actor-info d-flex row gap-0 justify-content-start no-padding">
                    <a href="${fetchPersonProfile(actor.id)}" class="fw-bold font-sm nowrap-space w-75 p-0 text-light">${actor.name}</a>
                    <span class="text-secondary font-xsm nowrap-space w-75">${actor.character}</span>
                </div>
            </section>
        </div>`;
    parentElement.appendChild(actorElement);
}

const displayMovieStats = (result) => {
    console.log(result)
    let type = result.title ? 'tv' : 'movie'
    const statSections = document.querySelectorAll(`#show-stats>div.d-flex>*:not(#fact-title)`)
    // 0,1,2,3 in common_section 4,5,6 in tv_section 7,8 in movie_section 9 in common_section
    console.log(statSections)
    statSections.forEach(section => {
        if(section.id.startsWith(type)) {
            console.log('removed: ', section.id)
            section.remove()
            return
        }
        let resultSet = section.id.split('-')
        let section_attr = resultSet[1]
        console.log(section_attr)
        const section_text = result[section_attr]
        const section_div = section.querySelector('.stats-text')
        if(!section_text || Array.isArray(section_text) && (!section_text.length)) section.remove()
        if((section.id.endsWith('networks'))) {
            section_div.innerHTML =`<a href=${networkPage(section_text[0].id)}><img src=${fetchImage(section_text[0].logo_path)}></img></a>`
        }
        else if((section.id.endsWith('homepage'))) {
            section_div.innerHTML = `<a href=${section_text}>${section_text}</a>`
        }
        else if(section_attr==='budget' || section_attr==='revenue'){
            section_div.innerText = '$'+section_text
        }
        else section_div.innerText = section_text
    })
}

window.onload = async () => {
    // this shows the preloader
    showLoader()
    // home button
    homeButton()
    // this sets the current active button in page
    setActive()
    const resultDetails = await getMovieInfo(getShowURL(Id, show_status))
    // console.log(getShowURL(Id, show_status))
    if(!resultDetails) {
        alert('Cannot fetch details')
        window.history.back()
        return
    }
    var crewName = show_status==='movie' ? await getCrewDetails() : getCreatorDetails(resultDetails)
    if(show_status==='movie')
        displayMovieDetails(resultDetails, crewName)
    else
        displayTVShowDetails(resultDetails, crewName)

    await displayMoreDetails(resultDetails)
    displayMovieStats(resultDetails)    
    // youtube player btn
    await youtubePlayer(show_status=='movie' ? resultDetails.title : resultDetails.name)
}
