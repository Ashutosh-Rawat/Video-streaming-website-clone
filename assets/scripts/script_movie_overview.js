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

async function movieReleaseDatesLocal() {
    let releaseDates = await fetchGenericURL(getMovieReleaseDatesLocalURL(Id))
    let indiaRelease = releaseDates.find(country => country.iso_3166_1 === 'IN')
    if(indiaRelease) {
        indiaRelease = indiaRelease.release_dates[0].release_date
        let num = indiaRelease.split('T')[0]
        num = num.split('-').reverse()
        return num.join('/')
    }
    else {
        return null
    }
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
    const story_crew = document.querySelector('#movie-direction-story-crew>ul')
    if(show_status==='movie') {
        crewName.forEach(crew => {
            const crew_li = document.createElement('li')
            story_crew.appendChild(crew_li)
            const flex_div = document.createElement('div')
            flex_div.classList.add('d-flex', 'row', 'gap-0', 'justify-content-between', 'align-items-center')
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
        flex_div.classList.add('d-flex', 'row', 'gap-0', 'justify-content-between', 'align-items-center')
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
async function getMovieCertification() {
    const data = await fetchJSON(getMovieCertificationURL(Id, show_status))
    if(show_status==='movie') {
        const releases = data.results
        const indiaRelease = releases.find(release => release.iso_3166_1 === 'IN')
        if (!indiaRelease) return null

        return indiaRelease.release_dates[0].certification;
    }
    else return data.results[0].rating 
}
async function displayMovieDetails(result, crewName) {
    await displayOverview(result, crewName)
    const local_dates = await movieReleaseDatesLocal()
    document.getElementById('movie-release-date').innerText = local_dates!=null ? local_dates+" (IN)" : result.release_date
    // watch time
    var runtime_hr = (result.runtime/60)>1 ? Math.floor(result.runtime/60)+'h' : ''
    var runtime_min = (result.runtime%60)>1 ? result.runtime%60+'m' : ''
    document.getElementById('movie-time').innerText = `${runtime_hr} ${runtime_min}`    
    console.log(result)
}

async function getTVShowDetails(result, crewName) {
    await displayOverview(result, crewName)
    // remove dots that are between release-year and local-release dates
    movie_secondary_details_div = document.getElementById('movie-secondary-details')
    document.querySelectorAll('.dot').forEach(div => {
        div.style.display = 'None'
    })
    console.log(result)
}
async function displayOverview(result, crewName) {
    // background image wrapper
    const bg_wrapper = document.getElementById('movie-bg-wrapper')
    let root = document.documentElement
    root.style.setProperty('--backdrop-image', `url(${fetchImage(result.backdrop_path)})`)
    // image poster
    bg_wrapper.querySelector('#movie-banner img').src = fetchImage(result.poster_path) 
    // movie_title
    document.getElementById('movie-name').innerText = result.title ? result.title : result.name
    // release year
    var release_year = show_status==='movie' ? result.release_date.split('-')[0] : result.first_air_date.split('-')[0]
    document.getElementById('movie-release-year').innerText = `(${release_year})`
    
    // for showing either movie is ua or 18+ or 19+
    const movie_certification_status = document.getElementById('movie-certification-status')
    movie_certification_status.innerText = await getMovieCertification()   
    movie_certification_status.classList.add('border', 'px-1', 'border-secondary', 'text-secondary')
    movie_certification_status.style.borderRadius = '3px'
    // for showing genres
    const movie_secondary = document.getElementById('movie-secondary-details')
    let genre_list = []
    result.genres.forEach(element => {
        genre_list.push(element.name)
    })
    movie_secondary.querySelector('#movie-genre>div.col').innerText = genre_list.join(', ')
    // user ratings
    const user_rating = Math.round(result.vote_average*10)
    document.documentElement.style.setProperty('--rating-value', user_rating)
    $('#circle').circleProgress({
        startAngle: -Math.PI / 2,
        value: user_rating / 100,
        size: 60,
        fill: {
            color: 'blue'
        }
    }).on('circle-animation-progress', function(event, progress) {
        $('#value').html(Math.round(user_rating * progress))
    })    
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

window.onload = async () => {
    // this shows the preloader
    showLoader()
    // home button
    homeButton()
    // this sets the current active button in page
    setActive()
    const resultDetails = await getMovieInfo(getShowURL(Id, show_status))
    if(!resultDetails) {
        alert('Cannot fetch details')
        window.history.back()
        return
    }
    var crewName = show_status==='movie' ? await getCrewDetails() : getCreatorDetails(resultDetails)
    if(show_status==='movie')
        displayMovieDetails(resultDetails, crewName)
    else
        getTVShowDetails(resultDetails, crewName)
    // youtube player btn
    await youtubePlayer(show_status=='movie' ? resultDetails.title : resultDetails.name)
}
