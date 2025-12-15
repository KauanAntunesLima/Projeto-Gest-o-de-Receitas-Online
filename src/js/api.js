const API_BASE = 'http://localhost:8080/v1/toque_gourmet';

async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`API Error in ${endpoint}:`, error);
        return null;
    }
}

export const recipeAPI = {
    getAll: () => apiRequest('/receita'),
    getById: (id) => apiRequest(`/receita/${id}`),
    getByUser: (userId) => apiRequest(`/receita/usuario/${userId}`),
    getByName: (name) => apiRequest(`/receita/nome/${encodeURIComponent(name)}`),
    create: (formData) => {
        return fetch(`${API_BASE}/receita/upload`, {
            method: 'POST',
            body: formData
        }).then(response => response.json());
    },
    update: (id, data) => apiRequest(`/receita/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),
    updateWithImage: (id, formData) => {
        return fetch(`${API_BASE}/receita/upload/${id}`, {
            method: 'PUT',
            body: formData
        }).then(response => response.json());
    },
    delete: (id) => apiRequest(`/receita/${id}`, {
        method: 'DELETE'
    }),
    filter: (filters) => apiRequest('/receita/filtro', {
        method: 'POST',
        body: JSON.stringify(filters)
    })
};

export const userAPI = {
    login: (credentials) => apiRequest('/usuario/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    }),
    register: (userData) => apiRequest('/usuario', {
        method: 'POST',
        body: JSON.stringify(userData)
    })
};

export const ratingAPI = {
    submit: (ratingData) => apiRequest('/avaliacao', {
        method: 'POST',
        body: JSON.stringify(ratingData)
    })
};

export const categoryAPI = {
    getAll: () => apiRequest('/categoria')
};

export const kitchenAPI = {
    getAll: () => apiRequest('/cozinha')
};

export const allergenAPI = {
    getAll: () => apiRequest('/alergenos')
};

export { apiRequest, API_BASE };