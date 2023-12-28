
const API_URL = 'v1/'

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}planets`)
  const data = await response.json()
  return data
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}launches`)
  const data = await response.json()
  const launches = data.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  })
  return launches
}

async function httpSubmitLaunch(launch) {
  try{
    const response = await fetch(`${API_URL}launches`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(launch),
    });
    return response
  }catch(err){
    return {
      ok: false
    }
  }
}


async function httpAbortLaunch(id) {
  try{
    const response = await fetch(`${API_URL}launches/${id}`, {
      method: 'DELETE'
    });
    return response
  }catch(err){
    return {
      ok: false
    }
  }
}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};