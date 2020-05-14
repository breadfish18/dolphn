const token = localStorage.getItem("token");
if (!token) window.location.replace("/login");
const id = atob(token).split(".")[0];

(async () => {

    var app = new Vue({
        el: '#app',
        data: {
            server: null
        },
        methods: {
            login: async function () {
                return new Promise(async (resolve, reject) => {
                    const body = await fetch("/api/login", {
                        method: "GET",
                        headers: new Headers({
                            "Content-Type": "application/json",
                            "Authorization": token
                        }),
                    }).then(res => res.json()).catch(e => reject(e))
                    if (body && body.ok) {
                        return resolve(body.username);
                    } else {
                        return reject("Error");
                    }
                })
            },
            resolveInvite: async function (invite) {
                return new Promise(async (resolve, reject) => {
                    const body = await fetch(`/api/invites/${invite}`, {
                        method: "GET",
                        headers: new Headers({
                            "Content-Type": "application/json",
                            "Authorization": token
                        }),
                    }).then(res => res.json()).catch(e => reject(e))
                    if (body && body.server) {
                        return resolve(body.server);
                    } else {
                        return reject("Error");
                    }
                })
            },
            joinServer: async function () {
                const body = await fetch(`/api/invites/${location.pathname.split('/').pop()}`, {
                    method: "POST",
                    headers: new Headers({
                        "Content-Type": "application/json",
                        "Authorization": token
                    }),
                }).then(res => res.json()).catch(e => reject(e))
                if (body && body.server) {
                    window.location.replace("/chat")
                } else {
                    window.location.replace("/login")
                }
            }
        }
    })
    await app.login().catch(() => {
        localStorage.removeItem("token")
        location.replace("/login")
    });
    app.server = await app.resolveInvite(location.pathname.split("/").pop())
})();