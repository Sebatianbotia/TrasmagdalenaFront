const API_URL = 'http://localhost:8080/api/v1/auth'

export const authService = {
    async login(email,password){
        const response = await fetch(`${API_URL}/login`,{
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({email,password})
        })
        if(!response.ok){
            throw new Error("Credenciales invalidas")
        }
        return await response.json();
    },

    logout(){
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    },

    getCurrentUser(){
        const userStr = localStorage.getItem('user')
        return userStr ? JSON.parse(userStr) : null
    },
    
    isAuthenticated(){
        return localStorage.getItem('token')
    }
}