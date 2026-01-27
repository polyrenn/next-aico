// utils/network.js
async function checkNetworkAndInternet() {
    if (!navigator.onLine) {
        return false;
    }

    try {
        const response = await fetch('/api/network-check');
        return response.ok;
    } catch (error) {
        return false;
    }
}

export default checkNetworkAndInternet;