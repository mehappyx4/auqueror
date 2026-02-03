// User Management Functions
export const fetchUsers = async () => {
    const res = await fetch("/api/users")
    if (res.ok) {
        return await res.json()
    }
    return []
}

export const createUser = async (data: { email: string; password: string; name: string; role: string }) => {
    const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    return res.ok
}

export const updateUser = async (data: { id: string; email?: string; password?: string; name?: string; role?: string }) => {
    const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    })
    return res.ok
}

export const deleteUser = async (id: string) => {
    const res = await fetch(`/api/users?id=${id}`, {
        method: "DELETE"
    })
    return res.ok
}
