const USER = "waliem"
const REPOS_URL = `https://api.github.com/users/${USER}/repos`
const USER_INFO_URL = `https://api.github.com/users/${USER}`

const projectsContainer = document.getElementById("projects")
const userContainer = document.getElementById("user-info")

// function for getting my user info
const getUserInfo = () => {
  fetch(USER_INFO_URL)
    .then((response) => response.json())
    .then((data) => {
      userContainer.innerHTML += `
      <img class="profile-img" src="https://avatars.githubusercontent.com/u/84201089?v=4" alt="User profile picture">
      <span id="profile-name"> <a class="usr-name" href="https://github.com/waliem"><h2>${data.login}</h2></a> <h3>Front end developer student</h3><h3>Based in Gothenburg</h3></span>`
    })
}

// function for getting all my repos and filter them to get only technigo projects and displaying them in inner html
const getRepos = () => {
  fetch(REPOS_URL)
    .then((response) => response.json())
    .then((data) => {
      let forkedRepos = data.filter(
        (repo) => repo.fork && repo.name.startsWith("project-")
      )
      forkedRepos.forEach(
        (repo) =>
          (projectsContainer.innerHTML += `
        <div class="project-box"> 
        <a style="font-weight:bold" href="${repo.html_url}"> ${
            repo.name
          } </a> <p>Default branch: ${repo.default_branch}</p>
        <p>Most recent push: ${new Date(repo.pushed_at).toDateString()}</p>
        <p id="commit-${repo.name}">Commits: </p></div>`)
      )

      drawChart(forkedRepos.length)
      getPullRequests(forkedRepos)
    })
}

//function for fetching my pull requests
const getPullRequests = (forkedRepos) => {
  forkedRepos.forEach((repo) => {
    const PULLS_URL = `https://api.github.com/repos/technigo/${repo.name}/pulls?per_page=100`

    fetch(PULLS_URL)
      .then((res) => res.json())
      .then((data) => {
        const myPulls = data.find(
          (pull) => pull.user.login === repo.owner.login
        )
        // if/else conditon if I do not have any pull requests or commits it will display "no PR or commits done"
        if (myPulls) {
          getMyCommits(myPulls.commits_url, repo.name)
        } else {
          document.getElementById(
            `commit-${repo.name}`
          ).innerHTML = `<I>No pull request or commits done</I>`
        }
      })
  })
}

// function for getting the number of commits
const getMyCommits = (myCommitsUrl, myRepoName) => {
  fetch(myCommitsUrl)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById(`commit-${myRepoName}`).innerHTML += data.length
      console.log("my commits!", data)
    })
}

getUserInfo()
getRepos()
