const form_el = document.querySelector("form");
const subdomains_el = document.getElementById("subdomains");
const error_el = document.getElementById("error");

const add_sd_el = (id, token) => {
    const new_el = document.createElement("div");
    new_el.innerHTML = `
        <div id="${id}">
            <input type="text" value="${id}" placeholder="Edit ${id}"/>
            <div class="token-container">
                <span class="token">${token}</span>
                <button class="remove ${id}">Delete</button>
                <button class="edit ${id}">Edit</button>
            </div>
        </div>
        `;

    new_el.querySelector(".remove").addEventListener("click", async (event) => {
        event.preventDefault();
        const id = new_el.querySelector(".remove").classList[1];

        const response = await fetch("/api/sd/remove", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subdomain: id
            }),
        });

        const { error } = await response.json();

        if (error) {
            error_el.innerText = error.message;
            return;
        }
        error_el.innerText = "";

        document.getElementById(id).remove();
    });

    new_el.querySelector(".edit").addEventListener("click", async (event) => {
        event.preventDefault();
        const id = new_el.querySelector(".edit").classList[1];

        const response = await fetch("/api/sd/edit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                subdomain: id
            }),
        });

        const { error } = await response.json();

        if (error) {
            error_el.innerText = error.message;
            return;
        }
        error_el.innerText = "";
    });

    new_el.querySelector(".token").addEventListener("click", async (event) => {
        navigator.clipboard.writeText(token);
    });

    subdomains_el.appendChild(new_el);
};

fetch("/api/sd/list").then(async (response) => {
    const { data, error } = await response.json();

    if (error) {
        error_el.innerText = error.message;
        return;
    }
    error_el.innerText = "";

    for (const subdomain of data) {
        add_sd_el(subdomain.id, subdomain.token);
    }
});

form_el.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (form_el.checkValidity() === false) {
        error_el.innerText = "Missing subdomain";
        form_el.reportValidity();
        return;
    }

    const response = await fetch("/api/sd/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            subdomain: document.getElementById("subdomain").value
        }),
    });

    const { data, error } = await response.json();

    if (error) {
        error_el.innerText = error.message;
        return;
    }
    error_el.innerText = "";

    add_sd_el(data.id, data.token);
});

Array.from(document.getElementsByClassName("token")).forEach((token) => {
    console.log(token.innerText);
    token});
